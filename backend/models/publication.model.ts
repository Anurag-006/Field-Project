import { Schema, model } from "mongoose";

const AuthorSchema = new Schema({
    name: { type: String, required: true },
    affiliation: { type: String, required: true },
}, { _id: false });

const publicationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        trim: true,
    },


    facultyName: { type: String, required: true },

    employeeId: { type: String, required: true },

    rigNo: { type: String, required: true },

    academicYear: { type: String, required: true },

    authors: {
        type: [AuthorSchema],
        validate: [(arr: string | any[]) => arr.length <= 6, 'Max 6 authors allowed'],
        required: true
    },

    facultyAuthorPosition: { type: Number, required: true },

    doesPaperBelongToStudent: { type: Boolean, required: true },

    type: {
        type: String,
        enum: ["journal", "conference", "bookChapter", "book"],
        required: true,
    },
    fullPaperFile: { type: String },

    indexingProofFile: { type: String },
}, {
    timestamps: true,
    discriminatorKey: 'type',
});


export const Publication = model("Publication", publicationSchema);
