
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

import { sendEmail } from '../utils/sendMail.js';
import { readFileSync } from 'fs';
import path from 'path';
import handlebars from 'handlebars';

const templatePath = path.resolve(process.cwd(), 'src/templates', 'reset-password-email.html');

let compiledTemplate;
try {
    const templateSource = readFileSync(templatePath, 'utf8');
    compiledTemplate = handlebars.compile(templateSource);
} catch (error) {
    console.error(`Error reading email template at ${templatePath}:`, error.message);
}

export const registerUser = async (req, res) => {
};

export const loginUser = async (req, res) => {
};

export const refreshUserSession = async (req, res) => {
};

export const logoutUser = async (req, res) => {
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

        // 1. Генерація JWT-токену (15 хвилин)
        const token = jwt.sign(
            { sub: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' },
        );

        // 2. Створення посилання для фронтенду
        const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;
        
        // Перевірка наявності скомпільованого шаблону
        if (!compiledTemplate) {
            return next(createHttpError(500, 'Email template not loaded.'));
        }

        // 3. Компіляція HTML-листа
        const htmlContent = compiledTemplate({
            name: user.username || user.email,
            resetLink,
        });

        // 4. Надсилання листа
        await sendEmail({
            to: email,
            subject: 'Reset your password',
            html: htmlContent,
        });

        // 5. Успішна відповідь
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

    // 1. Верифікація токена
    try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (error) { 
    return next(createHttpError(401, 'Invalid or expired token'));
}
    const userId = decoded.sub;
    const userEmail = decoded.email;

    try {
        // 2. Пошук користувача за ID та Email
        const user = await User.findOne({
            _id: userId,
            email: userEmail,
        });

        if (!user) {
            return next(createHttpError(404, 'User not found'));
        }

        // 3. Хешування нового паролю
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Оновлення паролю
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        // 5. Успішна відповідь
        res.status(200).json({
            message: 'Password reset successfully',
        });
    } catch (error) {
        next(error);
    }
};