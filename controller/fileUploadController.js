const fs = require("fs");
const multer = require("multer");
const path = require("path");
const fileUpload = require("../models/fileUpload");
const { upload } = require("../server");

// ********************* Controller ********************* //
exports.index = async (req, res) => {
  res.render("fileUpload", {
    csrfToken: req.csrfToken(),
    // username: req.user.username,
  });
};

exports.postFile = async (req, res) => {
  if (!req.file) {
    const error = new Error("File Image is required!");
    error.errorCode = 422;
    throw error;
  }

  const image = req.file.filename;
  const file = new fileUpload({
    user: req.user._id,
    nameFile: image,
  });

  file
    .save()
    .then((result) => {
      res.status(201).redirect("/profile");
    })
    .catch((err) => {
      console.log("error: " + err);
    });
};

exports.deleteFile = async (req, res) => {
  const data = await fileUpload.findOne({ _id: req.params.id });
  const path = process.cwd() + "/public/images/" + data.nameFile;

  await fileUpload
    .deleteOne({ _id: req.params.id })
    .then(() => {
      fs.unlinkSync(path);
      res.json({ success: true });
    })
    .catch((err) => {
      res.status.json({ err: err });
    });
};

exports.multipleIndex = async (req, res) => {
  res.render("fileMultipleUpload", {
    csrfToken: req.csrfToken(),
    // username: req.user.username,
  });
};

exports.postFileMultiple = async (req, res) => {
  const { username, file } = req.body;

  if (username === "") {
    res.render("fileUpload", {
      csrfToken: req.csrfToken(),
      err: new Error("Username is required"),
      // username: req.user.username,
    });
  }

  if (file === "") {
    res.render("fileUpload", {
      csrfToken: req.csrfToken(),
      err: new Error("File is required"),
      username: req.user.username,
    });
  }

  upload.array("file", 5)(req, res, (err) => {
    if (err) {
      res.render("fileUpload", {
        csrfToken: req.csrfToken(),
        err: err,
        username: req.user.username,
      });
    } else {
      res.redirect("/file-upload");
    }
  });
};
