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

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => u.id == id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    return res.json(users[index]);
  }
  res.status(404).json({ message: "User not found" });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter((u) => u.id != id);
  res.json({ message: "User deleted" });
};
