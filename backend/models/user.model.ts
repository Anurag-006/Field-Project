import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ms from "ms";
import { IUser, IUserMethods } from "../controllers/user.controller.js";

const userSchema = new Schema<IUser, {}, IUserMethods>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: [true, "Password is required"] },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    employeeId: { type: String, required: true },
    publications: [{
      type: Schema.Types.ObjectId,
      ref: "Publication",
      required: false,
    }],
    refreshToken: { type: String},

  }, {timestamps: true});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }

  const payload = {
    _id: this._id,
    email: this.email,
    role: this.role,
    employeeId: this.employeeId,
  };

  const options: jwt.SignOptions = {
    expiresIn: ms('1h') / 1000 // Convert to seconds
  };

  return jwt.sign(
    payload, 
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    options
  );
}

userSchema.methods.generateRefreshToken = function() {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }

  const payload = {
    _id: this._id,
  };

  const options: jwt.SignOptions = {
    expiresIn: ms('30d') / 1000 // Convert to seconds
  };

  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
    options
  );
}

export const User = model("User", userSchema)