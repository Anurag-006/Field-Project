import { Schema } from "mongoose";
import { Publication } from "./publication.model";

const bookSchema = new Schema({
    bookTitle: String,
    bookPublicationMonth: String,
    bookPublisher: String,
    bookPublicationYear: String,
    modeOfPublication: String,
});
  
export const Book = Publication.discriminator("book", bookSchema);