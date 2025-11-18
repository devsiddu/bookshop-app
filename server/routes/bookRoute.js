import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { books, deleteBook, getBooks } from "../controllers/bookController.js";

const bookRouter = express.Router();

bookRouter.post("/", protectRoute, books);
bookRouter.get("/", protectRoute, getBooks);
bookRouter.delete("/:id", protectRoute, deleteBook);

export default bookRouter;
