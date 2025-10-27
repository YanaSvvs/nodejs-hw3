
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js'; 

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createHttpError(400, 'No file'));
    }

    const cloudinaryResponse = await saveFileToCloudinary(req.file.buffer);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { avatar: cloudinaryResponse.secure_url },
      { new: true }, 
    );
    if (!updatedUser) {
      return next(createHttpError(404, 'User not found'));
    }

    res.status(200).json({
      url: updatedUser.avatar, 
    });
  } catch (error) {
    console.error('Error updating user avatar:', error);
    next(createHttpError(500, 'Failed to update avatar. Please try again later.'));
  }
};