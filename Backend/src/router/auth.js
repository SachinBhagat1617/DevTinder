const express = require("express");
const router = express.Router();

const {
  signUp,
  userUpdate,
  logIn,
  getUser,
  logout,
  forgotPassword,
  passwordReset,
  updatePassword,
  refreshAccessToken,
} = require("../controller/authController");
const userAuth = require("../middleware/userAuth");

// app.use is equivalent router.get or router.post

router.post("/signUp", signUp);
router.patch("/userUpdate/:userId", userUpdate);
router.post("/logIn", logIn);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/password/reset/:token", passwordReset);
router.post("/updatePassword", userAuth, updatePassword);
router.get('/refreshToken', refreshAccessToken);
module.exports = router;
