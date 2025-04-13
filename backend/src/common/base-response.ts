import { HttpError } from 'routing-controllers';
import { EHttpStatusCode } from 'src/utils/enum';

export class BaseResponse<T> {
    success: boolean;
    message?: string;
    result?: T;
    resultCount?: number;
    errors?: any;
    statusCode: EHttpStatusCode;

    constructor(
        result?: T,
        message = 'Success',
        success = true,
        resultCount?: number,
        errors?: any,
        statusCode: EHttpStatusCode = EHttpStatusCode.OK,
    ) {
        this.success = success;
        this.message = message;
        this.result = result;
        this.resultCount = resultCount;
        this.errors = errors;
        this.statusCode = statusCode;
    }

    static success<T>(
        result: T,
        resultCount?: number,
        message = 'Success',
        statusCode = EHttpStatusCode.OK,
    ) {
        try {
            return new BaseResponse<T>(
                result,
                message,
                true,
                resultCount,
                undefined,
                statusCode,
            );
        } catch (error) {
            throw new HttpError(
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                (error as any)?.message,
            );
        }
    }

    static error<T>(
        message: string,
        statusCode = EHttpStatusCode.BAD_REQUEST,
        errors?: any,
        result?: T,
    ) {
        try {
            return new BaseResponse<T>(
                result,
                message,
                false,
                undefined,
                errors,
                statusCode,
            );
        } catch (error) {
            throw new HttpError(
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                (error as any)?.message,
            );
        }
    }
}
