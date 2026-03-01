// pages/user/expense/AddExpense.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../../../api';
import UserSidebar from '../UserSidebar';
import UserHeader from '../UserHeader';
import UserFooter from '../UserFooter';

function AddExpense() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('expenses');

  const categories = [
    'Food & Dining', 'Rent/Housing', 'Travel', 'Shopping', 
    'Entertainment', 'Healthcare', 'Utilities', 'Education', 'Others'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      if (!token || !userStr) {
        navigate('/signin');
        return;
      }

      await api.post('/expense', formData);
      navigate('/user/expenses');
    } catch (error) {
      console.error('Error adding expense:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/signin');
      } else {
        setError(error.response?.data?.message || 'Failed to add expense');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
                onClick={() => navigate('/user/expenses')}
                style={styles.backButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 style={styles.pageTitle}>Add New Expense</h1>
                <p style={styles.pageSubtitle}>Record your expense</p>
              </div>
            </div>

            {/* Form Card */}
            <div style={styles.formCard}>
              {error && (
                <div style={styles.errorContainer}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={styles.form}>
                {/* Amount Field */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Amount <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <span style={styles.currencySymbol}>₹</span>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={handleChange}
                      style={styles.amountInput}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Category Field */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Category <span style={styles.required}>*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Date Field */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Date <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                {/* Description Field */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={styles.textarea}
                    rows="3"
                    placeholder="e.g., Grocery shopping, Restaurant bill, Movie tickets, Monthly rent..."
                  />
                  <p style={styles.helperText}>
                    Add any additional details about this expense
                  </p>
                </div>

                {/* Form Actions */}
                <div style={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => navigate('/user/expenses')}
                    style={styles.cancelButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.borderColor = '#9ca3af';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      ...styles.submitButton,
                      ...(loading ? styles.submitButtonDisabled : {})
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = '#ef4444';
                      }
                    }}
                  >
                    <Save size={18} style={styles.submitIcon} />
                    {loading ? 'Adding Expense...' : 'Add Expense'}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Tips Card */}
            <div style={styles.tipsCard}>
              <h3 style={styles.tipsTitle}>💡 Quick Tips</h3>
              <ul style={styles.tipsList}>
                <li style={styles.tipItem}>Be specific with categories for better budget tracking</li>
                <li style={styles.tipItem}>Add descriptions to easily identify expenses later</li>
                <li style={styles.tipItem}>Double-check the amount before saving</li>
                <li style={styles.tipItem}>You can edit or delete expenses from the expense list</li>
              </ul>
            </div>

            {/* Category Examples Card */}
            <div style={styles.examplesCard}>
              <h3 style={styles.examplesTitle}>📋 Category Examples</h3>
              <div style={styles.examplesGrid}>
                <div style={styles.exampleItem}>
                  <span style={{...styles.exampleDot, backgroundColor: '#f97316'}}></span>
                  <span style={styles.exampleText}><strong>Food & Dining:</strong> Groceries, restaurants, coffee shops</span>
                </div>
                <div style={styles.exampleItem}>
                  <span style={{...styles.exampleDot, backgroundColor: '#8b5cf6'}}></span>
                  <span style={styles.exampleText}><strong>Rent/Housing:</strong> Monthly rent, maintenance, furniture</span>
                </div>
                <div style={styles.exampleItem}>
                  <span style={{...styles.exampleDot, backgroundColor: '#3b82f6'}}></span>
                  <span style={styles.exampleText}><strong>Travel:</strong> Fuel, public transport, flights, hotels</span>
                </div>
                <div style={styles.exampleItem}>
                  <span style={{...styles.exampleDot, backgroundColor: '#ec4899'}}></span>
                  <span style={styles.exampleText}><strong>Shopping:</strong> Clothes, electronics, personal items</span>
                </div>
                <div style={styles.exampleItem}>
                  <span style={{...styles.exampleDot, backgroundColor: '#6366f1'}}></span>
                  <span style={styles.exampleText}><strong>Entertainment:</strong> Movies, streaming services, hobbies</span>
                </div>
                <div style={styles.exampleItem}>
                  <span style={{...styles.exampleDot, backgroundColor: '#ef4444'}}></span>
                  <span style={styles.exampleText}><strong>Healthcare:</strong> Doctor visits, medicines, insurance</span>
                </div>
                <div style={styles.exampleItem}>
                  <span style={{...styles.exampleDot, backgroundColor: '#f59e0b'}}></span>
                  <span style={styles.exampleText}><strong>Utilities:</strong> Electricity, water, internet, phone bills</span>
                </div>
                <div style={styles.exampleItem}>
                  <span style={{...styles.exampleDot, backgroundColor: '#10b981'}}></span>
                  <span style={styles.exampleText}><strong>Education:</strong> Tuition, courses, books, supplies</span>
                </div>
              </div>
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
    maxWidth: "800px",
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
  formCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    marginBottom: "24px",
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "24px",
    border: "1px solid #ef4444",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  required: {
    color: "#ef4444",
    marginLeft: "2px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  currencySymbol: {
    position: "absolute",
    left: "12px",
    color: "#6b7280",
    fontSize: "16px",
    fontWeight: "500",
  },
  amountInput: {
    width: "100%",
    padding: "10px 12px 10px 28px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "white",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    resize: "vertical",
    fontFamily: "inherit",
  },
  helperText: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },
  formActions: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#4b5563",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  submitButton: {
    flex: 2,
    padding: "12px",
    backgroundColor: "#ef4444",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  submitIcon: {
    marginRight: "8px",
  },
  tipsCard: {
    backgroundColor: "#fff7ed",
    border: "1px solid #f97316",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
  },
  tipsTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#9a3412",
    marginBottom: "12px",
  },
  tipsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  tipItem: {
    fontSize: "14px",
    color: "#9a3412",
    marginBottom: "8px",
    paddingLeft: "20px",
    position: "relative",
  },
  examplesCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  examplesTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "16px",
  },
  examplesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
  },
  exampleItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#4b5563",
  },
  exampleDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  exampleText: {
    lineHeight: "1.4",
  },
};

// Add focus styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  input:focus, select:focus, textarea:focus {
    border-color: #ef4444 !important;
    ring: 2px solid #ef4444 !important;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
  }
  
  button:focus {
    outline: none;
    ring: 2px solid #ef4444;
  }
`;
document.head.appendChild(styleSheet);

export default AddExpense;