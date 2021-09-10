const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const fileUpload = require("../../models/fileUpload");
const crypto = require("crypto");
const resetToken = require("../../models/resetToken");
const mailer = require("./sendMail");
require("../../middleware/passportLocal")(passport);

exports.getForgotPassword = async (req, res) => {
  res.render("forgotPassword.ejs", {
    csrfToken: req.csrfToken(),
  });
};

exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;

  let userData = await User.findOne({ email: email });

  if (userData) {
    if (userData.provider == "google") {
      let csrfToken = req.csrfToken();
      let msg =
        "User exists with Google Account. Try resetting your google account password or logging using it";
      let type = "danger";
      console.log(type);
      res.render("forgotPassword", { csrfToken, msg, type });
    } else {
      let token = crypto.randomBytes(32).toString("hex");
      await resetToken({ token: token, email: email }).save();

      mailer.sendResetEmail(email, token);

      let csrfToken = req.csrfToken();
      let msg = "Reset email sent. Check your email for more info.";
      let type = "success";
      res.render("forgotPassword", { csrfToken, msg, type });
    }
  } else {
    res.render("forgotPassword", {
      csrfToken: req.csrfToken(),
      msg: "No user Exists with this email.",
      type: "danger",
    });
  }
};

exports.getResetPassword = async (req, res) => {
  const token = req.query.token;

  if (token) {
    let check = await resetToken.findOne({ token: token });
    if (check) {
      res.render("forgotPassword", {
        csrfToken: req.csrfToken(),
        reset: true,
        email: check.email,
      });
    } else {
      res.render("forgotPassword", {
        csrfToken: req.csrfToken,
        msg: "Token Tampered or Expired",
        type: "danger",
      });
    }
  } else {
    let csrfToken = req.csrfToken();
    res.cookie(csrfToken).redirect("/login");
  }
};

exports.postResetPassword = async (req, res) => {
  const { password, password2, email } = req.body;

  if (!password || !password2 || password != password2) {
    res.render("forgotPassword", {
      csrfToken: req.csrfToken(),
      reset: true,
      err: "Password Don't Match!",
      email: email,
    });
  } else {
    const csrfToken = req.csrfToken();
    let salt = await bcrypt.genSalt(12);
    if (salt) {
      let hash = await bcrypt.hash(password, salt);
      await User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hash,
          },
        }
      );
      await resetToken.findOneAndDelete({ email: email });
      res.cookie(csrfToken).redirect("/login");
    } else {
      res.render("forgotPassword", {
        csrfToken,
        reset: true,
        err: "Unexpected Error Try Again",
        email: email,
      });
    }
  }
};
