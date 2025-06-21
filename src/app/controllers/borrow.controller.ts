import express, { Request, Response } from 'express';
import Book from '../models/book.model';
import BorrowedBookModel from '../models/borrow.model';

export const borrowRoutes = express.Router();


borrowRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const book = await Book.findById(body?.book);
        if (book) {
            if (book?.copies < body?.quantity) {
                res.status(400).json({ success: false, message: 'Not enough copies available' });
                return;
            } else{
                // deduct er middleware kaj korbe
                // 0 hoye gele,available er middleware ta kaj korbe,,
            }
        };

        const borrowedBook = await BorrowedBookModel.create(body);
        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrowedBook
        });

    } catch (error: any) {
        res.status(400).json({
            message: 'Validation failed',
            errors: error.message,
        });
    }
})