import { HttpError } from 'routing-controllers';
import { EHttpStatusCode } from 'src/utils/enum';

export class BaseResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  resultCount?: number;
  errors?: any;
  statusCode: EHttpStatusCode;

  constructor(
    data?: T,
    message = 'Success',
    success = true,
    resultCount?: number,
    errors?: any,
    statusCode: EHttpStatusCode = EHttpStatusCode.OK,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.resultCount = resultCount;
    this.errors = errors;
    this.statusCode = statusCode;
  }

  static success<T>(
    data: T,
    resultCount?: number,
    message = 'Success',
    statusCode = EHttpStatusCode.OK,
  ) {
    try {
      return new BaseResponse<T>(
        data,
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
    data?: T,
  ) {
    try {
      return new BaseResponse<T>(
        data,
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
