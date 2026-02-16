import { useNavigate } from "react-router-dom";

function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/signin");
};



  return (
    <header style={styles.header}>
      <h2>Admin Panel</h2>
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
    backgroundColor: "#1e293b",
    color: "white",
  },
  button: {
    padding: "8px 15px",
    cursor: "pointer",
  },
};

export default AdminHeader;
