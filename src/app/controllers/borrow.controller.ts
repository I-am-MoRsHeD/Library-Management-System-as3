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
            } else {
                const borrowedBook = await BorrowedBookModel.create(body);
                res.status(201).json({
                    success: true,
                    message: 'Book borrowed successfully',
                    data: borrowedBook
                });
            }
        };

    } catch (error: any) {
        res.status(400).json({
            message: 'Validation failed',
            errors: error.message,
        });
    }
});

borrowRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const summeryOfBooks = await BorrowedBookModel.aggregate([
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' }
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'book'
                }
            },
            {
                $unwind: '$book'
            },
            {
                $project: {
                    _id: 0,
                    totalQuantity: 1,
                    book: {
                        title: '$book.title',
                        isbn: '$book.isbn'
                    }
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data: summeryOfBooks
        });

    } catch (error: any) {
        res.status(400).json({
            message: 'Validation failed',
            errors: error.message,
        });
    }
})