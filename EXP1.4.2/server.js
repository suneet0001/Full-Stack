const express = require("express");
const mongoose = require("mongoose");
const Card = require("./models/Card");

const app = express();
app.use(express.json());

const PORT = 3000;

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/cardsDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// GET all cards
app.get("/api/cards", async (req, res) => {
  const cards = await Card.find();
  res.json(cards);
});


// POST new card
app.post("/api/cards", async (req, res) => {
  const newCard = new Card(req.body);
  await newCard.save();
  res.status(201).json(newCard);
});


// PUT update card
app.put("/api/cards/:id", async (req, res) => {
  const card = await Card.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(card);
});


// DELETE card
app.delete("/api/cards/:id", async (req, res) => {
  await Card.findByIdAndDelete(req.params.id);
  res.json({ message: "Card deleted" });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
