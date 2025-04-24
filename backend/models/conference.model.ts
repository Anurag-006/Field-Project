import { Schema } from "mongoose";
import { Publication } from "./publication.model.js";

const conferenceSchema = new Schema({
    conferenceName: {type: String, required: true},
    conferenceTitle:  {type: String, required: true},
    organizedInstitute:  {type: String, required: true},
    conferencePlace: {type: String, required: true},
 
    conferenceMonth: {type: String, required: true},

    conferenceYear: {type: String, required: true},

    conferencePublished: {type: String, required: true},

    participationCertificate: {type: String, required: true},

    conferenceLink: {type: String, required: true},

    conferencePublishedStatus: {
      type: String,
      enum: ["published", "not-published"]
    },
    conferencePublishDuration: Number
});

export const Conference = Publication.discriminator("conference", conferenceSchema);