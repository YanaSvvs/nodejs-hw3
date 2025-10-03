
import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  let statusCode;
  let message;

  if (err instanceof HttpError) {
    
    statusCode = err.statusCode;
    message = err.message;
  } else {
    console.error('Unhandled error:', err.stack);
    statusCode = 500;
    message = 'Internal Server Error';
  }
  
  res.status(statusCode).json({
    message: message,
  });
};