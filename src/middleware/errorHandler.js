
import { HttpError } from 'http-errors'; // <--- Додаємо імпорт HttpError

export const errorHandler = (err, req, res, next) => {
  
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof HttpError) {
    statusCode = err.statusCode; 
    message = err.message; 
  } else {
 
    console.error('Unhandled error:', err.stack); 
    
    if (err.status || err.statusCode) {
      statusCode = err.status || err.statusCode;
    }
  }

  if (err.name === 'ValidationError') {
      statusCode = 400; 
      message = err.message;
  }
  
  if (statusCode === 500) {
      message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    message: message,
  });
};