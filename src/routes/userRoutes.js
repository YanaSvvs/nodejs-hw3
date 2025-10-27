
import { Router } from 'express';
import { authenticate, uploadAvatar } from '../middleware/authenticate.js';  
import { updateUserAvatar } from '../controllers/userController.js';

const userRouter = Router();

userRouter.patch(
    '/me/avatar', 
    authenticate, 
    uploadAvatar, 
    updateUserAvatar, 
);

export default userRouter;