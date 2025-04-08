import { Service } from 'typedi';
import DiscountCode from '@/models/discount-code.model';
import DiscountCodeCast, { EDiscountCodeType } from '@/models/discount-code-cast.model';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import mongoose from 'mongoose';
import { CreateDiscountCodeCastDto, ValidateDiscountCodeDto } from './dto/discount-code.dto';

@Service()
export class DiscountCodeService {
    /**
     * Creates a new discount code cast
     * @param createDto The data to create the discount code cast
     * @returns The created discount code cast
     */
    public async createDiscountCodeCast(createDto: CreateDiscountCodeCastDto): Promise<BaseResponse<any>> {
        try {
            // Ensure either discountPercentage or discountAmount is provided, but not both
            if ((createDto.discountPercentage && createDto.discountAmount) || 
               (!createDto.discountPercentage && !createDto.discountAmount)) {
                return BaseResponse.error(
                    'A discount code must have either a percentage OR an amount, but not both and not neither',
                    EHttpStatusCode.BAD_REQUEST
                );
            }

            // If percentage is provided, set amount to 0 and vice versa
            const discountCodeCastData = {
                ...createDto,
                discountPercentage: createDto.discountPercentage || 0,
                discountAmount: createDto.discountAmount || 0
            };

            // Create the discount code cast
            const discountCodeCast = new DiscountCodeCast(discountCodeCastData);
            await discountCodeCast.save();

            // Generate the specified quantity of discount codes
            const discountCodes = [];
            for (let i = 0; i < createDto.quantity; i++) {
                const uniqueCode = `${createDto.code}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                discountCodes.push({
                    uniqueCode: discountCodeCast._id,
                    code: uniqueCode,
                    isUsed: false
                });
            }

            // Save the discount codes
            const savedCodes = await DiscountCode.insertMany(discountCodes);

            return BaseResponse.success({
                discountCodeCast,
                discountCodes: savedCodes
            });
        } catch (error: any) {
            return BaseResponse.error(
                error.message || 'Failed to create discount code cast',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Validates and applies a product discount code
     * @param code The discount code to validate
     * @returns Object containing validation result and discount code ID if valid
     */
    public async validateProductDiscountCode(code: string): Promise<BaseResponse<{
        discountId: mongoose.Types.ObjectId,
        discountType: string,
        discountValue: number
    } | null>> {
        // Find the discount code
        const discountCode = await DiscountCode.findOne({ code });

        // Verify the discount code exists
        if (!discountCode) {
            return BaseResponse.error(
                `Product discount code ${code} not found`,
                EHttpStatusCode.NOT_FOUND
            );
        }

        // Find the discount code cast to verify type and other details
        const discountCodeCast = await DiscountCodeCast.findOne({
            _id: discountCode.code
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

        // Determine discount type (percentage or fixed amount)
        const discountType = discountCodeCast.discountPercentage > 0 ? 'percentage' : 'fixed';
        const discountValue = discountType === 'percentage' ? 
            discountCodeCast.discountPercentage : 
            discountCodeCast.discountAmount;

        // Mark the discount code as used
        discountCode.isUsed = true;
        await discountCode.save();

        return BaseResponse.success({
            discountId: discountCode._id as mongoose.Types.ObjectId,
            discountType,
            discountValue
        });
    }

    /**
     * Validates and applies a shipping discount code
     * @param code The discount code to validate
     * @returns Object containing validation result and discount code ID if valid
     */
    public async validateShippingDiscountCode(code: string): Promise<BaseResponse<{
        discountId: mongoose.Types.ObjectId,
        discountType: string,
        discountValue: number
    } | null>> {
        // Find the discount code
        const discountCode = await DiscountCode.findOne({ code });

        // Verify the discount code exists
        if (!discountCode) {
            return BaseResponse.error(
                `Shipping discount code ${code} not found`,
                EHttpStatusCode.NOT_FOUND
            );
        }

        // Find the discount code cast to verify type and other details
        const discountCodeCast = await DiscountCodeCast.findOne({
            _id: discountCode.code
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

        // Determine discount type (percentage or fixed amount)
        const discountType = discountCodeCast.discountPercentage > 0 ? 'percentage' : 'fixed';
        const discountValue = discountType === 'percentage' ? 
            discountCodeCast.discountPercentage : 
            discountCodeCast.discountAmount;

        // Mark the shipping discount code as used
        discountCode.isUsed = true;
        await discountCode.save();

        return BaseResponse.success({
            discountId: discountCode._id as mongoose.Types.ObjectId,
            discountType,
            discountValue
        });
    }
}