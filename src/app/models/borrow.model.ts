import { model, Schema } from "mongoose";
import { BorrowedBook } from "../interfaces/borrow.interface";
import Book from "./book.model";
import { z } from "zod";


const borrowedBookSchema = new Schema<BorrowedBook>({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Book is required'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required'],
    },
}, {
    versionKey: false,
    timestamps: true
});

export const BorrowZodSchema = z.object(
    {
        book: z.string(),
        quantity: z.number(),
        dueDate: z.date(),
    }
)

// deduct copies via post middleware
borrowedBookSchema.post('save', async function (doc) {
    if (doc) {
        const book = await Book.findById(doc.book);
        book.copies -= doc.quantity;
        await book.save();

        await Book.updateAvailability(doc.book as string);
    }
})

const BorrowedBookModel = model('BorrowedBook', borrowedBookSchema);

export default BorrowedBookModel;