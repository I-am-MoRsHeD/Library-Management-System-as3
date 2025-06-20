import { model, Schema } from "mongoose";
import { Book } from "../interfaces/book.interface";


const bookSchema = new Schema<Book>({
    title : {
        type : String,
        required: [true, 'Title is required'],
        minlength: [5, 'Title must be at least 5 characters long'],
    },
    author : {
        type : String,
        required: [true, 'Author is required'],
    },
    genre : {
        type : String,
        uppercase : true,
        enum: {
            values : ['FICTION', 'NON-FICTION', 'SCIENCE', 'HISTORY', 'FANTASY', 'BIOGRAPHY'],
            message: '{VALUE} is not supported'
        },
    },
    isbn : {
        type : String,
        unique: [true, 'This ISBN is already taken'],
        required: [true, 'ISBN is required'],
    },
    description : {
        type : String,
        maxlength : [100, 'Description must be at most 100 characters long'],
    },
    copies : {
        type : Number,
        required: [true, 'Copies is required'],
    },
    available : {
        type : Boolean,
        default: true
    },
}, {
    versionKey : false,
    timestamps : true
});

const Book = model('Book', bookSchema);

export default Book;