import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, TrendingUp, TrendingDown, Wallet, 
  BarChart3, Target, Settings
} from 'lucide-react';

function UserSidebar({ activeTab, onTabChange }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/user/home' },
    { id: 'income', label: 'Income', icon: TrendingUp, path: '/user/income' },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown, path: '/user/expenses' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/user/reports' },
    { id: 'bucketlist', label: 'Bucket List', icon: Target, path: '/user/bucketlist' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/user/settings' }
  ];

  const handleNavigation = (item) => {
    if (onTabChange) {
      onTabChange(item.id);
    }
    navigate(item.path);
  };

  // Determine active tab based on path if not controlled externally
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    const matchingItem = navItems.find(item => item.path === path);
    return matchingItem ? matchingItem.id : 'dashboard';
  };

  const currentActiveTab = activeTab || getActiveTabFromPath();

  return (
    <aside style={styles.sidebar}>
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              style={{
                ...styles.navItem,
                ...(currentActiveTab === item.id ? styles.navItemActive : {})
              }}
            >
              <Icon size={20} style={styles.navIcon} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "white",
    borderRight: "1px solid #e5e7eb",
    padding: "20px 0",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 24px",
    border: "none",
    background: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    color: "#4b5563",
    transition: "all 0.2s",
    borderLeft: "3px solid transparent",
  },
  navItemActive: {
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    borderLeft: "3px solid #3b82f6",
  },
  navIcon: {
    marginRight: "12px",
  },
};

export default UserSidebar;