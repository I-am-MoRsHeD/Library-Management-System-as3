import express, { NextFunction, Request, Response } from 'express';
import Book from '../models/book.model';
import BorrowedBookModel, { BorrowZodSchema } from '../models/borrow.model';
import { CustomError } from '../interfaces/errorHandler';

export const borrowRoutes = express.Router();

borrowRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = await BorrowZodSchema.parseAsync(req.body);

        const book = await Book.findById(body?.book);
        if (!book) {
            const error = new Error('Book not found');
            (error as CustomError).statusCode = 404;
            return next(error);
        }

        if (!body.quantity) {
            const error = new Error('Quantity is required');
            (error as CustomError).statusCode = 400;
            return next(error);
        } else if (book.copies < body.quantity) {
            const error = new Error('Not enough copies available');
            (error as CustomError).statusCode = 400;
            return next(error);
        }

        const borrowedBook = await BorrowedBookModel.create(body);
        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrowedBook
        });
    } catch (error) {
        next(error);
    }
});

borrowRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 10, page = 1 }: { limit?: number, page?: number } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    try {
        const total = await BorrowedBookModel.aggregate([
            {
                $group: {
                    _id: '$book'
                }
            },
            {
                $count: 'count'
            }
        ]);

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
            },
            {
                $skip: skip
            },
            {
                $limit: Number(limit)
            },
            {
                $sort: {
                    createdAt: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data: summeryOfBooks,
            total: total[0]?.count
        });

    } catch (error: unknown) {
        next(error);
    }
})