import { Schema } from "mongoose";
import { Publication } from "./publication.model";

const journalSchema = new Schema({
    journalName: { type: String, required: true },
    journalQuartile: { type: String, required: true },
    paperTitle: { type: String, required: true },
    volumeIssue: { type: String, required: true },
    pageNumbers: { type: String, required: true },
    publicationMonth: {
        type: String,
        enum: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ],
        required: true
    },
    publicationYear: {
        type: String,
        match: /^\d{4}$/,
        required: true
    },
    indexing: { type: String, required: true },
    issnNumber: { type: String, required: true },
    impactFactor: { type: Number, required: true },
    publisherName: { type: String, required: true },
    paperLink: {
        type: String,
        match: /^https?:\/\/.+/,
        required: true
    },
    journalLink: {
        type: String,
        match: /^https?:\/\/.+/,
        required: true
    },
    indexingDuration: { type: Number, required: true },
});

export const Journal = Publication.discriminator("journal", journalSchema);
