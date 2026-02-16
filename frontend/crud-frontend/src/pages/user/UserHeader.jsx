import { useNavigate } from "react-router-dom";

function UserHeader() {
  const navigate = useNavigate();

 const handleLogout = () => {
  localStorage.clear();   // clear everything
  navigate("/signin");
};


  return (
    <header style={styles.header}>
      <h2>User Dashboard</h2>
      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    backgroundColor: "#0f766e",
    color: "white",
  },
  button: {
    padding: "8px 15px",
    cursor: "pointer",
  },
};

export default UserHeader;
