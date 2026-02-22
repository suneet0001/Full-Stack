const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  suit: String,
  value: String,
  collection: String
});

module.exports = mongoose.model("Card", cardSchema);
