const express = require("express");
const router = express.Router();

const categoryController = require("./controller");
const { autenticateAndRefresh } = require("../../middleware/autenticateAndRefresh");

router.post("/create", autenticateAndRefresh, categoryController.createCategory);
router.get("/get-all", categoryController.getAllCategories);
router.get("/get/:id", categoryController.getCategoryById);
router.put("/update/:id", autenticateAndRefresh, categoryController.updateCategoryById);
router.delete("/delete/:id", autenticateAndRefresh, categoryController.deleteCategoryById);

module.exports = router;