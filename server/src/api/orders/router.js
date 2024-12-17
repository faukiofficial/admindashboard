const express = require("express");
const router = express.Router();

const orderController = require("./controller");

router.post("/create", orderController.createOrder);
router.get("/get-all", orderController.getAllOrders);
router.get("/get/:id", orderController.getOrderById);

module.exports = router;