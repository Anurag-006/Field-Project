import {
    createConferencePublication,
    createBookChapterPublication,
    createBookPublication,
    getAllPublications,
    getPublicationById,
    getPublicationByType,
    deletePublication,
    updatePublication,
    createJournalPublication
} from "../controllers/publication.controller.js";


import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

const publicationRouter = Router();

publicationRouter.post(
    "/create/conference",
    asyncHandler(createConferencePublication)
);
publicationRouter.post(
    "/create/bookChapter",
    asyncHandler(createBookChapterPublication)
);
publicationRouter.post(
    "/create/book",
    asyncHandler(createBookPublication)
);

publicationRouter.post(
    "/create/journal",
    asyncHandler(createJournalPublication)
)

publicationRouter.get(
    "/all",
    asyncHandler(getAllPublications)
);

publicationRouter.get(
    "/type/:type",
    asyncHandler(getPublicationByType)
);

publicationRouter.get(
    "/:id",
    asyncHandler(getPublicationById)
);

publicationRouter.delete(
    "/:id",
    asyncHandler(deletePublication)
);
publicationRouter.put(
    "/:id",
    asyncHandler(updatePublication)
);

export { publicationRouter };