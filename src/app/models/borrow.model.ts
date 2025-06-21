import { model, Schema } from "mongoose";
import { BorrowedBook } from "../interfaces/borrow.interface";


const BorrowedBookSchema = new Schema<BorrowedBook>({
    book : {
        type : String,
        required: [true, 'Book is required'],
    },
    quantity : {
        type : Number,
        required: [true, 'Quantity is required'],
    },
    dueDate : {
        type : Date,
        required: [true, 'Due date is required'],
    },
});

const BorrowedBookModel = model('BorrowedBook', BorrowedBookSchema);

export default BorrowedBookModel;