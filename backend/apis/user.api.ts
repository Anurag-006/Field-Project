import { Router } from 'express';
import { createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserPublications } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/create', createUser);
userRouter.get('/users', getAllUsers);  
userRouter.get('/:id', getUserById);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
userRouter.get('/:id/publications', getUserPublications);

export { userRouter };