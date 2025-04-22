import { asyncHandler } from "../utils/asyncHandler.js";
import { Publication } from "../models/publication.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
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
export {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserPublications,
};