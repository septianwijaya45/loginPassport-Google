const mongoose = require("mongoose");

const resetToken = mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  expired_at: {
    type: Date,
    default: Date.now(),
    expires: 600,
  },
});

module.exports = mongoose.model("resetTokens", resetToken);
