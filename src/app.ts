import express, { Application, Request, Response } from 'express';
import { bookRoutes } from './app/controllers/book.controller';

export const app: Application = express();

app.use(express.json());
app.use('/api/books', bookRoutes);

app.use('/', (req : Request, res: Response) => {
    res.send('Welcome to LMS');
});