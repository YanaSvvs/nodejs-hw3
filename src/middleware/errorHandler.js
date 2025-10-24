
import HttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
    let statusCode;
    let message;
   
    if (err instanceof HttpError) {
       
        statusCode = err.status;
        message = err.message;
    }
    else {
        statusCode = 500;
        message = 'Internal Server Error';
        console.error(err.stack);
    }

    res.status(statusCode).json({
        message: message,
    });
};