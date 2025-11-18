import Book from "../models/Book.js";
import cloudinary from "../configs/cloudinary.js";

export const books = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const uploadResult = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResult.secure_url;

    const book = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await book.save();

    res
      .status(201)
      .json({ success: true, message: "Book added successfully", book });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error" + error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImg");

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Book ID is required" });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    //delete image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      const publicId = book.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await book.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const books = await Book.find({ user: userId }).sort({ createdAt: -1 });

    res.send({ success: true, books });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
