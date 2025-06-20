import express, { Request, Response } from 'express';
import Book from '../models/book.model';
import { BookType } from '../interfaces/book.interface';

export const bookRoutes = express.Router();

bookRoutes.post('/', async (req: Request, res: Response) => {
    try {

        const body = req.body;

        const book = await Book.create(body);
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book
        });

    } catch (error: any) {
        res.status(400).json({
            message: 'Validation failed',
            errors: error.message,
        });
    }
});

bookRoutes.get('/', async (req: Request, res: Response) => {
    try {
        let books = []
        const sortQuery: any = {};

        const { filter, sort, limit, sortBy }: any = req.query;

        if (filter && sortBy && sort && limit) {
            sortQuery[sortBy as string] = sort;
            
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
    } catch (error: any) {
        res.status(400).json({
            message: 'Validation failed',
            errors: error.message,
        });
    };

});

bookRoutes.get('/:bookId', async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;
        const singleBook = await Book.findById(bookId);
        res.json({
            success: true,
            message: 'Book retrieved successfully',
            data: singleBook
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Validation failed',
            errors: error.message,
        });
    }
});

bookRoutes.put('/:bookId', async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;
        const updatedField = req.body;

        if (!updatedField) {
            res.status(400).json({ success: false, message: 'No data provided' });
            return;
        }

        const book = await Book.findById(bookId) as BookType;
        if (!book) {
            res.status(404).json({ success: false, message: 'Book not found' });
        }

        for (const key in updatedField) {
            if (updatedField.hasOwnProperty(key)) {
                book[key] = updatedField[key];
            }
        }

        const updatedBook = await book.save();
        res.json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Validation failed',
            errors: error.message,
        });
    }
});

bookRoutes.delete('/:bookId', async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;
        await Book.findByIdAndDelete(bookId) as BookType;
        res.json({
            success: true,
            message: 'Book deleted successfully',
            data: null
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Validation failed',
            errors: error.message,
        });
    }
})