import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/users", { name })
      .then(() => {
        onUserAdded();
        setName("");
      })
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Nhập tên user" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <button type="submit">Thêm user</button>
    </form>
  );
}

export default AddUser;
