const Log = require("../Models/Log"); // nhớ tạo Models/Log.js

module.exports = (action) => async (req, res, next) => {
  try {
    await Log.create({
      user: req.user?.id || null,
      action,
      meta: { ip: req.ip, ua: req.headers["user-agent"] },
    });
  } catch {}
  next();
};
