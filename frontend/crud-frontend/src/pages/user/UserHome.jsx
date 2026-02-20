import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import api from "../../api";
import { 
  DollarSign, TrendingUp, TrendingDown, Wallet, 
  PlusCircle, PieChart, List, Home, 
  BarChart3, Target, Settings, LogOut 
} from 'lucide-react';

function UserHome() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      budgetUsed: 0
    },
    budgets: [],
    categoryExpenses: [],
    topCategories: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current month and year
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  // Check if user has added any data
  const hasNoData = dashboardData.summary.totalIncome === 0 && 
                    dashboardData.summary.totalExpense === 0;

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/user/home' },
    { id: 'income', label: 'Income', icon: TrendingUp, path: '/user/income' },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown, path: '/user/expenses' },
    { id: 'budget', label: 'Budget', icon: Wallet, path: '/user/budget' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/user/reports' },
    { id: 'bucketlist', label: 'Bucket List', icon: Target, path: '/user/bucketlist' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/user/settings' }
  ];

  if (loading) {
    return (
      <div style={styles.container}>
        <UserHeader />
        <main style={styles.main}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p>Loading your financial dashboard...</p>
          </div>
        </main>
        <UserFooter />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <UserHeader />

      <div style={styles.mainContent}>
        {/* Sidebar Navigation */}
        <aside style={styles.sidebar}>
          <nav style={styles.nav}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    navigate(item.path);
                  }}
                  style={{
                    ...styles.navItem,
                    ...(activeTab === item.id ? styles.navItemActive : {})
                  }}
                >
                  <Icon size={20} style={styles.navIcon} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main style={styles.main}>
          {hasNoData ? (
            <div style={styles.welcomeContainer}>
              <Wallet size={64} style={styles.welcomeIcon} />
              <h1 style={styles.welcomeTitle}>Welcome to FinTrack!</h1>
              <p style={styles.welcomeText}>
                Get started by adding your first income or expense entry.
              </p>
              <div style={styles.actionButtons}>
                <button
                  onClick={() => navigate('/user/income/add')}
                  style={styles.primaryButton}
                >
                  <PlusCircle size={20} style={{ marginRight: '8px' }} />
                  Add First Income
                </button>
                <button
                  onClick={() => navigate('/user/expenses/add')}
                  style={styles.secondaryButton}
                >
                  <PlusCircle size={20} style={{ marginRight: '8px' }} />
                  Add First Expense
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.dashboardContent}>
              {/* Header with Month */}
              <div style={styles.dashboardHeader}>
                <div>
                  <h1 style={styles.pageTitle}>Financial Dashboard</h1>
                  <p style={styles.pageSubtitle}>{currentMonth} {currentYear} Overview</p>
                </div>
                <div style={styles.headerActions}>
                  <button
                    onClick={() => navigate('/user/income/add')}
                    style={styles.primaryButton}
                  >
                    <PlusCircle size={18} style={{ marginRight: '6px' }} />
                    Add Income
                  </button>
                  <button
                    onClick={() => navigate('/user/expenses/add')}
                    style={styles.secondaryButton}
                  >
                    <PlusCircle size={18} style={{ marginRight: '6px' }} />
                    Add Expense
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div style={styles.cardGrid}>
                <div style={styles.summaryCard}>
                  <div style={styles.cardContent}>
                    <div>
                      <p style={styles.cardLabel}>Total Income</p>
                      <p style={{...styles.cardValue, color: '#10b981'}}>
                        ${dashboardData.summary.totalIncome.toFixed(2)}
                      </p>
                    </div>
                    <div style={{...styles.cardIcon, backgroundColor: '#d1fae5'}}>
                      <TrendingUp color="#10b981" size={24} />
                    </div>
                  </div>
                </div>

                <div style={styles.summaryCard}>
                  <div style={styles.cardContent}>
                    <div>
                      <p style={styles.cardLabel}>Total Expenses</p>
                      <p style={{...styles.cardValue, color: '#ef4444'}}>
                        ${dashboardData.summary.totalExpense.toFixed(2)}
                      </p>
                    </div>
                    <div style={{...styles.cardIcon, backgroundColor: '#fee2e2'}}>
                      <TrendingDown color="#ef4444" size={24} />
                    </div>
                  </div>
                </div>

                <div style={styles.summaryCard}>
                  <div style={styles.cardContent}>
                    <div>
                      <p style={styles.cardLabel}>Balance</p>
                      <p style={{
                        ...styles.cardValue,
                        color: dashboardData.summary.balance >= 0 ? '#3b82f6' : '#ef4444'
                      }}>
                        ${dashboardData.summary.balance.toFixed(2)}
                      </p>
                    </div>
                    <div style={{...styles.cardIcon, backgroundColor: '#dbeafe'}}>
                      <DollarSign color="#3b82f6" size={24} />
                    </div>
                  </div>
                </div>

                <div style={styles.summaryCard}>
                  <div style={styles.cardContent}>
                    <div>
                      <p style={styles.cardLabel}>Budget Used</p>
                      <p style={{...styles.cardValue, color: '#8b5cf6'}}>
                        {dashboardData.summary.budgetUsed}%
                      </p>
                    </div>
                    <div style={{...styles.cardIcon, backgroundColor: '#ede9fe'}}>
                      <Wallet color="#8b5cf6" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Progress Section */}
              {dashboardData.budgets.length > 0 && (
                <div style={styles.sectionCard}>
                  <h2 style={styles.sectionTitle}>Budget Progress</h2>
                  <div style={styles.budgetList}>
                    {dashboardData.budgets.map((budget) => (
                      <div key={budget.category} style={styles.budgetItem}>
                        <div style={styles.budgetHeader}>
                          <span style={styles.budgetCategory}>{budget.category}</span>
                          <span style={styles.budgetAmount}>
                            ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                            <span style={styles.budgetPercentage}>
                              ({budget.percentage}%)
                            </span>
                          </span>
                        </div>
                        <div style={styles.progressBarContainer}>
                          <div
                            style={{
                              ...styles.progressBar,
                              width: `${Math.min(budget.percentage, 100)}%`,
                              backgroundColor: budget.percentage > 100 
                                ? '#ef4444' 
                                : budget.percentage > 80 
                                ? '#f59e0b' 
                                : '#10b981'
                            }}
                          ></div>
                        </div>
                        {budget.percentage > 100 && (
                          <p style={styles.exceededText}>
                            Exceeded by ${(budget.spent - budget.limit).toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Charts and Recent Transactions */}
              <div style={styles.twoColumnGrid}>
                {/* Category Breakdown */}
                <div style={styles.sectionCard}>
                  <h2 style={styles.sectionTitle}>Spending by Category</h2>
                  {dashboardData.categoryExpenses.length > 0 ? (
                    <div style={styles.categoryList}>
                      {dashboardData.categoryExpenses.map((cat) => (
                        <div key={cat.category} style={styles.categoryItem}>
                          <div style={styles.categoryHeader}>
                            <span style={styles.categoryName}>{cat.category}</span>
                            <span style={styles.categoryAmount}>
                              ${cat.amount.toFixed(2)}
                            </span>
                          </div>
                          <div style={styles.progressBarContainer}>
                            <div
                              style={{
                                ...styles.progressBar,
                                width: `${(cat.amount / dashboardData.summary.totalExpense * 100)}%`,
                                backgroundColor: '#3b82f6'
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <PieChart size={48} color="#9ca3af" />
                      <p style={styles.emptyText}>No expense data yet</p>
                    </div>
                  )}
                </div>

                {/* Recent Transactions */}
                <div style={styles.sectionCard}>
                  <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Recent Transactions</h2>
                    <button 
                      onClick={() => navigate('/user/income')}
                      style={styles.viewAllButton}
                    >
                      View All
                    </button>
                  </div>
                  
                  {dashboardData.recentTransactions.length > 0 ? (
                    <div style={styles.transactionList}>
                      {dashboardData.recentTransactions.map((transaction) => (
                        <div key={transaction.id} style={styles.transactionItem}>
                          <div style={styles.transactionInfo}>
                            <div style={{
                              ...styles.transactionDot,
                              backgroundColor: transaction.type === 'income' ? '#10b981' : '#ef4444'
                            }}></div>
                            <div>
                              <p style={styles.transactionDesc}>{transaction.description}</p>
                              <p style={styles.transactionMeta}>
                                {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                              </p>
                            </div>
                          </div>
                          <p style={{
                            ...styles.transactionAmount,
                            color: transaction.type === 'income' ? '#10b981' : '#ef4444'
                          }}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <List size={48} color="#9ca3af" />
                      <p style={styles.emptyText}>No recent transactions</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Spending Categories */}
              {dashboardData.topCategories.length > 0 && (
                <div style={styles.sectionCard}>
                  <h2 style={styles.sectionTitle}>Top Spending Categories</h2>
                  <div style={styles.topCategoriesGrid}>
                    {dashboardData.topCategories.map((cat, index) => (
                      <div key={cat.category} style={styles.topCategoryCard}>
                        <div style={styles.topCategoryHeader}>
                          <span style={styles.topCategoryRank}>#{index + 1}</span>
                          <span style={styles.topCategoryName}>{cat.category}</span>
                        </div>
                        <p style={styles.topCategoryAmount}>${cat.amount.toFixed(2)}</p>
                        <p style={styles.topCategoryPercentage}>{cat.percentage}% of total</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <UserFooter />
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f3f4f6",
  },
  mainContent: {
    display: "flex",
    flex: 1,
  },
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
  main: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#6b7280",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e5e7eb",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  welcomeContainer: {
    textAlign: "center",
    maxWidth: "600px",
    margin: "60px auto",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  welcomeIcon: {
    color: "#3b82f6",
    marginBottom: "20px",
  },
  welcomeTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "12px",
  },
  welcomeText: {
    color: "#6b7280",
    marginBottom: "24px",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  secondaryButton: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  dashboardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  cardValue: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  cardIcon: {
    padding: "12px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "16px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  viewAllButton: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    fontSize: "14px",
    cursor: "pointer",
  },
  budgetList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  budgetItem: {
    marginBottom: "12px",
  },
  budgetHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
    fontSize: "14px",
  },
  budgetCategory: {
    fontWeight: "500",
    color: "#374151",
  },
  budgetAmount: {
    color: "#6b7280",
  },
  budgetPercentage: {
    marginLeft: "4px",
    color: "#9ca3af",
  },
  progressBarContainer: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    transition: "width 0.3s ease",
  },
  exceededText: {
    fontSize: "12px",
    color: "#ef4444",
    marginTop: "4px",
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  categoryList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  categoryItem: {
    marginBottom: "8px",
  },
  categoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
    fontSize: "14px",
  },
  categoryName: {
    color: "#374151",
  },
  categoryAmount: {
    fontWeight: "500",
    color: "#1f2937",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 0",
    color: "#9ca3af",
  },
  emptyText: {
    marginTop: "12px",
    fontSize: "14px",
  },
  transactionList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  transactionItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    borderRadius: "6px",
    transition: "background-color 0.2s",
  },
  transactionInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  transactionDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  transactionDesc: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1f2937",
  },
  transactionMeta: {
    fontSize: "12px",
    color: "#6b7280",
  },
  transactionAmount: {
    fontSize: "14px",
    fontWeight: "600",
  },
  topCategoriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  topCategoryCard: {
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  topCategoryHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  topCategoryRank: {
    fontSize: "12px",
    padding: "2px 8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "12px",
    color: "#4b5563",
  },
  topCategoryName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1f2937",
  },
  topCategoryAmount: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#ef4444",
    marginBottom: "4px",
  },
  topCategoryPercentage: {
    fontSize: "12px",
    color: "#6b7280",
  },
};

// Add this to your global CSS or create a style tag
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default UserHome;