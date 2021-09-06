const User = require("../models/user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email }, (err, data) => {
        if (err) throw err;

        if (!data) {
          return done(null, false, { message: "User Doesn't Exists! " });
        }

        bcrypt.compare(password, data.password, (err, match) => {
          if (err) {
            return done(null, false, { message: "something error!" });
          }

          if (!match) {
            return done(null, false, { message: "Password Doesn't Match!" });
          }

          if (match) {
            return done(null, data);
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
