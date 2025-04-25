import { asyncHandler } from "../utils/asyncHandler.js";
import { Journal } from "../models/journal.model.js";
import { Conference } from "../models/conference.model.js";
import { BookChapter } from "../models/bookChapter.model.js";
import { Book } from "../models/book.model.js";
import { Publication } from "../models/publication.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"

const createJournalPublication = asyncHandler(async (req, res) => {
    const journalData = req.body;
    const newJournal = await Journal.create(journalData);

    if (!newJournal) {
        throw new ApiError(400, "Unable To Create Journal");
    }

    const userId= journalData.user;
    const publicationId = newJournal._id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    const publication = await Publication.findById(publicationId);
    if (!publication) {
        throw new ApiError(404, "Publication Not Found");
    }
    
    user.publications.push(publicationId);
    await user.save();

    res
    .status(200)
    .json(new ApiResponse(200, newJournal, "Journal Added Succesfully"));
});

const createConferencePublication = asyncHandler(async (req, res) => {
    const conferenceData = req.body;
    const newConference = await Conference.create(conferenceData);

    if (!newConference) {
        throw new ApiError(400, "Unable To Create Conference");
    }

    const userId= conferenceData.user;
    const publicationId = newConference._id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    const publication = await Publication.findById(publicationId);
    if (!publication) {
        throw new ApiError(404, "Publication Not Found");
    }

    user.publications.push(publicationId);

    await user.save()

    res
        .status(200)
        .json(new ApiResponse(200, newConference, "Conference Added Succesfully"));
});

const createBookChapterPublication = asyncHandler(async (req, res) => {
    const bookChapterData = req.body;
    const newBookChapter = await BookChapter.create(bookChapterData);

    if (!newBookChapter) {
        throw new ApiError(400, "Unable To Create Book Chapter");
    }
    const userId= bookChapterData.user;
    const publicationId = newBookChapter._id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    const publication = await Publication.findById(publicationId);
    if (!publication) {
        throw new ApiError(404, "Publication Not Found");
    }
    
    user.publications.push(publicationId);

    await user.save()

    res
        .status(200)
        .json(new ApiResponse(200, newBookChapter, "Book Chapter Added Succesfully"));
});

const createBookPublication = asyncHandler(async (req, res) => {
    const bookData = req.body;
    const newBook = await Book.create(bookData);

    if (!newBook) {
        throw new ApiError(400, "Unable To Create Book");
    }

    const userId= bookData.user;
    const publicationId = newBook._id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    const publication = await Publication.findById(publicationId);
    if (!publication) {
        throw new ApiError(404, "Publication Not Found");
    }
    
    user.publications.push(publicationId);
    await user.save()

    res
        .status(200)
        .json(new ApiResponse(200, newBook, "Book Added Succesfully"));
});

const getAllPublications = asyncHandler(async (req, res) => {
    const publications = await Publication.find();

    if (!publications) {
        throw new ApiError(404, "No Publications Found");
    }

    res
        .status(200)
        .json(new ApiResponse(200, publications, "Publications Retrieved Succesfully"));
});

const getPublicationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const publication = await Publication.findById(id).populate("user");
    if (!publication) {
        throw new ApiError(404, "Publication Not Found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, publication, "Publication Retrieved Succesfully"));
});

const getPublicationByType = asyncHandler(async (req, res) => {
    const { type } = req.params;
    let publication;
    switch (type) {
        case "journal":
            publication = await Journal.find();
            break;
        case "conference":
            publication = await Conference.find();
            break;
        case "bookChapter":
            publication = await BookChapter.find();
            break;
        case "book":
            publication = await Book.find();
            break;
        default:
            throw new ApiError(400, "Invalid Publication Type");
    }
    if (!publication) {
        throw new ApiError(404, "No Publications Found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, publication, "Publication Retrieved Succesfully"));
});

const deletePublication = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const publication = await Publication.findByIdAndDelete(id);
    if (!publication) {
        throw new ApiError(404, "Publication Not Found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, publication, "Publication Deleted Succesfully"));
});

const updatePublication = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const publicationData = req.body;
    const publication = await Publication.findByIdAndUpdate(id, publicationData, {
        new: true,
        runValidators: true,
    });
    if (!publication) {
        throw new ApiError(404, "Publication Not Found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, publication, "Publication Updated Succesfully"));
});

export {
    createConferencePublication,
    createBookChapterPublication,
    createBookPublication,
    getAllPublications,
    getPublicationById,
    getPublicationByType,
    deletePublication,
    updatePublication,
    createJournalPublication
};