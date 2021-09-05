const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login", {
    error: false,
    error_message: null,
    csrfToken: req.csrfToken(),
  });
});

router.get("/signup", (req, res) => {
  res.render("signup", { csrfToken: req.csrfToken() });
});

router.post("/signup", (req, res) => {
  res.send("Validated!");
});

router.get("/profile", (req, res) => {
  res.render("profile");
});

module.exports = router;
