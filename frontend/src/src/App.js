import React, { useState } from 'react';
import UserList from './UserList';
import AddUser from './AddUser';

function App() {
  const [flag, setFlag] = useState(0);
  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý Users</h1>
      <AddUser onAdded={() => setFlag(f => f + 1)} />
      <UserList refreshFlag={flag} />
    </div>
  );
}

export default App;
