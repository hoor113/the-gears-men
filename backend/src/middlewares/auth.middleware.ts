import { Request, Response, NextFunction } from "express";
import { verifyToken } from "src/config/jwt";
import { BaseResponse } from "../common/base-response";
import PUBLIC_ROUTES from "src/constants/public-endpoints";

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (PUBLIC_ROUTES.includes(req.path)) {
    return next(); // Bỏ qua kiểm tra xác thực với public routes
  }

  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json(BaseResponse.error("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json(BaseResponse.error("Token missing", 401));
  }

  try {
    verifyToken(token); 
    next();
  } catch (error) {
    return res.status(401).json(BaseResponse.error("Invalid or expired token", 401));
  }
};