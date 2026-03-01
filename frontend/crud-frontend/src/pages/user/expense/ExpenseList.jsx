// pages/user/expense/ExpenseList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Filter, ArrowLeft } from 'lucide-react';
import api from '../../../api';
import UserSidebar from '../UserSidebar';
import UserHeader from '../UserHeader';
import UserFooter from '../UserFooter';

function ExpenseList() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('expenses');

  useEffect(() => {
    fetchExpenses();
  }, [filterMonth, filterYear]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user is logged in
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      if (!token || !userStr) {
        navigate('/signin');
        return;
      }
      
      const response = await api.get('/expense', {
        params: { month: filterMonth, year: filterYear }
      });
      
      console.log('API Response:', response.data);
      
      // Transform the data
      const rawExpenses = response.data.expenses || [];
      const formattedExpenses = rawExpenses.map(expense => ({
        id: expense.id,
        amount: parseFloat(expense.amount),
        category: expense.category,
        date: expense.date,
        description: expense.description || '',
        // Handle recurring if you add this field to expenses
        isRecurring: expense.isRecurring === true || expense.isRecurring === 1 || expense.isRecurring === '1'
      }));
      
      setExpenses(formattedExpenses);
      setTotalExpense(parseFloat(response.data.total) || 0);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/signin');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch expenses');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expense/${id}`);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      }
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': { bg: '#fff1f0', text: '#ef4444' },
      'Rent/Housing': { bg: '#f3e8ff', text: '#9333ea' },
      'Travel': { bg: '#dbeafe', text: '#1e40af' },
      'Shopping': { bg: '#fce7f3', text: '#be185d' },
      'Entertainment': { bg: '#e0e7ff', text: '#4f46e5' },
      'Healthcare': { bg: '#fee2e2', text: '#b91c1c' },
      'Utilities': { bg: '#fef3c7', text: '#b45309' },
      'Education': { bg: '#dcfce7', text: '#166534' },
      'Others': { bg: '#f3f4f6', text: '#4b5563' }
    };
    return colors[category] || { bg: '#f3f4f6', text: '#4b5563' };
  };

  return (
    <div style={styles.container}>
      <UserHeader />

      <div style={styles.mainContent}>
        {/* Sidebar Navigation */}
        <UserSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Main Content Area */}
        <main style={styles.main}>
          <div style={styles.contentWrapper}>
            {/* Header with back button */}
            <div style={styles.pageHeader}>
              <button
                onClick={() => navigate('/user/home')}
                style={styles.backButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 style={styles.pageTitle}>Expense Management</h1>
                <p style={styles.pageSubtitle}>Track and manage your expenses</p>
              </div>
            </div>

            {/* Summary Card */}
            <div style={styles.summaryCard}>
              <p style={styles.summaryLabel}>Total Expenses for {filterMonth}/{filterYear}</p>
              <p style={styles.summaryValue}>{formatCurrency(totalExpense)}</p>
            </div>

            {/* Filters and Add Button */}
            <div style={styles.filtersCard}>
              <div style={styles.filtersSection}>
                <Filter size={20} style={styles.filterIcon} />
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                  style={styles.select}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(parseInt(e.target.value))}
                  style={styles.select}
                >
                  {[2023, 2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <Link
                to="/user/expenses/add"
                style={styles.addButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                <PlusCircle size={20} style={styles.addButtonIcon} />
                Add Expense
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div style={styles.errorContainer}>
                {error}
              </div>
            )}

            {/* Expense List */}
            <div style={styles.tableContainer}>
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.loadingSpinner}></div>
                  <p style={styles.loadingText}>Loading expenses...</p>
                </div>
              ) : expenses.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={styles.emptyStateText}>No expense entries for this period.</p>
                  <Link
                    to="/user/expenses/add"
                    style={styles.emptyStateLink}
                  >
                    Add your first expense →
                  </Link>
                </div>
              ) : (
                <table style={styles.table}>
                  <thead style={styles.tableHead}>
                    <tr>
                      <th style={styles.tableHeader}>Date</th>
                      <th style={styles.tableHeader}>Category</th>
                      <th style={styles.tableHeader}>Description</th>
                      <th style={styles.tableHeader}>Amount</th>
                      <th style={styles.tableHeader}>Actions</th>
                    </tr>
                  </thead>
                  <tbody style={styles.tableBody}>
                    {expenses.map((expense) => {
                      const categoryColor = getCategoryColor(expense.category);
                      return (
                        <tr 
                          key={expense.id} 
                          style={styles.tableRow}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={styles.tableCell}>{formatDate(expense.date)}</td>
                          <td style={styles.tableCell}>
                            <span style={{
                              ...styles.categoryBadge,
                              backgroundColor: categoryColor.bg,
                              color: categoryColor.text
                            }}>
                              {expense.category}
                            </span>
                          </td>
                          <td style={styles.tableCell}>{expense.description || '-'}</td>
                          <td style={{
                            ...styles.tableCell,
                            ...styles.amountCell,
                            color: '#ef4444'
                          }}>
                            {formatCurrency(expense.amount)}
                          </td>
                          <td style={styles.tableCell}>
                            <button
                              onClick={() => navigate(`/user/expenses/edit/${expense.id}`)}
                              style={styles.editButton}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#3b82f6'}
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(expense.id)}
                              style={styles.deleteButton}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Quick Stats Card */}
            {expenses.length > 0 && (
              <div style={styles.statsCard}>
                <h3 style={styles.statsTitle}>📊 Quick Statistics</h3>
                <div style={styles.statsGrid}>
                  <div style={styles.statItem}>
                    <p style={styles.statLabel}>Total Entries</p>
                    <p style={styles.statValue}>{expenses.length}</p>
                  </div>
                  <div style={styles.statItem}>
                    <p style={styles.statLabel}>Average per Entry</p>
                    <p style={styles.statValue}>{formatCurrency(totalExpense / expenses.length)}</p>
                  </div>
                  <div style={styles.statItem}>
                    <p style={styles.statLabel}>Categories Used</p>
                    <p style={styles.statValue}>{new Set(expenses.map(e => e.category)).size}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
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
  main: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
  },
  contentWrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  pageHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "24px",
  },
  backButton: {
    marginRight: "16px",
    padding: "8px",
    border: "none",
    background: "none",
    borderRadius: "9999px",
    cursor: "pointer",
    color: "#4b5563",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "4px",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },
  summaryCard: {
    background: "linear-gradient(to right, #ef4444, #dc2626)",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "24px",
    color: "white",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  summaryLabel: {
    fontSize: "14px",
    opacity: "0.9",
    marginBottom: "4px",
  },
  summaryValue: {
    fontSize: "36px",
    fontWeight: "bold",
  },
  filtersCard: {
    backgroundColor: "white",
    padding: "16px 20px",
    borderRadius: "8px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  filtersSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  filterIcon: {
    color: "#6b7280",
  },
  select: {
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
    backgroundColor: "white",
  },
  addButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  addButtonIcon: {
    marginRight: "8px",
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #ef4444",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden",
    marginBottom: "24px",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "48px",
  },
  loadingSpinner: {
    display: "inline-block",
    width: "32px",
    height: "32px",
    border: "3px solid #e5e7eb",
    borderTopColor: "#ef4444",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "12px",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: "14px",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px",
  },
  emptyStateText: {
    color: "#6b7280",
    marginBottom: "8px",
  },
  emptyStateLink: {
    color: "#ef4444",
    textDecoration: "none",
    fontWeight: "500",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHead: {
    backgroundColor: "#f9fafb",
  },
  tableHeader: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "500",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e5e7eb",
  },
  tableBody: {
    backgroundColor: "white",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s",
    cursor: "pointer",
  },
  tableCell: {
    padding: "16px",
    fontSize: "14px",
    color: "#1f2937",
  },
  amountCell: {
    fontWeight: "600",
  },
  categoryBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "500",
  },
  editButton: {
    border: "none",
    background: "none",
    color: "#3b82f6",
    marginRight: "12px",
    cursor: "pointer",
    padding: "4px",
    transition: "color 0.2s",
  },
  deleteButton: {
    border: "none",
    background: "none",
    color: "#ef4444",
    cursor: "pointer",
    padding: "4px",
    transition: "color 0.2s",
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  statsTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "16px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
  },
  statItem: {
    textAlign: "center",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ef4444",
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  select:hover, button:hover {
    opacity: 0.9;
  }
`;
document.head.appendChild(styleSheet);

export default ExpenseList;