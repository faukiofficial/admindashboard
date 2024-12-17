const express = require("express");
const router = express.Router();

const productController = require("./controller");
const { autenticateAndRefresh } = require("../../middleware/autenticateAndRefresh");

router.post("/create", autenticateAndRefresh, productController.createProduct);
router.get("/get-all", productController.getAllProducts);
router.get("/get/:id", productController.getProductById);
router.put("/update/:id", autenticateAndRefresh, productController.updateProductById);
router.delete("/delete/:id", autenticateAndRefresh, productController.deleteProductById);

module.exports = router;