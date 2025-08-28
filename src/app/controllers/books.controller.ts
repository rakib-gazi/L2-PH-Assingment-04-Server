import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
export const booksRoutes = express.Router();

booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const book = await Book.create(body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
  const keyPattern = error.cause?.keyPattern;
  const keyValue = error.cause?.keyValue;
  const errorObject = {
    name: "DuplicationError",
    errors:{
      isbn : {
        message: "The book's Isbn Number is already Exists",
        name: "DuplicationError",
        properties: {
          message: "The book's Isbn Number is already Exists",
          keyPattern,
          keyValue
        }
      }
    }
  }
  return res.status(400).json({
    message:  "Validation failed",
    success: false,
    error: error.errors ? error: errorObject,
  });
  }
});

booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const filterValue = req.query.filter as string;
    const sortBy = req.query.sortBy as string;
    const sortValue = req.query.sort as string;
    const page = Number(req.query.page) || 1;
    const limitValue = Number(req.query.limit) || 10;
    const skip = (page - 1) * limitValue;
    let query = Book.find();
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
    const totalDocuments = await Book.countDocuments(filterValue ? { genre: filterValue } : {});
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
  } catch (error: any) {
    res.status(404).json({
      message: "Data Not Found",
      success: false,
      error: error,
    });
  }
});


booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);
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
  } catch (error: any) {
    res.status(404).json({
      message: "Data Not Found",
      success: false,
      error: error,
    });
  }
});


booksRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const updatedBody = req.body;
    const book = await Book.findByIdAndUpdate(bookId, updatedBody, {
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
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: error,
    });
  }
});


booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findByIdAndDelete(bookId);
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
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: error,
    });
  }
});
