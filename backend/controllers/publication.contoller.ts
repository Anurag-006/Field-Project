import { asyncHandler } from "../utils/asyncHandler";
import { Journal } from "../models/journal.model";
import { Conference } from "../models/conference.model";
import { BookChapter } from "../models/bookChapter.model";
import { Book } from "../models/book.model";
import { Publication } from "../models/publication.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";


const createJournalPublication = asyncHandler(async (req, res) => {
    const journalData = req.body;
    const newJournal = await Journal.create(journalData);

    if (!newJournal) {
        throw new ApiError(400, "Unable To Create Journal");
    }

    res
    .status(200)
    .json(new ApiResponse(200, newJournal, "Journal Added Succesfully"));
});


// Type of data needed to create Journal

/*
    {
  "email": "john@example.com",
  "facultyName": "Dr. John Doe",
  "employeeId": "EMP123",
  "rigNo": "RIG456",
  "academicYear": "2024-2025",
  "authors": [
    {
      "name": "John Doe",
      "affiliation": "XYZ University"
    },
    {
      "name": "Jane Smith",
      "affiliation": "ABC Institute"
    }
  ],
  "facultyAuthorPosition": 1,
  "doesPaperBelongToStudent": false,
  "type": "journal",
  "journalName": "International Journal of AI",
  "journalQuartile": "Q1",
  "paperTitle": "AI in Modern Education",
  "volumeIssue": "Vol 12, Issue 3",
  "pageNumbers": "123-135",
  "publicationMonth": "April",
  "publicationYear": "2025",
  "indexing": "Scopus",
  "issnNumber": "1234-5678",
  "impactFactor": 5.2,
  "publisherName": "TechPublishers",
  "paperLink": "https://example.com/paper.pdf",
  "journalLink": "https://journal.example.com",
  "indexingDuration": 12
}
*/



