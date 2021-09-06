const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("../middleware/passportLocal")(passport);

exports.homeIndex = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("index", { logged: true });
  } else {
    res.render("index", { logged: false });
  }
};
