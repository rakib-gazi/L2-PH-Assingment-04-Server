# (BookGrid ) Library Management System Backend
---
**BookGrid** is a Library Management System built with Express js, TypeScript js, and MongoDB using Mongoose.
This Backend allows managing books (Create book, Get all books with filter,sort & limit , Get single book, update & delete book), borrowing books with business rules (availability, copies, due dates), and generating borrow summaries.

# Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup Guideline](#installation--setup-guideline)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Live Demo](#live-demo)
- [BookGrid Backend summary](#bookgrid-backend-summary)

---
## Features

### Book Management

- Create, read, update, delete books.

- Filtering, sorting & limit for pagination support.

### Borrowing System

- Borrow books with quantity & due date validations with business logic.

- Automatic availability updates when stock reaches zero.

### Borrowed books Summary reports

- Aggregation pipeline for borrowed book summaries.

### Mongoose Features

- Schema validation rules.

- Middleware **(pre/post hooks).**

- Static methods.

- Aggregation pipelines.
---
## Tech Stack

- **Backend:** Express.js + TypeScript

- **Database:** MongoDB with Mongoose

- **Validation:** Built-in & custom Mongoose validation (pre, post , static methods)

- **Error Handling:** Structured JSON response format
---
## Installation & Setup Guideline

1. **Clone the repository:**

``` 
git clone https://github.com/rakib-gazi/L2-PH-Assingment-03.git
cd L2-PH-Assingment-03
```


2. **Install dependencies:**
```
npm install
```

3. **Configure MongoDB connection inside server.ts:**
```
await mongoose.connect('mongodb+srv://<username>:<password>@cluster0.mongodb.net/LibraryDB');
```

4. **Run the development server:**
```
npm run dev
```
---
## Environment Variables

The project uses environment variables for configuration & secret data..  
Create a `.env` file in the root directory and set the following variables:

| Variable   | Description                   | Example                   |
|------------|-------------------------------|---------------------------|
| PORT       | Port number for the server    | 5000                      |
| DB_USER    | MongoDB database user         | ${process.env.DB_USER}    |
| DB_PASSWORD| MongoDB database password     | ${process.env.DB_PASSWORD}|
| DB_NAME    | MongoDB database name         | ${process.env.DB_NAME}    |

---
##  API Endpoints

### 1.Create Book

**POST** ```/api/books```  
Creates a new book with validation.

**Request**
```
{
    "title": "The Catcher in the Rye",
    "author": "J.D. Salinger",
    "genre": "FICTION",
    "isbn": "97806316769488",
    "description": "A classic novel about teenage rebellion.",
    "copies": 7,
    "available": true
}
```
**Response**
```
{
    "success": true,
    "message": "Book created successfully",
    "data": {
        "_id": "68a0ddfc1046da232282eadd",
        "title": "The Catcher in the Rye",
        "author": "J.D. Salinger",
        "genre": "FICTION",
        "isbn": "978063167969488",
        "description": "A classic novel about teenage rebellion.",
        "copies": 7,
        "available": true,
        "createdAt": "2025-08-16T19:37:32.605Z",
        "updatedAt": "2025-08-16T19:37:32.605Z"
    }
}
```
2. ### Get All Books
**GET** ```/api/books```

Get all books wih supports filtering, and sorting.

**Query:** 
```/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5```

**Query Parameters:**
- **filter:** Filter by genre
- **sortBy:** createdAT
- **sort:** asc or desc
- **limit:** Number of results (default: 10)

**Response**
```
{
    "success": true,
    "message": "Books retrieved successfully",
    "data": [
        {
            "_id": "689f1ad63db0222989cb206e",
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "genre": "FANTASY",
            "isbn": "9780345339683",
            "description": "The prelude to The Lord of the Rings trilogy.",
            "copies": 9,
            "available": true,
            "createdAt": "2025-08-15T11:32:38.996Z",
            "updatedAt": "2025-08-16T13:39:14.688Z"
        }
    ]
}
```

3. ### Get Book by ID

**GET** ```/api/books/:bookId```
Get single book by ID.

**Response**
```
{
    "success": true,
    "message": "Book retrieved successfully",
    "data": {
        "_id": "68a0ddfc1046da232282eadd",
        "title": "The Catcher in the Rye",
        "author": "J.D. Salinger",
        "genre": "FICTION",
        "isbn": "978063167969488",
        "description": "A classic novel about teenage rebellion.",
        "copies": 7,
        "available": true,
        "createdAt": "2025-08-16T19:37:32.605Z",
        "updatedAt": "2025-08-16T19:37:32.605Z"
    }
}
```

4. ### Update Book

**PUT** ```/api/books/:bookId```
Update book info with validation & business logic.

**Request**
```
{
    "copies": 10
}
```
**Response**
```
{
    "success": true,
    "message": "Book updated successfully",
    "data": {
        "_id": "68a0ddfc1046da232282eadd",
        "title": "The Catcher in the Rye",
        "author": "J.D. Salinger",
        "genre": "FICTION",
        "isbn": "978063167969488",
        "description": "A classic novel about teenage rebellion.",
        "copies": 10,
        "available": true,
        "createdAt": "2025-08-16T19:37:32.605Z",
        "updatedAt": "2025-08-16T19:49:50.847Z"
    }
}
```

5. ### Delete Book

**DELETE** ```/api/books/:bookId```
Delete book by book Id.

**Response**
```
{
    "success": true,
    "message": "Book deleted  successfully",
    "data": null
}
```

6. ### Borrow a Book

**POST** ```/api/borrow```
Create a new borrow record with validation & business logic.

**Business logic:**
- Checks available copies.
- Deducts requested quantity.
- Marks as unavailable if stock is 0.

**Request**
```
{
  "book": "689f1a263db0222989cb2066",
  "quantity":1,
  "dueDate": "2025-09-15T11:29:42.117Z"
}
```
**Response**
```
{
    "success": true,
    "message": "Book borrowed successfully",
    "data": {
        "book": "689f1a263db0222989cb2066",
        "quantity": 1,
        "dueDate": "2025-09-15T11:29:42.117Z",
        "_id": "68a0e2321046da232282eae5",
        "createdAt": "2025-08-16T19:55:30.405Z",
        "updatedAt": "2025-08-16T19:55:30.405Z"
    }
}
```

7. ### Borrowed Books Summary

**GET** ```/api/borrow```
Get a list of all borrowed books summary.

**Aggregation Pipeline Steps**
- $group: groups borrow records by book and sums quantities.
- $lookup: joins book details.
- $unwind: remove array from object.
- $project: returns only required fields.

**Response**
```
{
    "success": true,
    "message": "Borrowed books summary retrieved successfully",
    "data": [
        {
            "totalQuantity": 4,
            "book": {
                "title": "A Brief History of Time",
                "isbn": "9780553380164"
            }
        },
        {
            "totalQuantity": 9,
            "book": {
                "title": "Sapiens: A Brief History of Humankind",
                "isbn": "9780099590088"
            }
        }
    ]
}
```
---
## Error Handling

Error response when validation fails:
```
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "kind": "min",
        "value": -5
      }
    }
  }
}
```
Custom error  response :
```
{
    "success": false,
    "message": "Not enough copies available",
    "error": {
        "name": "custom Error"
    }
}
```
Custom Duplication error  response :
```
{
    "message": "Validation failed",
    "success": false,
    "error": {
        "name": "DuplicationError",
        "errors": {
            "isbn": {
                "message": "The book's Isbn Number is already Exists",
                "name": "DuplicationError",
                "properties": {
                    "message": "The book's Isbn Number is already Exists",
                    "keyPattern": {
                        "isbn": 1
                    },
                    "keyValue": {
                        "isbn": "978063167969488"
                    }
                }
            }
        }
    }
}
```
---
## Project Structure
```
├──src/
│   ├── app/
│   │   ├── interfaces/
│   │   │   ├── book.interface.ts
│   │   │   └── borrow.interface.ts
│   │   ├── models/
│   │   │   ├── books.model.ts
│   │   │   └── borrow.model.ts
│   │   ├── controllers/
│   │       ├── books.controller.ts
│   │       └── borrow.controller.ts
│   ├── app.ts   
│   └── server.ts
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```
## Live Demo
[BookGrid Frontend](https://bookgridl2.netlify.app)
[BookGrid Backend](https://l2-ph-assingment-04-server.vercel.app)
---
## BookGrid Backend summary
-  Clean, modular TypeScript code.
-  Proper folder structure (interfaces, models, controllers).
-  Mongoose middleware (pre/post).
-  Static methods.
-  Aggregation pipelines.
---
# The End
---





