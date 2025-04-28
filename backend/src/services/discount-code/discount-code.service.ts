import { Service } from 'typedi';
import DiscountCode from '@/models/discount-code.model';
import DiscountCodeCast, { EDiscountCodeType, EDiscountCalculationMethod } from '@/models/discount-code-cast.model';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import mongoose from 'mongoose';
import {
    DiscountCodeDto,
    DiscountCodeCastDto,
    CreateDiscountCodeCastDto,
} from './dto/discount-code.dto';
import { BaseGetAllDto } from '@/common/base-get-all-dto';
import { buildQuery } from '@/utils/utils';
import { StringEntityDto } from '@/common/entity-dto';
import redis from '@/config/redis';

@Service()
export class DiscountCodeService {
    public async getAllDiscountCodeCasts(dto: BaseGetAllDto): Promise<BaseResponse<DiscountCodeCastDto[]>> {
        try {
            // Fetch all discount codes from the database
            const query = buildQuery(dto);
            const discountCodes = await DiscountCodeCast.find(query).skip(dto.skipCount).limit(dto.maxResultCount).populate('discountCodeCastId', 'code type quantity discountCalculationMethod discountQuantity expiryDate');

            // Check if any discount codes were found
            if (!discountCodes || discountCodes.length === 0) {
                return BaseResponse.error(
                    'No discount codes found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            // Map the discount codes to the response format
            const responseData = discountCodes.map((code) => ({
                _id: code._id,
                code: code.code,
                type: code.type,
                quantity: code.quantity,
                discountCalculationMethod: code.discountCalculationMethod,
                discountQuantity: code.discountQuantity,
                expiryDate: code.expiryDate
            }));

            return BaseResponse.success(responseData);
        } catch (error: any) {
            return BaseResponse.error(
                error.message || 'Failed to fetch discount codes',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async getDiscountCodeCastById(id: string): Promise<BaseResponse<DiscountCodeCastDto>> {
        try {
            // Fetch the discount code by ID from the database
            const discountCode = await DiscountCodeCast.findById(id);

            // Check if the discount code was found
            if (!discountCode) {
                return BaseResponse.error(
                    `Discount code with ID ${id} not found`,
                    EHttpStatusCode.NOT_FOUND
                );
            }

            // Map the discount code to the response format
            const responseData = {
                _id: discountCode._id,
                code: discountCode.code,
                type: discountCode.type,
                quantity: discountCode.quantity,
                discountCalculationMethod: discountCode.discountCalculationMethod,
                discountQuantity: discountCode.discountQuantity,
                expiryDate: discountCode.expiryDate
            };

            return BaseResponse.success(responseData);
        } catch (error: any) {
            return BaseResponse.error(
                error.message || 'Failed to fetch discount code',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async getDiscountCodeCustomer(id: string): Promise<BaseResponse<DiscountCodeDto | any>> {
        try {
            // Fetch the discount code by ID from the database
            const discountCode = await DiscountCode.findById(id);

            // Check if the discount code was found
            if (!discountCode) {
                return BaseResponse.error(
                    `Discount code with ID ${id} not found`,
                    EHttpStatusCode.NOT_FOUND
                );
            }

            // Map the discount code to the response format
            const responseData = {
                id: discountCode._id,
                code: discountCode.code,
                customerId: discountCode.customerId,
                isUsed: discountCode.isUsed,
            };

            return BaseResponse.success(responseData);
        } catch (error: any) {
            return BaseResponse.error(
                error.message || 'Failed to fetch discount code',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    // public async updateDiscountCodeCast(dto: StringEntityDto): Promise<BaseResponse<DiscountCodeCastDto>> {
    //     try {
    //         // Fetch the discount code by ID from the database
    //         const discountCode = await DiscountCodeCast.findById(dto.id);
    //     } catch (error: any) {
    //         return BaseResponse.error(
    //             error.message || 'Failed to fetch discount code',
    //             EHttpStatusCode.INTERNAL_SERVER_ERROR
    //         );
    //     }
    // } 

    public async deleteDiscountCodeCast(dto: StringEntityDto): Promise<BaseResponse<boolean>> {
        try {
            // Delete the discount code by ID from the database
            const discountCodeCast = await DiscountCodeCast.findByIdAndDelete(dto.id);

            // Check if the discount code was found
            if (!discountCodeCast) {
                return BaseResponse.error(
                    `Discount code with ID ${dto.id} not found`,
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success(true, undefined, 'Discount code deleted successfully');
        } catch (error: any) {
            return BaseResponse.error(
                error.message || 'Failed to delete discount code',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }


    /**
     * Creates a new discount code cast
     * @param createDto The data to create the discount code cast
     * @returns The created discount code cast
     */
    public async createDiscountCodeCast(createDto: CreateDiscountCodeCastDto): Promise<BaseResponse<DiscountCodeCastDto>> {
        try {
            // If percentage is provided, set amount to 0 and vice versa
            const discountCodeCastData = {
                code: createDto.code,
                type: createDto.type,
                discountCalculationMethod: createDto.discountCalculationMethod,
                discountQuantity: createDto.discountQuantity,
                expiryDate: createDto.expiryDate,
                quantity: createDto.quantity
            };

            // Create the discount code cast
            const discountCodeCast = new DiscountCodeCast(discountCodeCastData);
            await discountCodeCast.save();

            // this.createDiscountCodesFromCast(discountCodeCast);

            return BaseResponse.success({
                _id: discountCodeCast._id,
                code: discountCodeCast.code,
                type: discountCodeCast.type,
                quantity: discountCodeCast.quantity,
                discountCalculationMethod: discountCodeCast.discountCalculationMethod,
                discountQuantity: discountCodeCast.discountQuantity,
                expiryDate: discountCodeCast.expiryDate
            });
        } catch (error: any) {
            return BaseResponse.error(
                error.message || 'Failed to create discount code cast',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }


    public async claimDiscountCode(customerId: string, code: StringEntityDto): Promise<BaseResponse<DiscountCodeDto>> {
        try {
            if (!customerId) {
                return BaseResponse.error(
                    'Customer ID is required',
                    EHttpStatusCode.BAD_REQUEST
                );
            }

            if (await redis.get(`discount-code-cooldown:${code.id}`) == customerId) {
                return BaseResponse.error(
                    `You have already claimed this discount code. Please wait for 48 hours before claiming again.`,
                    EHttpStatusCode.BAD_REQUEST);
            }

            // Find the discount code            
            const discountCodeCast = await DiscountCodeCast.findOne({ code: code.id });

            // Verify the discount code exists
            if (!discountCodeCast) {
                return BaseResponse.error(
                    `Discount code ${code.id} not found`,
                    EHttpStatusCode.NOT_FOUND
                );
            }

            if (discountCodeCast.quantity <= 0) {
                return BaseResponse.error(
                    `Discount code ${code.id} has no remaining quantity`, EHttpStatusCode.BAD_REQUEST
                );
            }
            discountCodeCast.quantity -= 1;

            const discountCode = new DiscountCode({
                code: discountCodeCast.code,
                customerId: customerId,
                isUsed: false
            });

            await discountCode.save();
            await discountCodeCast.save();

            redis.set(`discount-code-cooldown:${code.id}`, customerId.toString(), 60 * 60 * 36); // Set expiration to 36 hours

            return BaseResponse.success({
                id: discountCode._id,
                code: discountCode.code,
                type: discountCodeCast.type,
                discountCalculationMethod: discountCodeCast.discountCalculationMethod,
                discountQuantity: discountCodeCast.discountQuantity,
                expiryDate: discountCodeCast.expiryDate,
                customerId: discountCode.customerId,
                isUsed: discountCode.isUsed
            }, undefined, 'Discount code claimed successfully', EHttpStatusCode.CREATED);
        } catch (error: any) {
            return BaseResponse.error(
                error.message || 'Failed to claim discount code',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
    /**
     * Validates and applies a product discount code
     * @param code The discount code to validate
     * @returns Object containing validation result and discount code ID if valid
     */
    public async validateProductDiscountCode(code: string): Promise<BaseResponse<DiscountCodeDto>> {
        try {
            // Find the discount code - FIX: Pass the ID directly, not in an object
            const codeId = new mongoose.Types.ObjectId(code);
            const discountCode = await DiscountCode.findById(codeId);

            // Verify the discount code exists
            if (!discountCode) {
                return BaseResponse.error(
                    `Product discount code ${code} not found`,
                    EHttpStatusCode.NOT_FOUND
                );
            }

            const discount = await redis.get(`discount-code-value:${discountCode.code}`);
            if (discount) {
                const discountCodeRedis = JSON.parse(discount);
                discountCode.isUsed = true;
                await discountCode.save();
                if (new Date() > discountCodeRedis.expiryDate) {
                    return BaseResponse.error(
                        `Product discount code ${code} has expired`,
                        EHttpStatusCode.BAD_REQUEST
                    );
                }
                return BaseResponse.success({
                    code,
                    // customerId: discountCode.customerId,
                    type: discountCodeRedis.type,
                    discountCalculationMethod: discountCodeRedis.discountCalculationMethod,
                    discountQuantity: discountCodeRedis.discountQuantity,
                    expiryDate: discountCodeRedis.expiryDate,
                    isUsed: true
                });
            }

            // Find the discount code cast to verify type and other details
            const discountCodeCast = await DiscountCodeCast.findOne({
                code: discountCode.code
            });

            // Check if the code is for product discounts
            if (!discountCodeCast || discountCodeCast.type !== EDiscountCodeType.ProductDiscount) {
                return BaseResponse.error(
                    `${code} is not a valid product discount code`,
                    EHttpStatusCode.BAD_REQUEST
                );
            }

            // Check if the code is already used
            if (discountCode.isUsed) {
                return BaseResponse.error(
                    `Product discount code ${code} has already been used`,
                    EHttpStatusCode.BAD_REQUEST
                );
            }

            // Check if the code is expired
            if (new Date() > discountCodeCast.expiryDate) {
                return BaseResponse.error(
                    `Product discount code ${code} has expired`,
                    EHttpStatusCode.BAD_REQUEST
                );
            }

            // Mark the discount code as used
            discountCode.isUsed = true;
            await discountCode.save();

            // Store the discount code in Redis with a 36-hour expiration
            redis.set(`discount-code-value:${discountCode.code}`, JSON.stringify({
                type: discountCodeCast.type,
                discountCalculationMethod: discountCodeCast.discountCalculationMethod,
                discountQuantity: discountCodeCast.discountQuantity,
                expiryDate: discountCodeCast.expiryDate
            }), 60 * 60 * 24);

            return BaseResponse.success({
                code: discountCode.code,
                // customerId: discountCode.customerId,
                type: discountCodeCast.type,
                discountCalculationMethod: discountCodeCast.discountCalculationMethod,
                discountQuantity: discountCodeCast.discountQuantity,
                expiryDate: discountCodeCast.expiryDate,
                isUsed: true
            });
        } catch (error: any) {
            return BaseResponse.error(
                error.message || 'Failed to validate product discount code',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Validates and applies a shipping discount code
     * @param code The discount code to validate
     * @returns Object containing validation result and discount code ID if valid
     */
    public async validateShippingDiscountCode(code: string): Promise<BaseResponse<DiscountCodeDto>> {
        try {
            // Find the discount code - FIX: Pass the ID directly, not in an object
            const codeId = new mongoose.Types.ObjectId(code);
            const discountCode = await DiscountCode.findById(codeId);

            // Verify the discount code exists
            if (!discountCode) {
                return BaseResponse.error(
                    `Shipping discount code ${code} not found`,
                    EHttpStatusCode.NOT_FOUND
                );
            }

            // Find the discount code cast to verify type and other details
            const discountCodeCast = await DiscountCodeCast.findOne({
                code: discountCode.code
            });

            // Check if the code is for shipping discounts
            if (!discountCodeCast || discountCodeCast.type !== EDiscountCodeType.ShippingDiscount) {
                return BaseResponse.error(
                    `${code} is not a valid shipping discount code`,
                    EHttpStatusCode.BAD_REQUEST
                );
            }

            // Check if the code is already used
            if (discountCode.isUsed) {
                return BaseResponse.error(
                    `Shipping discount code ${code} has already been used`,
                    EHttpStatusCode.BAD_REQUEST
                );
            }

            // Check if the code is expired
            if (new Date() > discountCodeCast.expiryDate) {
                return BaseResponse.error(
                    `Shipping discount code ${code} has expired`,
                    EHttpStatusCode.BAD_REQUEST
                );
            }

            // Mark the shipping discount code as used
            discountCode.isUsed = true;
            await discountCode.save();

            return BaseResponse.success({
                code: discountCode.code,
                customerId: discountCode.customerId,
                type: discountCodeCast.type,
                discountCalculationMethod: discountCodeCast.discountCalculationMethod,
                discountQuantity: discountCodeCast.discountQuantity,
                expiryDate: discountCodeCast.expiryDate,
                isUsed: true
            });
        } catch (error: any) {
            return BaseResponse.error(
                error.message || 'Failed to validate shipping discount code',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}