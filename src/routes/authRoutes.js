import { Router } from 'express';
import { validateBody } from '../services/auth.js'; 

import { registerUserSchema, loginUserSchema } from '../validations/authValidation.js';
import {
    registerUser,
    loginUser,
    refreshUserSession,
    logoutUser,
} from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), registerUser); 
authRouter.post('/login', validateBody(loginUserSchema), loginUser); 
authRouter.post('/refresh', refreshUserSession);
authRouter.post('/logout', logoutUser);

export default authRouter;
