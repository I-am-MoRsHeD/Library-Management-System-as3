import { Types } from "mongoose";

export interface BorrowedBook {
    book : Types.ObjectId,
    quantity : number,
    dueDate : Date
};