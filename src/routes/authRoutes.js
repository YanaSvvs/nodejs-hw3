import { Router } from 'express';
import pkg from 'celebrate';
const { validate } = pkg; 

import { registerUserSchema, loginUserSchema } from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/register', validate(registerUserSchema), registerUser);
authRouter.post('/login', validate(loginUserSchema), loginUser);
authRouter.post('/refresh', refreshUserSession);
authRouter.post('/logout', logoutUser);
export default authRouter;
