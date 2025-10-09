
import { HttpError } from 'http-errors';
import { isCelebrateError } from 'celebrate'; 

export const errorHandler = (err, req, res, next) => {
  let statusCode;
  let message;
  
  if (isCelebrateError(err)) { 
    statusCode = 400; 
    const errorBody = err.details.get('body') || err.details.get('query') || err.details.get('params');
    message = errorBody ? errorBody.details[0].message : 'Invalid input data';
    message = message.replace(/"/g, ''); 

  } else if (err instanceof HttpError) {
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