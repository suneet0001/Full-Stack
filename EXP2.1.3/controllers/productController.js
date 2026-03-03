const Product = require("../models/Product");

// List products
exports.getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);

    // Get unique categories for dropdown
    const categories = await Product.distinct("category");

    res.render("products/index", {
      products,
      categories,
      search,
      category
    });

  } catch (error) {
    console.error(error);
    res.send("Error loading products");
  }
};

// Show create form
exports.showCreateForm = (req, res) => {
  res.render("products/create");
};

// Create product
exports.createProduct = async (req, res) => {
  try {

    const productData = {
      ...req.body,
      inStock: req.body.inStock === "on" ? true : false
    };

    await Product.create(productData);

    res.redirect("/products");

  } catch (error) {
    console.error(error);
    res.send("Error creating product");
  }
};

// Show product details
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/show", { product });
};

// Show edit form
exports.showEditForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/edit", { product });
};

// Update product
exports.updateProduct = async (req, res) => {
  try {

    const productData = {
      ...req.body,
      inStock: req.body.inStock === "on" ? true : false
    };

    await Product.findByIdAndUpdate(req.params.id, productData);

    res.redirect("/products");

  } catch (error) {
    console.error(error);
    res.send("Error updating product");
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products");
};