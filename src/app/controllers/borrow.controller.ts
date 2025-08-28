import express, { Request, Response } from "express";
import { Borrow } from "../models/borrow.model";
 export const borrowRoutes = express.Router();


borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const borrowedBook = await Borrow.create(body);
    // custom static method
    await Borrow.validateBorrowBook(
      body.book
    );
    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowedBook,
    });
  } catch (error: any) {
    const isEmptyObject =Object.keys(error).length === 0;
    return res.status(400).json({
      success: false,
      message: error.message ? error.message :"Validation failed",
      error: isEmptyObject ? {name:"custom Error"}  : error,
      
    });
  }
});


borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
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
  } catch (error: any) {
    res.status(404).json({
      message: "Data Not Found",
      success: false,
      error: error,
    });
  }
});
