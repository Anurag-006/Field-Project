import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: String,
    email: String,
    employeeId: String,
    publications: [{
        type: Schema.Types.ObjectId,
        ref: "Publication"
    }]
})

const User = model("User", userSchema)