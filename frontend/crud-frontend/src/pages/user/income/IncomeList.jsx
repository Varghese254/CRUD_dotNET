// pages/user/income/IncomeList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Filter, ArrowLeft } from 'lucide-react';
import api from '../../../api';
import UserSidebar from '../UserSidebar';
import UserHeader from '../UserHeader'; // Import UserHeader component
import UserFooter from '../UserFooter'; // Import UserFooter component

function IncomeList() {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('income');

  useEffect(() => {
    fetchIncomes();
  }, [filterMonth, filterYear]);

  const fetchIncomes = async () => {
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
      
      const response = await api.get('/income', {
        params: { month: filterMonth, year: filterYear }
      });
      
      console.log('API Response:', response.data);
      
      // Transform the data - is_recurring will be mapped to IsRecurring by Dapper
      const rawIncomes = response.data.incomes || [];
      const formattedIncomes = rawIncomes.map(income => ({
        id: income.id,
        amount: parseFloat(income.amount),
        category: income.category,
        date: income.date,
        description: income.description || '',
        // Convert MySQL tinyint(1) to boolean
        isRecurring: income.isRecurring === true || income.isRecurring === 1 || income.isRecurring === '1'
      }));
      
      console.log('Formatted incomes:', formattedIncomes);
      setIncomes(formattedIncomes);
      setTotalIncome(parseFloat(response.data.total) || 0);
    } catch (error) {
      console.error('Error fetching incomes:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/signin');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch incomes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await api.delete(`/income/${id}`);
        fetchIncomes(); // Refresh list
      } catch (error) {
        console.error('Error deleting income:', error);
        alert('Failed to delete income');
      }
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
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
            {/* Back button and title */}
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
                <h1 style={styles.pageTitle}>Income Management</h1>
                <p style={styles.pageSubtitle}>Track and manage your income sources</p>
              </div>
            </div>

            {/* Summary Card */}
            <div style={styles.summaryCard}>
              <p style={styles.summaryLabel}>Total Income for {filterMonth}/{filterYear}</p>
              <p style={styles.summaryValue}>{formatCurrency(totalIncome)}</p>
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
                to="/user/income/add"
                style={styles.addButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                <PlusCircle size={20} style={styles.addButtonIcon} />
                Add Income
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div style={styles.errorContainer}>
                {error}
              </div>
            )}

            {/* Income List */}
            <div style={styles.tableContainer}>
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.loadingSpinner}></div>
                  <p style={styles.loadingText}>Loading incomes...</p>
                </div>
              ) : incomes.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={styles.emptyStateText}>No income entries for this period.</p>
                  <Link
                    to="/user/income/add"
                    style={styles.emptyStateLink}
                  >
                    Add your first income →
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
                      <th style={styles.tableHeader}>Recurring</th>
                      <th style={styles.tableHeader}>Actions</th>
                    </tr>
                  </thead>
                  <tbody style={styles.tableBody}>
                    {incomes.map((income) => (
                      <tr 
                        key={income.id} 
                        style={styles.tableRow}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={styles.tableCell}>{formatDate(income.date)}</td>
                        <td style={styles.tableCell}>
                          <span style={{
                            ...styles.categoryBadge,
                            backgroundColor: '#dbeafe',
                            color: '#1e40af'
                          }}>
                            {income.category}
                          </span>
                        </td>
                        <td style={styles.tableCell}>{income.description || '-'}</td>
                        <td style={{
                          ...styles.tableCell,
                          ...styles.amountCell,
                          color: '#10b981'
                        }}>
                          {formatCurrency(income.amount)}
                        </td>
                        <td style={styles.tableCell}>
                          {income.isRecurring ? (
                            <span style={{
                              ...styles.recurringBadge,
                              backgroundColor: '#d1fae5',
                              color: '#065f46'
                            }}>
                              Monthly
                            </span>
                          ) : (
                            <span style={styles.notRecurring}>-</span>
                          )}
                        </td>
                        <td style={styles.tableCell}>
                          <button
                            onClick={() => navigate(`/user/income/edit/${income.id}`)}
                            style={styles.editButton}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#3b82f6'}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(income.id)}
                            style={styles.deleteButton}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
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
    background: "linear-gradient(to right, #3b82f6, #2563eb)",
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
    backgroundColor: "#3b82f6",
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
    borderTopColor: "#3b82f6",
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
    color: "#3b82f6",
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
  recurringBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "500",
  },
  notRecurring: {
    color: "#9ca3af",
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
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default IncomeList;