import shipment, { EshipmentRole } from '@/models/shipment.model';
import bcrypt from 'bcrypt';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { buildQuery } from 'src/utils/utils';
import { Service } from 'typedi';
import {
    CreateshipmentDto,
    GetAllshipmentsDto,
    UpdateshipmentDto,
    shipmentDto,
} from './dto/shipment.dto';

@Service()
export class shipmentService {
    public async createshipment(
        dto: CreateshipmentDto,
    ): Promise<BaseResponse<shipmentDto | unknown>> {
        try {
            const {
                shipmentname,
                fullname,
                email,
                password,
                role,
                phoneNumber,
                addresses,
                avatarPicture,
                vehicleLicenseNumber,
            } = dto;

            if (role === EshipmentRole.Admin) {
                return BaseResponse.error('You cannot create an admin shipment');
            }

            const existingshipment = await shipment.findOne({ email });
            if (existingshipment) {
                return BaseResponse.error('Email already exists');
            }

            const existingshipmentName = await shipment.findOne({ shipmentname });
            if (existingshipmentName) {
                return BaseResponse.error('shipmentname already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newshipment = new shipment({
                shipmentname,
                fullname,
                email,
                password: hashedPassword,
                role,
                phoneNumber,
                addresses,
                avatarPicture,
                vehicleLicenseNumber,
            });

            await newshipment.save();

            const shipmentDto: shipmentDto = {
                id: newshipment._id.toString(),
                shipmentname: newshipment.shipmentname,
                fullname: newshipment.fullname,
                email: newshipment.email,
                role: newshipment.role,
                phoneNumber: newshipment.phoneNumber,
                addresses: newshipment.addresses,
                avatarPicture: newshipment.avatarPicture,
                vehicleLicenseNumber: newshipment.vehicleLicenseNumber,
            };

            return BaseResponse.success(
                shipmentDto,
                undefined,
                'shipment created successfully',
                EHttpStatusCode.CREATED,
            );
        } catch (error) {
            return BaseResponse.error(
                'Error creating shipment',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async getAllshipments(
        dto: GetAllshipmentsDto,
    ): Promise<BaseResponse<shipmentDto[] | unknown>> {
        try {
            const searchableFields = ['shipmentname', 'fullname', 'email'];
            const query = buildQuery(dto, searchableFields);

            const totalRecords = await shipment.countDocuments(query);
            const shipments = await shipment.find(query)
                .skip(dto.skipCount)
                .limit(dto.maxResultCount);

            const shipmentDtos: shipmentDto[] = shipments.map((shipment) => ({
                id: shipment._id.toString(),
                shipmentname: shipment.shipmentname,
                fullname: shipment.fullname,
                email: shipment.email,
                role: shipment.role,
                phoneNumber: shipment.phoneNumber,
                addresses: shipment.addresses,
                avatarPicture: shipment.avatarPicture,
                vehicleLicenseNumber: shipment.vehicleLicenseNumber,
            }));

            return BaseResponse.success(shipmentDtos, totalRecords);
        } catch (error) {
            return BaseResponse.error(
                'Error fetching shipments',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async getshipmentById(
        id: string,
    ): Promise<BaseResponse<shipmentDto | unknown>> {
        try {
            const shipment = await shipment.findById(id);
            if (!shipment) {
                return BaseResponse.error('shipment not found');
            }

            if (shipment.role === EshipmentRole.Admin) {
                return BaseResponse.error('You cannot view an admin shipment');
            }

            const shipmentDto: shipmentDto = {
                id: shipment._id.toString(),
                shipmentname: shipment.shipmentname,
                fullname: shipment.fullname,
                email: shipment.email,
                role: shipment.role,
                phoneNumber: shipment.phoneNumber,
                addresses: shipment.addresses,
                avatarPicture: shipment.avatarPicture,
                vehicleLicenseNumber: shipment.vehicleLicenseNumber,
            };

            return BaseResponse.success(shipmentDto);
        } catch (error) {
            return BaseResponse.error(
                'Error fetching shipment',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async updateshipment(
        dto: UpdateshipmentDto,
    ): Promise<BaseResponse<shipmentDto>> {
        try {
            const existingshipment = await shipment.findById(dto.id);
            if (!existingshipment) {
                return BaseResponse.error('shipment not found');
            }

            // Cập nhật dữ liệu
            Object.assign(existingshipment, dto);
            await existingshipment.save();

            // Chuyển đổi sang shipmentDto
            const shipmentDto: shipmentDto = {
                id: existingshipment.id,
                shipmentname: existingshipment.shipmentname,
                fullname: existingshipment.fullname,
                email: existingshipment.email,
                role: existingshipment.role,
                phoneNumber: existingshipment.phoneNumber,
                addresses: existingshipment.addresses,
                avatarPicture: existingshipment.avatarPicture,
                vehicleLicenseNumber: existingshipment.vehicleLicenseNumber,
            };

            return BaseResponse.success(shipmentDto);
        } catch (error) {
            return BaseResponse.error(
                'Error updating shipment',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async deleteshipment(
        id: string,
    ): Promise<BaseResponse<boolean | unknown>> {
        try {
            const deletedshipment = await shipment.findByIdAndDelete(id);
            if (!deletedshipment) {
                return BaseResponse.error('shipment not found');
            }

            if (deletedshipment.role === EshipmentRole.Admin) {
                return BaseResponse.error('You cannot delete an admin shipment');
            }

            return BaseResponse.success(
                true,
                undefined,
                'shipment deleted successfully',
            );
        } catch (error) {
            return BaseResponse.error(
                'Error deleting shipment',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }
}
