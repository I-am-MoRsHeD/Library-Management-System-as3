import { model, Schema } from "mongoose";
import { BookModel, BookType } from "../interfaces/book.interface";
import { z } from 'zod';

const bookSchema = new Schema<BookType>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [5, 'Title must be at least 5 characters long'],
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
    },
    genre: {
        type: String,
        uppercase: true,
        enum: {
            values: ['FICTION', 'NON-FICTION', 'SCIENCE', 'HISTORY', 'FANTASY', 'BIOGRAPHY'],
            message: '{VALUE} is not supported'
        },
    },
    isbn: {
        type: String,
        unique: [true, 'This ISBN is already taken'],
        required: [true, 'ISBN is required'],
    },
    description: {
        type: String,
        maxlength: [20, 'Description must be at most 20 characters long'],
    },
    copies: {
        type: Number,
        required: [true, 'Copies is required'],
    },
    available: {
        type: Boolean,
        default: true
    },
}, {
    versionKey: false,
    timestamps: true
});

export const BookZodSchema = z.object(
    {
        title: z.string().min(5),
        author: z.string(),
        genre: z
            .string()
            .transform((val) => val.toUpperCase())
            .refine((val) =>
                ['FICTION', 'NON-FICTION', 'SCIENCE', 'HISTORY', 'FANTASY', 'BIOGRAPHY'].includes(val),
                { message: 'Genre is not supported' }
            ),
        isbn: z.string(),
        description: z.string().max(300).optional(),
        copies: z.number().min(1),
        available: z.boolean().default(true)
    }
)

bookSchema.static('updateAvailability', async function updateAvailability(bookId: string) {
    const book = await this.findById(bookId);
    if (!book) throw new Error('Book not found');

    if (book.copies <= 0) {
        book.available = false;
        await book.save();
    }
})

const Book = model<BookType, BookModel>('Book', bookSchema);

export default Book;