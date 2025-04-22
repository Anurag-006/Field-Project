import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    employeeId: { type: String, required: true },
    publications: [{
      type: Schema.Types.ObjectId,
      ref: "Publication",
      required: false,
    }]
  });

export const User = model("User", userSchema)