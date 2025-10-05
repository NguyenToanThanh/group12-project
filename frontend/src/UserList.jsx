import React, { useEffect, useState } from "react";
import api from "./api";

function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Không thể lấy danh sách users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá user này?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Không thể xoá user");
    }
  };

  return (
    <div>
      <h2>Danh sách Users</h2>
      <ul
        style={{ display: "flex", flexDirection: "column", gap: 8, padding: 0 }}
      >
        {users.map((u) => (
          <li
            key={u._id}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              listStyle: "none",
            }}
          >
            <span>
              {u.name} — {u.email}
            </span>
            <button onClick={() => handleDelete(u._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
