const Product = require("../products/model");
const Category = require("../categories/model");

// create product
exports.createProduct = async (req, res) => {
  try {
    const isCodeExists = await Product.findOne({ code: req.body.code });

    if (isCodeExists) {
      return res.status(400).json({
        success: false,
        message: "Code already exists",
      });
    }

    const category = await Category.findById(req.body.category);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    const product = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating product",
    });
  }
};

// get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, name, limit = 25, page = 1, sortField = "updatedAt", sortOrder = "desc" } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    const products = await Product.find(query)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortField]: sortOrder });

    const totalProducts = await Product.countDocuments();
    const totalFilteredProducts = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalFilteredProducts / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
};

// get product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching product",
    });
  }
};

// update product by id
exports.updateProductById = async (req, res) => {
  try {
    const isCodeExists = await Product.findOne({ code: req.body.code, _id: { $ne: req.params.id } });

    if (isCodeExists) {
      return res.status(400).json({
        success: false,
        message: "Code already exists",
      });
    }

    const category = await Category.findById(req.body.category);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating product",
    });
  }
};

// delete product by id
exports.deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
};
