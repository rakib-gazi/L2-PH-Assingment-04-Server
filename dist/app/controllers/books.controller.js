"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post("/", async (req, res) => {
    try {
        const body = req.body;
        const book = await books_model_1.Book.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        const keyPattern = error.cause?.keyPattern;
        const keyValue = error.cause?.keyValue;
        const errorObject = {
            name: "DuplicationError",
            errors: {
                isbn: {
                    message: "The book's Isbn Number is already Exists",
                    name: "DuplicationError",
                    properties: {
                        message: "The book's Isbn Number is already Exists",
                        keyPattern,
                        keyValue
                    }
                }
            }
        };
        return res.status(400).json({
            message: "Validation failed",
            success: false,
            error: error.errors ? error : errorObject,
        });
    }
});
exports.booksRoutes.get("/", async (req, res) => {
    try {
        const filterValue = req.query.filter;
        const sortBy = req.query.sortBy;
        const sortValue = req.query.sort;
        const page = Number(req.query.page) || 1;
        const limitValue = Number(req.query.limit) || 10;
        const skip = (page - 1) * limitValue;
        let query = books_model_1.Book.find();
        if (filterValue) {
            query = query.find({ genre: filterValue });
        }
        if (sortValue) {
            query = query.sort({ [sortBy]: sortValue === "desc" ? -1 : 1 });
        }
        else {
            query = query.sort({ createdAt: -1 });
        }
        query = query.skip(skip).limit(limitValue);
        const books = await query;
        const totalDocuments = await books_model_1.Book.countDocuments(filterValue ? { genre: filterValue } : {});
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            pagination: {
                totalDocuments,
                page,
                limitValue,
                totalPages: Math.ceil(totalDocuments / limitValue),
            },
            data: books,
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
exports.booksRoutes.get("/:bookId", async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const book = await books_model_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: `Book not found`,
                data: null,
            });
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
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
exports.booksRoutes.put("/:bookId", async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const updatedBody = req.body;
        const book = await books_model_1.Book.findByIdAndUpdate(bookId, updatedBody, {
            new: true,
        });
        if (!book) {
            res.status(404).json({
                success: false,
                message: `Book not found`,
                data: null,
            });
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: error,
        });
    }
});
exports.booksRoutes.delete("/:bookId", async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const book = await books_model_1.Book.findByIdAndDelete(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: `Book not found`,
                data: null,
            });
        }
        res.status(200).json({
            success: true,
            message: "Book deleted  successfully",
            data: book ? null : book,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: error,
        });
    }
});
