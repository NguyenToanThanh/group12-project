let users = []; // mảng tạm nếu chưa dùng MongoDB

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.createUser = (req, res) => {
  const { name, email } = req.body || {};
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ message: "Name/Email is required" });
  }
  const user = { id: Date.now().toString(), name, email };
  users.unshift(user);
  res.status(201).json(user);
};
