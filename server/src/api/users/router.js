const express = require("express");
const router = express.Router();

const userController = require("./controller");
const { autenticateAndRefresh } = require("../../middleware/autenticateAndRefresh");

router.post("/register", userController.registerUser);
router.post("/activation", userController.activateUser);
router.post("/login", userController.loginUser);
router.post("/logout", autenticateAndRefresh, userController.logout);
router.get("/me", autenticateAndRefresh, userController.getUserInfo);
router.get("/get-all", autenticateAndRefresh, userController.getAllUsers);
router.put("/update", autenticateAndRefresh, userController.updateUserInfo);
router.put("/update-email-activation", autenticateAndRefresh, userController.activateChangedEmail);
router.post("/update-password", autenticateAndRefresh, userController.updateUserPassword);
router.put("/update-password-activation", autenticateAndRefresh, userController.activateChangedPassword);
router.post("/forget-password", userController.forgetPassword);
router.put("/reset-password", userController.setNewPassword);
router.delete("/delete", autenticateAndRefresh, userController.deleteUser);


module.exports = router;
