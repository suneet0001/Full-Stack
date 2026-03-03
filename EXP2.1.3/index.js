require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const connectDb = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Connect to MongoDB
connectDb();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

// Root Route (prevents "Cannot GET /")
app.get("/", (req, res) => {
  res.send("🚀 Server Running Successfully");
});

// Routes
app.use("/products", productRoutes);

// Port for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
