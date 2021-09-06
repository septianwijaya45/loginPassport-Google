const express = require("express");
const {
  login,
  showSignUp,
  postSignUp,
  profile,
} = require("../controller/userController");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", login);

router.get("/signup", showSignUp);

router.post("/signup", postSignUp);

router.get("/profile", profile);

module.exports = router;
