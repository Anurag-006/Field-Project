import { Document, Types } from "mongoose";

export interface IUserMethods {
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    employeeId: string;
    publications: Types.ObjectId[];
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
}