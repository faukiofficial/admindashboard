const Order = require("./model");
const Product = require("../products/model");

// create order
exports.createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    const checkedProducts = await Product.find({
      _id: { $in: req.body.products },
    });

    if (checkedProducts.length !== products.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products not found",
      });
    }

    const amount = checkedProducts.reduce(
      (acc, product) => acc + product.price,
      0
    );

    const order = await Order.create({ products, amount });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating order",
    });
  }
};

// get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const {
      name,
      page = 1,
      limit = 25,
      sortField = "updatedAt",
      sortOrder = "desc",
    } = req.query;

    const orders = await Order.find()
      .populate({
        path: "products",
        model: "Product",
        select: "name price code",
        populate: {
          path: "category",
          model: "Category",
          select: "name code",
        },
      })
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 });

    // Filter hasil berdasarkan nama produk
    const filteredOrders = name
      ? orders.filter((order) =>
          order.products.some((product) =>
            product.name.toLowerCase().includes(name.toLowerCase())
          )
        )
      : orders;

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedOrders = filteredOrders.slice(
      startIndex,
      startIndex + limit
    );

    const totalOrders = await Order.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: paginatedOrders,
      totalOrders: totalOrders,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

// get order by id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "products",
      model: "Product",
      select: "name price code",
      populate: {
        path: "category",
        model: "Category",
        select: "name code",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching order",
    });
  }
};
