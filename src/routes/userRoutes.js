
import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js'; 
import { uploadAvatar } from '../middleware/multer.js';    
import { updateUserAvatar } from '../controllers/userController.js';

const userRouter = Router();

userRouter.patch(
    '/me/avatar', 
    authenticate, 
    uploadAvatar, 
    updateUserAvatar, 
);

export default userRouter;