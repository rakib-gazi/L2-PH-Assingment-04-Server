import { Model, model, Schema } from "mongoose";
import { borrowStaticMethod, IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./books.model";

const borrowSchema = new Schema<IBorrow, borrowStaticMethod>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "The book's id is required"],
    },
    quantity: {
      type: Number,
      required: [true, "The quantity of borrow book is required"],
      min: [
        1,
        "The quantity of borrow book at least is 01 . You requested for {VALUE}",
      ],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an positive number",
      },
    },
    dueDate: {
      type: Date,
      required: [true, "The due date is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);



// used Pre hook mongoose middleware here
borrowSchema.pre("save", async function () {
  if (typeof this.quantity === "number") {
    const book = await Book.findById(this.book, { copies: 1 });
    if (!book) {
      throw new Error("Book not found");
    }

    if (book.copies >= this.quantity) {
      const updatedField = {
        copies: book.copies - this.quantity,
      };
      await Book.findByIdAndUpdate(this.book, updatedField, { new: true });
    } else {
      throw new Error("Not enough copies available");
    }
  }
});



// used mongoose static method here 
borrowSchema.static(
  "validateBorrowBook",
  async function (
    this: Model<IBorrow>,
    bookId: string
  ) {
    const book = await Book.findById(bookId, { copies: 1 });
    if (!book) {
      return false;
    }
    const updatedFields = {
      available: book.copies === 0? false : true,
    };
    await Book.findByIdAndUpdate(bookId, updatedFields, { new: true });
  }
);



export const Borrow = model<IBorrow, borrowStaticMethod>(
  "Borrow",
  borrowSchema
);
