require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const connectDb = require("./config/db");

const productRoutes = require("./routes/productRoutes");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use("/products", productRoutes);

connectDb();

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});