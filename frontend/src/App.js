import React, { useState } from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";

function App() {
  const [reload, setReload] = useState(false);

  const refreshList = () => setReload(!reload);

  return (
    <div>
      <h1>Quản lý Users</h1>
      <AddUser onUserAdded={refreshList} />
      <UserList key={reload} />
    </div>
  );
}

export default App;
