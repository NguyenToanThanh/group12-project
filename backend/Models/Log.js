const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    meta: Object,
    at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
