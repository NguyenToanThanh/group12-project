import React, { useState } from "react";
import api from "./api";

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
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    try {
      await api.post("/users", { name, email });
      setName("");
      setEmail("");
      onUserAdded?.(); // refresh danh sách
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Không thể thêm user");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, margin: "12px 0" }}
    >
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
