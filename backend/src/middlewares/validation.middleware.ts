import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { BaseResponse } from "src/common/base-response";
import { EHttpStatusCode } from "src/utils/enum";

export function ValidationMiddleware(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoInstance);
        console.log(errors);
        if (errors.length > 0) {
            const constraints = errors.map(error => error.constraints);
            return res.status(400).json(BaseResponse.error("Invalid data", EHttpStatusCode.BAD_REQUEST, constraints));
        }

        next();
    };
}