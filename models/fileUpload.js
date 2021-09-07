const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    nameFile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const fileUpload = mongoose.model("files", fileSchema);

module.exports = fileUpload;
