import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import { errors } from 'celebrate'; // Імпорт обробника помилок Celebrate

import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js'; 
import pinoHttp from 'pino-http'; 

const PORT = process.env.PORT || 3030;

const startServer = async () => {
    // 1. Встановлення з'єднання з MongoDB
    await connectMongoDB();

    const app = express();
 
    // Налаштування логування (pino-http)
    app.use(pinoHttp({
        transport: { target: 'pino-pretty' },
        messageKey: 'message',
    }));

    // 2. Основні middleware
    app.use(cookieParser());
    app.use(cors()); 
    app.use(express.json()); 
    
    // 3. Маршрутизація: ОБИДВА РОУТЕРИ БЕЗ ПРЕФІКСА
    app.use(authRouter); 
    app.use(notesRouter); 
    
    // 4. Обробники помилок
    app.use(notFoundHandler);
    
    // MIDDLEWARE ВІД CELEBRATE ДЛЯ ОБРОБКИ ПОМИЛОК ВАЛІДАЦІЇ
    app.use(errors()); 

    // Загальний обробник помилок 
    app.use(errorHandler);
    
    // 5. Запуск сервера
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
        console.log(`Access at http://localhost:${PORT}`);
    });
};

startServer();
