import { Document, Types } from "mongoose";
import { Request } from "express";

export interface JwtPayload {
    _id: string;
    email: string;
    role: "admin" | "user";
    employeeId: string;
}

// Base user interface with common properties
export interface IUserBase {
    name: string;
    email: string;
    role: "admin" | "user";
    employeeId: string;
    publications: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

// Interface for the Mongoose document
export interface IUser extends Document, IUserBase {
    password: string;
    refreshToken?: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

// Interface for lean queries (plain objects)
export interface LeanUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: "admin" | "user";
    employeeId: string;
    publications: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

// Extended Express Request interface
export interface AuthRequest extends Request {
    user?: LeanUser;
}