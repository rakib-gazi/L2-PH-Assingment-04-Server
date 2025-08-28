import { Model, Types } from "mongoose";

export interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

export interface borrowStaticMethod extends Model<IBorrow> {
  validateBorrowBook(bookId: string): Promise<void>;
}
