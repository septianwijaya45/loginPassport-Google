const express = require("express");
const {
  index,
  postFile,
  postFileMultiple,
  multipleIndex,
  deleteFile,
} = require("../controller/fileUploadController");
const router = express.Router();
const { checkAuth } = require("../middleware/checkAuth");

router.get("/", checkAuth, index);
router.post("/upload", checkAuth, postFile);
router.delete("/delete/:id", checkAuth, deleteFile);

router.get("/multiple-upload", checkAuth, multipleIndex);
router.post("/multiple-upload", checkAuth, postFileMultiple);

module.exports = router;
