const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("../middleware/passportLocal")(passport);

exports.login = async (req, res) => {
  res.render("login", {
    csrfToken: req.csrfToken(),
  });
};

exports.postLogin = async (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/profile",
    failureFlash: true,
  })(req, res, next);
};

exports.showSignUp = async (req, res) => {
  res.render("signup", {
    csrfToken: req.csrfToken(),
  });
};

exports.postSignUp = async (req, res) => {
  // get all item field request
  const { email, username, password, confirmpassword } = req.body;
  console.log(req.body);
  //check if the all field is empty
  if (!email || !username || !password || !confirmpassword) {
    res.render("signup", {
      err: "All Field is Required!",
      csrfToken: req.csrfToken(),
    });
  } else if (password !== confirmpassword) {
    res.render("signup", {
      err: "Password Don't Match!",
      csrfToken: req.csrfToken(),
    });
  } else {
    // validate email and username and password
    // skipping validation
    // check if a user exist
    User.findOne(
      {
        $or: [{ email: email }, { username: username }],
      },
      (err, data) => {
        if (err) throw err;
        if (data) {
          res.render("signup", {
            err: "User Exist! Please SignUp Different Email or Login",
            csrfToken: req.csrfToken(),
          });
        } else {
          // generate a salt
          bcrypt.genSalt(12, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              User({
                username: username,
                email: email,
                password: hash,
                googleId: null,
                provider: "email",
              }).save((err, data) => {
                if (err) throw err;
                res.redirect("/login");
              });
            });
          });
          // hash a password
          // save user in db
          // login the user
          // redirect, if don't want to login
        }
      }
    );
  }
};

exports.logout = async (req, res) => {
  req.logout();
  req.session.destroy(function (err) {
    res.redirect("/");
  });
};

exports.profile = async (req, res) => {
  res.render("profile", {
    username: req.user.username,
    verified: req.user.isVerified,
  });
};
