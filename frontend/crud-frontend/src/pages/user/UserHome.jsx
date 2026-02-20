import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import api from "../../api";
import { 
  DollarSign, TrendingUp, TrendingDown, Wallet, 
  PlusCircle, PieChart, List, Home, 
  BarChart3, Target, Settings
} from 'lucide-react';

function UserHome() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      monthlySavings: 0,
      savingsRate: 0
    },
    budgets: [],
    categoryExpenses: [],
    topCategories: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError('');
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    console.log('Auth Check:', { 
      hasToken: !!token, 
      hasUser: !!userStr,
      token: token ? `${token.substring(0, 20)}...` : 'No token'
    });
    
    if (!token || !userStr) {
      console.log('No token or user found, redirecting to login');
      navigate('/signin');
      return;
    }
    
    const currentDate = new Date();
    const response = await api.get('/dashboard', {
      params: { 
        month: currentDate.getMonth() + 1, 
        year: currentDate.getFullYear() 
      }
    });
    
    console.log('Dashboard data received:', response.data);
    setDashboardData(response.data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    if (error.response?.status === 401) {
      setError('Your session has expired. Please login again.');
      // Clear invalid data
      localStorage.clear();
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } else {
      setError('Failed to load dashboard data. Please try again.');
    }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

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
          {error && (
            <div style={styles.errorContainer}>
              <p style={styles.errorText}>{error}</p>
              <button onClick={fetchDashboardData} style={styles.retryButton}>
                Retry
              </button>
            </div>
          )}

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
                        {formatCurrency(dashboardData.summary.totalIncome)}
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
                        {formatCurrency(dashboardData.summary.totalExpense)}
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
                      <p style={styles.cardLabel}>Current Balance</p>
                      <p style={{
                        ...styles.cardValue,
                        color: dashboardData.summary.balance >= 0 ? '#10b981' : '#ef4444'
                      }}>
                        {dashboardData.summary.balance >= 0 ? '+' : '-'}
                        {formatCurrency(Math.abs(dashboardData.summary.balance))}
                      </p>
                      <p style={styles.savingsRate}>
                        Savings Rate: {dashboardData.summary.savingsRate}%
                      </p>
                    </div>
                    <div style={{
                      ...styles.cardIcon, 
                      backgroundColor: dashboardData.summary.balance >= 0 ? '#d1fae5' : '#fee2e2'
                    }}>
                      <DollarSign 
                        color={dashboardData.summary.balance >= 0 ? "#10b981" : "#ef4444"} 
                        size={24} 
                      />
                    </div>
                  </div>
                </div>

                <div style={styles.summaryCard}>
                  <div style={styles.cardContent}>
                    <div>
                      <p style={styles.cardLabel}>Monthly Savings</p>
                      <p style={{...styles.cardValue, color: '#8b5cf6'}}>
                        {formatCurrency(dashboardData.summary.monthlySavings)}
                      </p>
                    </div>
                    <div style={{...styles.cardIcon, backgroundColor: '#ede9fe'}}>
                      <Wallet color="#8b5cf6" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Progress Section */}
              {dashboardData.budgets && dashboardData.budgets.length > 0 && (
                <div style={styles.sectionCard}>
                  <h2 style={styles.sectionTitle}>Budget Progress</h2>
                  <div style={styles.budgetList}>
                    {dashboardData.budgets.map((budget) => (
                      <div key={budget.category} style={styles.budgetItem}>
                        <div style={styles.budgetHeader}>
                          <span style={styles.budgetCategory}>{budget.category}</span>
                          <span style={styles.budgetAmount}>
                            {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
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
                            Exceeded by {formatCurrency(budget.spent - budget.budget)}
                          </p>
                        )}
                        {budget.remaining > 0 && budget.percentage < 100 && (
                          <p style={styles.remainingText}>
                            Remaining: {formatCurrency(budget.remaining)}
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
                  {dashboardData.categoryExpenses && dashboardData.categoryExpenses.length > 0 ? (
                    <div style={styles.categoryList}>
                      {dashboardData.categoryExpenses.map((cat) => (
                        <div key={cat.category} style={styles.categoryItem}>
                          <div style={styles.categoryHeader}>
                            <span style={styles.categoryName}>{cat.category}</span>
                            <span style={styles.categoryAmount}>
                              {formatCurrency(cat.amount)} ({cat.percentage}%)
                            </span>
                          </div>
                          <div style={styles.progressBarContainer}>
                            <div
                              style={{
                                ...styles.progressBar,
                                width: `${cat.percentage}%`,
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
                  
                  {dashboardData.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
                    <div style={styles.transactionList}>
                      {dashboardData.recentTransactions.map((transaction) => (
                        <div 
                          key={`${transaction.type}-${transaction.id}`} 
                          style={styles.transactionItem}
                          onClick={() => navigate(
                            transaction.type === 'income' 
                              ? `/user/income/edit/${transaction.id}`
                              : `/user/expenses/edit/${transaction.id}`
                          )}
                        >
                          <div style={styles.transactionInfo}>
                            <div style={{
                              ...styles.transactionDot,
                              backgroundColor: transaction.type === 'income' ? '#10b981' : '#ef4444'
                            }}></div>
                            <div>
                              <p style={styles.transactionDesc}>
                                {transaction.description || transaction.category}
                              </p>
                              <p style={styles.transactionMeta}>
                                {formatDate(transaction.date)} • {transaction.category}
                              </p>
                            </div>
                          </div>
                          <p style={{
                            ...styles.transactionAmount,
                            color: transaction.type === 'income' ? '#10b981' : '#ef4444'
                          }}>
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
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
              {dashboardData.topCategories && dashboardData.topCategories.length > 0 && (
                <div style={styles.sectionCard}>
                  <h2 style={styles.sectionTitle}>Top Spending Categories</h2>
                  <div style={styles.topCategoriesGrid}>
                    {dashboardData.topCategories.map((cat, index) => (
                      <div key={cat.category} style={styles.topCategoryCard}>
                        <div style={styles.topCategoryHeader}>
                          <span style={styles.topCategoryRank}>#{index + 1}</span>
                          <span style={styles.topCategoryName}>{cat.category}</span>
                        </div>
                        <p style={styles.topCategoryAmount}>{formatCurrency(cat.amount)}</p>
                        <p style={styles.topCategoryPercentage}>{cat.percentage}% of total</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Savings Tip */}
              {dashboardData.summary.balance !== 0 && (
                <div style={styles.tipCard}>
                  <h3 style={styles.tipTitle}>💡 Savings Tip</h3>
                  <p style={styles.tipText}>
                    {dashboardData.summary.balance > 0 
                      ? `Great job! You saved ${formatCurrency(dashboardData.summary.balance)} this month. Keep it up!`
                      : `You spent ${formatCurrency(Math.abs(dashboardData.summary.balance))} more than you earned. Try to reduce expenses in your top categories.`}
                  </p>
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
  errorContainer: {
    backgroundColor: "#fee2e2",
    border: "1px solid #ef4444",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    color: "#b91c1c",
    margin: 0,
  },
  retryButton: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
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
  savingsRate: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
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
    padding: "4px 8px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
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
  remainingText: {
    fontSize: "12px",
    color: "#10b981",
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
    gap: "8px",
  },
  transactionItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderRadius: "8px",
    transition: "background-color 0.2s",
    cursor: "pointer",
  },
  transactionInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
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
    marginBottom: "2px",
  },
  transactionMeta: {
    fontSize: "12px",
    color: "#6b7280",
  },
  transactionAmount: {
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
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
    transition: "transform 0.2s",
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
  tipCard: {
    backgroundColor: "#fef3c7",
    border: "1px solid #f59e0b",
    borderRadius: "8px",
    padding: "16px",
  },
  tipTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#92400e",
    marginBottom: "8px",
  },
  tipText: {
    fontSize: "14px",
    color: "#92400e",
    margin: 0,
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default UserHome;