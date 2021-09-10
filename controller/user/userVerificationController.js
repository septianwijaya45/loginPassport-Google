const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const fileUpload = require("../../models/fileUpload");
const crypto = require("crypto");
const resetToken = require("../../models/resetToken");
const mailer = require("./sendMail");
require("../../middleware/passportLocal")(passport);

exports.userVerification = async (req, res) => {
  const fileImage = await fileUpload.find({ user: req.user._id });
  if (req.user.isVerified || req.user.provider == "google") {
    res.render("profile", {
      username: req.user.username,
      verified: req.user.isVerified,
      data: fileImage,
      csrfToken: req.csrfToken(),
      url: req.protocol + "://" + req.get("host") + "/images",
    });
  } else {
    let token = crypto.randomBytes(32).toString("hex");

    await resetToken({
      token: token,
      email: req.user.email,
    }).save();

    mailer.sendVerifyEmail(req.user.email, token);

    res.render("profile", {
      username: req.user.username,
      verified: req.user.isVerified,
      emailSend: true,
      data: fileImage,
      csrfToken: req.csrfToken(),
      url: req.protocol + "://" + req.get("host") + "/images",
    });
  }
};

exports.verifyUser = async (req, res) => {
  const fileImage = await fileUpload.find({ user: req.user._id });
  const token = req.query.token;

  if (token) {
    let check = await resetToken.findOne({ token: token });

    if (check) {
      let userData = await User.findOne({ email: check.email });
      userData.isVerified = true;
      userData.save();

      await resetToken.findOneAndDelete({ token: token });

      let username = req.user.username;
      let verified = req.user.isVerified;
      let data = fileImage;
      let csrfToken = req.csrfToken();
      let url = req.protocol + "://" + req.get("host") + "/images";
      res.redirect(
        "profile",
        username,
        verified,
        data,
        csrfToken,
        url
      );
    } else {
      res.render("profile", {
        username: req.user.username,
        verified: req.user.isVerified,
        err: "Invalid token or Token has expired, Try again.",
      });
    }
  } else {
    let username = req.user.username;
    let verified = req.user.isVerified;
    let data = fileImage;
    let csrfToken = req.csrfToken();
    let url = req.protocol + "://" + req.get("host") + "/images";
    res.redirect("profile", username, verified, data, csrfToken, url);
  }
};
