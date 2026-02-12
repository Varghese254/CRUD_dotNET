import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/user")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users</h1>

      {users.length === 0 && <p>No users found</p>}

      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}

export default App;
