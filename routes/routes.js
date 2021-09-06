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
} = require("../controller/userController");
const { checkAuth } = require("../middleware/checkAuth");
const passport = require("passport");
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

module.exports = router;
