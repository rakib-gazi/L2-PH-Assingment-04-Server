import { model, Schema } from "mongoose";
import { IBook } from "../interfaces/book.interface";

const booksSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, "The book's title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "The book's author is required"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "The genre is required"],
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message: "{VALUE} is not valid genre",
      },
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
      required: [true, "The book's Isbn Number is required"],
      unique: [true, "The book's Isbn Number is already Exists"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "The book's description is required"],
    },
    copies: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "Copies must be an positive number",
      },
      required: [true, "The number of copies is required"],
    },
    available: { 
        type: Boolean, 
        default: true 
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


// Used Post hook mongoose middleware here
booksSchema.post("findOneAndUpdate", async function (updatedBook) {
  if (!updatedBook) return; 
  if (updatedBook.copies === 0 ) {
    updatedBook.available = false;
    await updatedBook.save();
  }
  else if (updatedBook.copies > 0){
    updatedBook.available = true;
    await updatedBook.save();
  }
});




export const Book = model<IBook>("Book", booksSchema);
