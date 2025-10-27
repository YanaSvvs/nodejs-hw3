
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import { errors } from 'celebrate'; 

import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js'; 
import userRouter from './routes/userRoutes.js'; 
import pinoHttp from 'pino-http'; 

const PORT = process.env.PORT || 3030;

const startServer = async () => {
    await connectMongoDB();
    const app = express();
   
    app.use(pinoHttp({
        transport: { target: 'pino-pretty' },
        messageKey: 'message',
    }));

    app.use(cookieParser());
    app.use(cors()); 
    app.use(express.json()); 

    app.use('/auth', authRouter); 
    app.use('/notes', notesRouter); 
    app.use('/users', userRouter); 
   
    app.use(notFoundHandler); 
    app.use(errors()); 
    app.use(errorHandler);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
        console.log(`Access at http://localhost:${PORT}`);
    });
};

startServer();