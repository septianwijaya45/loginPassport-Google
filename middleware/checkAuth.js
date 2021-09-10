exports.checkAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0"
    );
    next();
  } else {
    req.flash("error_message", "Please Login to Continue the App!");
    let csrfToken = req.csrfToken();
    res.cookie(csrfToken).redirect("/login");
  }
};
