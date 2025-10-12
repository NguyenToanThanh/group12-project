const express = require("express");
const router = express.Router();

// Tạm thời route test
router.get("/", (req, res) => {
  res.send("Auth routes working!");
});

module.exports = router;
