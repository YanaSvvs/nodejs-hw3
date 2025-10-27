
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js'; 
import multer from 'multer'; 

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(createHttpError(400, 'Only images allowed'), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
  fileFilter: fileFilter,
});

export const uploadAvatar = upload.single('avatar');
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
