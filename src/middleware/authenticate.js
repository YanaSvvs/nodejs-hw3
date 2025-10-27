
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js'; 

export const authenticate = async (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return next(createHttpError(401, 'Not authorized'));
    }
    
    const [scheme, token] = authHeader.split(' ');
    
    if (scheme !== 'Bearer') {
        return next(createHttpError(401, 'Not authorized'));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.sub); 
        
        if (!user) {
            return next(createHttpError(401, 'User not found'));
        }
        
        req.user = user;
        next();
        
    } catch (error) {
        return next(createHttpError(401, 'Invalid token'));
    }
};
