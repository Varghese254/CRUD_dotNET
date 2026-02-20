import { useNavigate } from "react-router-dom";

function UserFooter() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <footer style={styles.footer}>
      <div>© 2026 FinTrack. All rights reserved.</div>
    </footer>
  );
}

const styles = {
  footer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    backgroundColor: "#134e4a",
    color: "white",
    marginTop: "auto",
  },
  button: {
    padding: "6px 12px",
    cursor: "pointer",
  },
};

export default UserFooter;
