const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const authMiddleware = require('../middleware/auth');

router.post("/register", (req, res) => userController.Register(req, res));
router.post("/login", (req, res) => userController.Login(req, res));
router.post("/logout", authMiddleware ,(req, res) => userController.Logout(req, res));
router.get("/users", authMiddleware, (req, res) => userController.AllUsers(req, res));
router.post("/users/verify", authMiddleware, (req, res) => userController.VerifyAccount(req, res));
router.post("/users/reset-password", authMiddleware, (req, res) => userController.ResetPassword(req, res));
router.post("/users/change-password", authMiddleware, (req, res) => userController.ChangePassword(req, res));




module.exports = router;