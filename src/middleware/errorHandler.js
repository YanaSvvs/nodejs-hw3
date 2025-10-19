import { isCelebrateError } from 'celebrate';
import HttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
    let statusCode;
    let message;
    
    if (isCelebrateError(err)) {
        statusCode = 400;
        const errorBody = err.details.get('body') || err.details.get('query') || err.details.get('params');
        message = errorBody ? errorBody.details[0].message.replace(/"/g, '') : 'Invalid input data';
    } 
    else if (err instanceof HttpError) {
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