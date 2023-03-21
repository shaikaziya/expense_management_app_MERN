const express = require("express");
const { loginController, registerController, forgotPassword, resetPassword } = require("../controllers/userController");

//router object
const router = express.Router();

router.post("/login", loginController);

router.post("/register", registerController);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:id/:token", resetPassword);

module.exports = router;

