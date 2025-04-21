import { Schema } from "mongoose";
import { Publication } from "./publication.model";

const bookChapterSchema = new Schema({
    bookChapterTitle: String,
    paperTitleInChapter: String,
    proceedingsTitle: String,
    presentationMonth: String,
    presentationYear: String,
    bookChapterPublished: String,
    bookChapterPublishedStatus: {
      type: String,
      enum: ["published", "not-published"]
    },
    bookChapterLink: String,
    doiNumber: String,
    bookChapterPublishDuration: Number
});

export const BookChapter = Publication.discriminator("bookChapter", bookChapterSchema);