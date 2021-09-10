const express = require("express");
const { homeIndex } = require("../controller/homeController");
const {
  login,
  showSignUp,
  postSignUp,
  profile,
  postLogin,
  logout,
  googleCallback,
} = require("../controller/user/userController");
const {
  userVerification,
  verifyUser,
} = require("../controller/user/userVerificationController");
const { checkAuth } = require("../middleware/checkAuth");
const passport = require("passport");
const {
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword,
} = require("../controller/user/userResetPassword");
require("../middleware/googleAuth")(passport);
const router = express.Router();

router.get("/", homeIndex);

router.get("/login", login);
router.post("/login", postLogin);
router.get("/logout", logout);

// google auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

router.get("/signup", showSignUp);

router.post("/signup", postSignUp);

router.get("/profile", checkAuth, profile);

// verification Token
router.get("/send-verification-email", checkAuth, userVerification);
router.get("/verify-email", checkAuth, verifyUser);

// forgot password
router.get("/forgot-password", getForgotPassword);
router.post("/forgot-password", postForgotPassword);

// reset password
router.get("/reset-password", getResetPassword);
router.post("/reset-password", postResetPassword);

module.exports = router;
