import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { bookRoutes } from './app/controllers/book.controller';
import { borrowRoutes } from './app/controllers/borrow.controller';
import { errorHandler } from './app/middleware/errorHandler';

export const app: Application = express();

app.use(express.json());
app.use(cors({
    origin: ["https://library-management-system-as4.vercel.app","http://localhost:5173"],
}));

app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to LMS');
});

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Invalid route:  ${req.originalUrl}`,
    });
});

app.use(errorHandler);