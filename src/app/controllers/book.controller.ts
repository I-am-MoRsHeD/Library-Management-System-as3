import express, { NextFunction, Request, Response } from 'express';
import Book, { BookZodSchema } from '../models/book.model';
import { BookType } from '../interfaces/book.interface';

export const bookRoutes = express.Router();

bookRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const body = await BookZodSchema.parseAsync(req.body);

        const book = await Book.create(body);
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book
        });

    } catch (error: unknown) {
        next(error);
    }
});

bookRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let books = []
        const sortQuery: Record<string, 1 | -1> = {};

        const { filter, sortBy = 'createdAt', sort = 'asc', limit = 5 }: { filter?: string, sortBy?: string, sort?: string, limit?: number } = req.query;

        if (filter) {
            sortQuery[sortBy] = sort === 'asc' ? 1 : -1;

            books = await Book.find({
                genre: filter
            }).sort(sortQuery).limit(limit);
        } else {
            books = await Book.find();
        }

        res.json({
            success: true,
            message: 'Books retrieved successfully',
            data: books
        });
    } catch (error: unknown) {
        next(error)
    };

});

bookRoutes.get('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookId } = req.params;
        const singleBook = await Book.findById(bookId);
        res.json({
            success: true,
            message: 'Book retrieved successfully',
            data: singleBook
        });
    } catch (error: unknown) {
        next(error)
    }
});

bookRoutes.put('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookId } = req.params;
        const updatedField = req.body;

        if (!updatedField) {
            res.status(400).json({ success: false, message: 'No data provided' });
            return;
        };

        const updatedBook = await Book.findByIdAndUpdate(bookId, updatedField, { new: true });

        res.json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook
        });
    } catch (error: unknown) {
        next(error)
    }
});

bookRoutes.delete('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookId } = req.params;
        await Book.findByIdAndDelete(bookId) as BookType;
        res.json({
            success: true,
            message: 'Book deleted successfully',
            data: null
        });
    } catch (error: unknown) {
        next(error)
    }
})