import { asyncHandler } from "../utils/asyncHandler.js";
import { Publication } from "../models/publication.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { IUser, IUserMethods } from "../types/user.types.js";


interface DecodedToken extends jwt.JwtPayload {
    _id: string;
    email: string;
    role: string;
    employeeId: string;
}

interface AuthRequest extends Request {
    user?: IUser;
  }

const options = {
    httpOnly: true,
    secure: true,
};

const generateAccessAndRefreshTokens = async (userId: Types.ObjectId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User Not Found");
        }
        if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
            throw new ApiError(500, "Token secrets are not defined");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating Request and Access Tokens"
        );
    }
};

const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    const existedUser = await User.findOne({
        $or: [{ employeeId: userData.employeeId }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const newUser = await User.create(userData);

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(400, "Unable To Create User");
    }

    res
        .status(200)
        .json(new ApiResponse(200, createdUser, "User Added Succesfully"));
});

const insertUsers = asyncHandler(async (req: Request, res: Response) => {
    try {
    const users = req.body;
      const salt = await bcrypt.genSalt(10);
      for (const user of users) {
        user.password = await bcrypt.hash(user.password, salt);
      }
  
      const insertedUsers = await User.insertMany(users);
      res.status(200).json(
        new ApiResponse(200, insertedUsers, "Users Inserted Successfully")
      );
    } catch (error) {
      console.error("Error inserting users:", error);
    }
});

const loginUser = asyncHandler(async (req, res) => {
    // get username and password from req (Frontend)


    const userDetails = req.body;

    // verify Username
    const user = await User.findOne({ employeeId: userDetails.employeeId });
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    // verify Password
    const isUserPasswordCorrect = await user.isPasswordCorrect(
        userDetails.password
    );
    if (!isUserPasswordCorrect) {
        throw new ApiError(402, "Incorrect login credentials");
    }

    // if username and password match generate Access Token

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    // give user the access token to continue and save it in a cookie

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // return response.
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged In successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req: AuthRequest, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    // Fetch refresh token from user from cookies or req
    const incommingRefreshToken =
        req.cookies?.refreshToken || req.body.refreshToken;
    if (!incommingRefreshToken) {
        throw new ApiError(401, "No Refresh Token");
    }
    try {
        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw new ApiError(500, "Refresh Token Secret is not defined");
        }
        // Check if refresh token matches
        const decodedToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ) as DecodedToken;
        if (!decodedToken) {
            throw new ApiError(401, "Invalid refresh token");
        }
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (incommingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Unauthorized access");
        }
        // generate new refresh token and update in db

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
            user._id
        );

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access Token Refreshed"
                )
            );
    } catch (error: any) {
        throw new ApiError(400, error?.message || "Invalid Refresh Token");
    }
});

const changeCurrentPassword = asyncHandler(async (
    req: AuthRequest, 
    res: Response,
) => {
    // get old and new passwords from frontend
    const { oldPassword, newPassword } = req.body;

    // verify Them


    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(400, "User not Logged In");
    }

    const isUserPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isUserPasswordCorrect) {
        throw new ApiError(401, "Incorrect Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User Password Changed Succesfully"));
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
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid user ID format");
    }
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

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(publicationId)) {
        throw new ApiError(400, "Invalid ID format");
    }

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


const getCurrentUserPublications = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id || !Types.ObjectId.isValid(req.user?._id)) {
        throw new ApiError(400, "Invalid user ID format");
    }

    const user = await User.findById(req.user?._id).populate("publications");

    if (!user || !user.publications || user.publications.length === 0) {
        throw new ApiError(404, "No Publications Found");
    }

    res.status(200).json(new ApiResponse(200, user.publications, "Publications Retrieved Successfully"));
});


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
    IUser,
    IUserMethods,
    generateAccessAndRefreshTokens,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    insertUsers,
    getCurrentUserPublications,    
};