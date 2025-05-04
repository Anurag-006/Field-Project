import { Router } from 'express';
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserPublications,
    getUserPublicationsByType,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    insertUsers,
    getCurrentUserPublications,

} from '../controllers/user.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.post('/create', createUser);
userRouter.get('/users', getAllUsers);  
userRouter.get('/publications',verifyJWT, getCurrentUserPublications);
userRouter.post('/login', loginUser);
userRouter.post('/logout', verifyJWT, logoutUser);
userRouter.post('/refresh-token', verifyJWT, refreshAccessToken);
userRouter.post('/change-password', verifyJWT, changeCurrentPassword);
userRouter.post('/insert', insertUsers);
userRouter.get('/:id/publications', getUserPublications);
userRouter.get('/:id/publications/:type', getUserPublicationsByType);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
export { userRouter };