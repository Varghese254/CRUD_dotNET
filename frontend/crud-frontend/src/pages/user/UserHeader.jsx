import { useNavigate, useLocation } from "react-router-dom";
import { Home, LogOut, User } from 'lucide-react';

function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const goToDashboard = () => {
    navigate("/user/home");
  };

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <button onClick={goToDashboard} style={styles.homeButton}>
          <Home size={20} />
          <span style={styles.logoText}>FinTrack</span>
        </button>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.userInfo}>
          <User size={18} />
          <span style={styles.userName}>{user.name || 'User'}</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 30px",
    backgroundColor: "#0f766e",
    color: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  homeButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "6px",
    transition: "background-color 0.2s",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "600",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "20px",
    fontSize: "14px",
  },
  userName: {
    maxWidth: "150px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    backgroundColor: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },
};

export default UserHeader;