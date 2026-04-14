const express = require("express");
const Book = require("../models/Book");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET BOOKS
router.get("/", auth, async (req, res) => {
  const books = await Book.find().populate("borrowedBy", "email");
  res.json(books);
});

// ADD BOOK (ADMIN)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }

  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

// DELETE BOOK (ADMIN)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }

  await Book.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

// BORROW BOOK
router.post("/borrow/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book.available) {
    return res.status(400).json({ msg: "Already borrowed" });
  }

  book.available = false;
  book.borrowedBy = req.user.id;

  await book.save();
  res.json({ msg: "Borrowed successfully" });
});

// RETURN BOOK (SECURE 🔐)
router.post("/return/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book.available) {
    return res.status(400).json({ msg: "Already available" });
  }

  if (book.borrowedBy.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Not your book" });
  }

  book.available = true;
  book.borrowedBy = null;

  await book.save();
  res.json({ msg: "Returned successfully" });
});

module.exports = router;