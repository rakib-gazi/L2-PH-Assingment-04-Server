"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = void 0;
const mongoose_1 = require("mongoose");
const books_model_1 = require("./books.model");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    versionKey: false,
    timestamps: true,
});
// used Pre hook mongoose middleware here
borrowSchema.pre("save", async function () {
    if (typeof this.quantity === "number") {
        const book = await books_model_1.Book.findById(this.book, { copies: 1 });
        if (!book) {
            throw new Error("Book not found");
        }
        if (book.copies >= this.quantity) {
            const updatedField = {
                copies: book.copies - this.quantity,
            };
            await books_model_1.Book.findByIdAndUpdate(this.book, updatedField, { new: true });
        }
        else {
            throw new Error("Not enough copies available");
        }
    }
});
// used mongoose static method here 
borrowSchema.static("validateBorrowBook", async function (bookId) {
    const book = await books_model_1.Book.findById(bookId, { copies: 1 });
    if (!book) {
        return false;
    }
    const updatedFields = {
        available: book.copies === 0 ? false : true,
    };
    await books_model_1.Book.findByIdAndUpdate(bookId, updatedFields, { new: true });
});
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowSchema);
