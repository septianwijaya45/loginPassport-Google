const express = require("express");
const { homeIndex } = require("../controller/homeController");
const {
  login,
  showSignUp,
  postSignUp,
  profile,
  postLogin,
} = require("../controller/userController");
const { checkAuth } = require("../middleware/checkAuth");
const router = express.Router();

router.get("/", homeIndex);

router.get("/login", login);
router.post("/login", postLogin);

router.get("/signup", showSignUp);

router.post("/signup", postSignUp);

router.get("/profile", checkAuth, profile);

module.exports = router;
