import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Response, NextFunction } from "express";
import { JwtPayload, AuthRequest, LeanUser } from "../types/auth.types.js";

export const verifyJWT = asyncHandler(async (
    req: AuthRequest,
    _: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.accessToken || 
                     req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new ApiError(500, "Access Token Secret is not defined");
        }
    
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as jwt.Secret
        ) as JwtPayload;
    
        const user = await User.findById(decodedToken._id)
            .select("-password -refreshToken")
            .lean()
            .then(doc => {
                if (!doc) return null;
                return doc as unknown as LeanUser;
            });
    
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }
    
        req.user = user;
        next();
    } catch (error: any) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});