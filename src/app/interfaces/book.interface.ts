import { Document, Model, Types } from "mongoose";

export interface BookType {
    title: string,
    author: string,
    genre: 'FICTION' | 'NON-FICTION' | 'SCIENCE' | 'HISTORY' | 'FANTASY' | 'BIOGRAPHY',
    isbn: string,
    description?: string,
    copies: number,
    available: boolean,
};

export interface BookDocument extends BookType, Document {}

export interface BookModel extends Model<BookDocument> {
    updateAvailability(bookId: Types.ObjectId | string): Promise<void>;
};