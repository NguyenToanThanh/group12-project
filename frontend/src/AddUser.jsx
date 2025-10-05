import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      alert("Name không được để trống");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    try {
      await axios.post("http://localhost:3000/users", { name, email });
      setName("");
      setEmail("");
      onUserAdded?.(); // gọi lại cha để refresh list nếu cần
      alert("Thêm user thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
      alert("Có lỗi xảy ra khi thêm user");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        placeholder="Nhập tên user"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Nhập email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Thêm user</button>
    </form>
  );
}

export default AddUser;