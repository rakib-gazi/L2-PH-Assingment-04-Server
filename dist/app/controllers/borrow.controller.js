"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("../models/borrow.model");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post("/", async (req, res) => {
    try {
        const body = req.body;
        const borrowedBook = await borrow_model_1.Borrow.create(body);
        // custom static method
        await borrow_model_1.Borrow.validateBorrowBook(body.book);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowedBook,
        });
    }
    catch (error) {
        const isEmptyObject = Object.keys(error).length === 0;
        return res.status(400).json({
            success: false,
            message: error.message ? error.message : "Validation failed",
            error: isEmptyObject ? { name: "custom Error" } : error,
        });
    }
});
exports.borrowRoutes.get("/", async (req, res) => {
    try {
        const summary = await borrow_model_1.Borrow.aggregate([
            {
                $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo",
                },
            },
            { $unwind: "$bookInfo" },
            {
                $project: {
                    _id: 0,
                    book: { title: "$bookInfo.title", isbn: "$bookInfo.isbn" },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        res.status(404).json({
            message: "Data Not Found",
            success: false,
            error: error,
        });
    }
});
