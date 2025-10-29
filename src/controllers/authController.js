import createHttpError from 'http-errors';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import path from 'path';
import handlebars from 'handlebars';

import { User } from '../models/user.js'; 
import { Session } from '../models/session.js'; 
import { sendEmail } from '../utils/sendMail.js'; 
import { 
    createSession, 
    setSessionCookies, 
    clearSessionCookies, 
    generateToken 
} from '../services/auth.js'; 
import { ONE_DAY, FIFTEEN_MINUTES } from '../constants/time.js'; 

const templatePath = path.resolve(process.cwd(), 'src/templates', 'reset-password-email.html');

let compiledTemplate;
try {
    const templateSource = readFileSync(templatePath, 'utf8');
    compiledTemplate = handlebars.compile(templateSource);
} catch (error) {
    console.error(`Error reading email template at ${templatePath}:`, error.message);
}

export const registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createHttpError(409, 'Email is already in use.'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        const session = await createSession(newUser._id);
        setSessionCookies(res, session);

        res.status(201).json({
            message: 'Registration successful',
            user: newUser,
        });

    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(createHttpError(401, 'Invalid credentials.'));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(createHttpError(401, 'Invalid credentials.'));
        }

        await Session.findOneAndDelete({ userId: user._id });
        clearSessionCookies(res);

        const session = await createSession(user._id);
        setSessionCookies(res, session);

        res.status(200).json({
            message: 'Login successful',
            user,
        });
        
    } catch (error) {
        next(error);
    }
};

export const refreshUserSession = async (req, res, next) => {
    try {
        const { refreshToken: currentRefreshToken } = req.cookies;
        
        if (!currentRefreshToken) {
            return next(createHttpError(401, 'Refresh token not found.'));
        }

        const session = await Session.findOne({ refreshToken: currentRefreshToken });

        if (!session) {
            return next(createHttpError(401, 'Session not found.'));
        }
        
        if (new Date() > session.refreshTokenValidUntil) {
            await Session.findByIdAndDelete(session._id);
            clearSessionCookies(res);
            return next(createHttpError(401, 'Refresh token has expired.'));
        }

        await Session.findByIdAndDelete(session._id);
        clearSessionCookies(res);

        const newSession = await createSession(session.userId);

        if (!newSession) {
            return next(createHttpError(500, 'Failed to create new session.'));
        }
        
        setSessionCookies(res, newSession);

        res.status(200).json({
            message: 'Session refreshed successfully',
        });

    } catch (error) {
        next(error);
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        const { sessionId } = req.cookies; 

        if (sessionId) {
            await Session.findByIdAndDelete(sessionId);
        }
        
        clearSessionCookies(res);
        
        res.status(204).send();
    } catch (error) {
        clearSessionCookies(res);
        next(createHttpError(500, 'Logout failed.'));
    }
};

export const requestResetEmail = async (req, res, next) => {
    const { email } = req.body;
    const neutralResponse = {
        message: 'Password reset email sent successfully',
    };

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json(neutralResponse); 
        }

        const token = jwt.sign(
            { sub: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' },
        );

        const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;
        
        if (!compiledTemplate) {
            return next(createHttpError(500, 'Email template not loaded.'));
        }

        const htmlContent = compiledTemplate({
            name: user.username || user.email,
            resetLink,
        });

        await sendEmail({
            to: email,
            subject: 'Reset your password',
            html: htmlContent,
        });

        res.status(200).json(neutralResponse);
    } catch (error) {
        if (error.status === 500 && error.message.includes('Failed to send the email')) {
            return next(error);
        }
        next(createHttpError(500, 'An unexpected error occurred. Please try again later.'));
    }
};

export const resetPassword = async (req, res, next) => {
    const { token, password } = req.body;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) { 
        return next(createHttpError(401, 'Invalid or expired token'));
    }
    
    const userId = decoded.sub;
    const userEmail = decoded.email;

    try {
        const user = await User.findOne({
            _id: userId,
            email: userEmail,
        });

        if (!user) {
            return next(createHttpError(404, 'User not found'));
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        
        res.status(200).json({
            message: 'Password reset successfully',
        });
    } catch (error) {
        next(error);
    }
};