import { asyncHandler } from "../utils/asyncHandler.js";
import { Publication } from "../models/publication.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Types } from "mongoose";

const createUser = asyncHandler(async (req, res) => {
    const userData = req.body;
    const newUser = await User.create(userData);

    if (!newUser) {
        throw new ApiError(400, "Unable To Create User");
    }

    res
        .status(200)
        .json(new ApiResponse(200, newUser, "User Added Succesfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();

    if (!users) {
        throw new ApiError(404, "No Users Found");
    }

    res
        .status(200)
        .json(new ApiResponse(200, users, "Users Retrieved Succesfully"));
});

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("publications");
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, user, "User Retrieved Succesfully"));
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    const user = await User.findByIdAndUpdate       (id, userData, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, user, "User Updated Succesfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, user, "User Deleted Succesfully"));
}
);

const getUserPublications = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("publications");
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    const publications = await Publication.find({
        _id: { $in: user.publications },
    });
    if (!publications) {
        throw new ApiError(404, "No Publications Found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, publications, "Publications Retrieved Succesfully"));
}
);

const addPublicationToUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { publicationId } = req.body;
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
        .json(new ApiResponse(200, user, "Publication Added To User Succesfully"));
}
);

const removePublicationFromUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { publicationId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    const publication = await Publication.findById(publicationId);
    if (!publication) {
        throw new ApiError(404, "Publication Not Found");
    }
    user.publications = user.publications.filter(
        (pub) => pub.toString() !== publicationId
    );
    await user.save();
    res
        .status(200)
        .json(new ApiResponse(200, user, "Publication Removed From User Succesfully"));
}
);

const getUserPublicationsByType = asyncHandler(async (req, res) => {
    const { userId, type } = req.params;
    const user = await User.findById(userId).populate("publications");
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    const publications = await Publication.find({
        _id: { $in: user.publications },
        type: type,
    });
    if (!publications) {
        throw new ApiError(404, "No Publications Found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, publications, "Publications Retrieved Succesfully"));
}
);

const getUserPublicationById = asyncHandler(async (req, res) => {
    const { userId, publicationId } = req.params;
    const user = await User.findById(userId).populate("publications");
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    const publication = await Publication.findById(publicationId);
    if (!publication) {
        throw new ApiError(404, "Publication Not Found");
    }
    const publicationObjectId = new Types.ObjectId(publicationId); 

    if (!user.publications.includes(publicationObjectId)) {
        throw new ApiError(404, "Publication Not Found In User's Publications");
    }
    res
        .status(200)
        .json(new ApiResponse(200, publication, "Publication Retrieved Succesfully"));
}
);

export {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserPublications,
    addPublicationToUser,
    removePublicationFromUser,
    getUserPublicationsByType,
    getUserPublicationById,
};