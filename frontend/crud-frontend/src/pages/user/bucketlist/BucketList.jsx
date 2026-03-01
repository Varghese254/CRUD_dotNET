// pages/user/bucketlist/BucketList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, Edit, Trash2, Gift, Target, 
  Calendar, DollarSign, Link as LinkIcon, ShoppingBag,
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import api from '../../../api';
import UserSidebar from '../UserSidebar';
import UserHeader from '../UserHeader';
import UserFooter from '../UserFooter';

function BucketList() {
  const navigate = useNavigate();
  const [bucketItems, setBucketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bucketlist');
  const [filter, setFilter] = useState('all'); // all, purchased, pending

  useEffect(() => {
    fetchBucketItems();
  }, []);

  const fetchBucketItems = async () => {
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
      
      const response = await api.get('/bucketlist');
      console.log('Bucket items:', response.data);
      setBucketItems(response.data);
    } catch (error) {
      console.error('Error fetching bucket items:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/signin');
      } else {
        setError('Failed to load bucket list');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await api.delete(`/bucketlist/${id}`);
        fetchBucketItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const handleTogglePurchased = async (id, currentStatus) => {
    try {
      await api.patch(`/bucketlist/${id}/toggle-purchased`);
      fetchBucketItems();
    } catch (error) {
      console.error('Error toggling purchased status:', error);
      alert('Failed to update status');
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high':
        return { bg: '#fee2e2', color: '#b91c1c', label: '🔴 High' };
      case 'medium':
        return { bg: '#fef3c7', color: '#b45309', label: '🟡 Medium' };
      case 'low':
        return { bg: '#d1fae5', color: '#065f46', label: '🟢 Low' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563', label: '⚪ Not Set' };
    }
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'travel':
        return '✈️';
      case 'shopping':
        return '🛍️';
      case 'electronics':
        return '📱';
      case 'vehicle':
        return '🚗';
      case 'home':
        return '🏠';
      case 'experience':
        return '🎉';
      default:
        return '🎯';
    }
  };

  const filteredItems = bucketItems.filter(item => {
    if (filter === 'purchased') return item.purchased;
    if (filter === 'pending') return !item.purchased;
    return true;
  });

  // Calculate stats
  const stats = {
    total: bucketItems.length,
    purchased: bucketItems.filter(i => i.purchased).length,
    pending: bucketItems.filter(i => !i.purchased).length,
    totalCost: bucketItems.reduce((sum, i) => sum + (parseFloat(i.estimated_cost) || 0), 0),
    purchasedCost: bucketItems.filter(i => i.purchased).reduce((sum, i) => sum + (parseFloat(i.estimated_cost) || 0), 0),
    pendingCost: bucketItems.filter(i => !i.purchased).reduce((sum, i) => sum + (parseFloat(i.estimated_cost) || 0), 0)
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
            {/* Header */}
            <div style={styles.pageHeader}>
              <div>
                <h1 style={styles.pageTitle}>My Bucket List</h1>
                <p style={styles.pageSubtitle}>Dream it. Plan it. Achieve it.</p>
              </div>
              <button
                onClick={() => navigate('/user/bucketlist/add')}
                style={styles.addButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                <PlusCircle size={20} style={styles.addButtonIcon} />
                Add New Dream
              </button>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={{...styles.statCard, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                <Target size={24} style={styles.statIcon} />
                <div>
                  <p style={styles.statLabel}>Total Dreams</p>
                  <p style={styles.statValue}>{stats.total}</p>
                </div>
              </div>
              
              <div style={{...styles.statCard, background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                <CheckCircle size={24} style={styles.statIcon} />
                <div>
                  <p style={styles.statLabel}>Achieved</p>
                  <p style={styles.statValue}>{stats.purchased}</p>
                </div>
              </div>
              
              <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                <Clock size={24} style={styles.statIcon} />
                <div>
                  <p style={styles.statLabel}>In Progress</p>
                  <p style={styles.statValue}>{stats.pending}</p>
                </div>
              </div>
              
              <div style={{...styles.statCard, background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}>
                <DollarSign size={24} style={styles.statIcon} />
                <div>
                  <p style={styles.statLabel}>Total Value</p>
                  <p style={styles.statValue}>{formatCurrency(stats.totalCost)}</p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div style={styles.summaryGrid}>
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>Achieved Value</p>
                <p style={{...styles.summaryValue, color: '#10b981'}}>
                  {formatCurrency(stats.purchasedCost)}
                </p>
                <p style={styles.summarySub}>
                  {stats.purchased} items completed
                </p>
              </div>
              
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>Pending Investment</p>
                <p style={{...styles.summaryValue, color: '#f59e0b'}}>
                  {formatCurrency(stats.pendingCost)}
                </p>
                <p style={styles.summarySub}>
                  {stats.pending} items to go
                </p>
              </div>
            </div>

            {/* Filters */}
            <div style={styles.filtersCard}>
              <div style={styles.filterButtons}>
                <button
                  onClick={() => setFilter('all')}
                  style={{
                    ...styles.filterButton,
                    ...(filter === 'all' ? styles.filterButtonActive : {})
                  }}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  style={{
                    ...styles.filterButton,
                    ...(filter === 'pending' ? styles.filterButtonActive : {})
                  }}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setFilter('purchased')}
                  style={{
                    ...styles.filterButton,
                    ...(filter === 'purchased' ? styles.filterButtonActive : {})
                  }}
                >
                  Achieved ({stats.purchased})
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={styles.errorContainer}>
                {error}
              </div>
            )}

            {/* Bucket List Items */}
            <div style={styles.itemsContainer}>
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.loadingSpinner}></div>
                  <p style={styles.loadingText}>Loading your dreams...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div style={styles.emptyState}>
                  <Gift size={64} style={styles.emptyIcon} />
                  <h3 style={styles.emptyTitle}>Your bucket list is empty</h3>
                  <p style={styles.emptyText}>
                    Start adding your dreams, goals, and wishes!
                  </p>
                  <button
                    onClick={() => navigate('/user/bucketlist/add')}
                    style={styles.emptyButton}
                  >
                    <PlusCircle size={20} style={{ marginRight: '8px' }} />
                    Add Your First Dream
                  </button>
                </div>
              ) : (
                <div style={styles.itemsGrid}>
                  {filteredItems.map((item) => {
                    const priority = getPriorityColor(item.priority);
                    const categoryIcon = getCategoryIcon(item.category);
                    
                    return (
                      <div 
                        key={item.id} 
                        style={{
                          ...styles.itemCard,
                          ...(item.purchased ? styles.itemCardPurchased : {})
                        }}
                      >
                        {/* Status Badge */}
                        {item.purchased && (
                          <div style={styles.purchasedBadge}>
                            <CheckCircle size={16} />
                            <span>Achieved</span>
                          </div>
                        )}

                        {/* Category Icon */}
                        <div style={styles.itemCategory}>
                          <span style={styles.categoryIcon}>{categoryIcon}</span>
                          <span style={styles.categoryName}>{item.category || 'Other'}</span>
                        </div>

                        {/* Item Name */}
                        <h3 style={styles.itemTitle}>{item.item_name}</h3>

                        {/* Description */}
                        {item.description && (
                          <p style={styles.itemDescription}>{item.description}</p>
                        )}

                        {/* Details Grid */}
                        <div style={styles.itemDetails}>
                          {/* Cost */}
                          <div style={styles.detailItem}>
                            <DollarSign size={16} style={styles.detailIcon} />
                            <span style={styles.detailText}>
                              {formatCurrency(item.estimated_cost)}
                            </span>
                          </div>

                          {/* Target Date */}
                          {item.target_date && (
                            <div style={styles.detailItem}>
                              <Calendar size={16} style={styles.detailIcon} />
                              <span style={styles.detailText}>
                                {formatDate(item.target_date)}
                              </span>
                            </div>
                          )}

                          {/* Priority */}
                          <div style={{
                            ...styles.priorityBadge,
                            backgroundColor: priority.bg,
                            color: priority.color
                          }}>
                            {priority.label}
                          </div>
                        </div>

                        {/* Product Links */}
                        {item.productLinks && item.productLinks.length > 0 && (
                          <div style={styles.linksSection}>
                            <p style={styles.linksTitle}>
                              <LinkIcon size={14} style={{ marginRight: '4px' }} />
                              Product Links ({item.productLinks.length})
                            </p>
                            <div style={styles.linksList}>
                              {item.productLinks.map((link, index) => (
                                <a
                                  key={index}
                                  href={link.product_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={styles.linkItem}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <ShoppingBag size={14} style={{ marginRight: '4px' }} />
                                  {link.platform}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div style={styles.itemActions}>
                          <button
                            onClick={() => handleTogglePurchased(item.id, item.purchased)}
                            style={{
                              ...styles.actionButton,
                              ...styles.toggleButton,
                              backgroundColor: item.purchased ? '#f59e0b' : '#10b981'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = item.purchased ? '#d97706' : '#059669';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = item.purchased ? '#f59e0b' : '#10b981';
                            }}
                          >
                            {item.purchased ? 'Mark Pending' : 'Mark Achieved'}
                          </button>
                          
                          <button
                            onClick={() => navigate(`/user/bucketlist/edit/${item.id}`)}
                            style={{
                              ...styles.actionButton,
                              ...styles.editButton
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                          >
                            <Edit size={16} style={{ marginRight: '4px' }} />
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              ...styles.actionButton,
                              ...styles.deleteButton
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                          >
                            <Trash2 size={16} style={{ marginRight: '4px' }} />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
    maxWidth: "1400px",
    margin: "0 auto",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "4px",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },
  addButton: {
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
  addButtonIcon: {
    marginRight: "8px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    borderRadius: "12px",
    color: "white",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  statIcon: {
    opacity: 0.9,
  },
  statLabel: {
    fontSize: "12px",
    opacity: 0.9,
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  summaryLabel: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  summaryValue: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  summarySub: {
    fontSize: "12px",
    color: "#9ca3af",
  },
  filtersCard: {
    backgroundColor: "white",
    padding: "16px 20px",
    borderRadius: "8px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  filterButtons: {
    display: "flex",
    gap: "12px",
  },
  filterButton: {
    padding: "8px 16px",
    border: "none",
    background: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#6b7280",
    transition: "all 0.2s",
  },
  filterButtonActive: {
    backgroundColor: "#10b981",
    color: "white",
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #ef4444",
  },
  itemsContainer: {
    minHeight: "400px",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "48px",
  },
  loadingSpinner: {
    display: "inline-block",
    width: "40px",
    height: "40px",
    border: "3px solid #e5e7eb",
    borderTopColor: "#10b981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: "14px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  emptyIcon: {
    color: "#9ca3af",
    marginBottom: "20px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#6b7280",
    marginBottom: "24px",
  },
  emptyButton: {
    display: "inline-flex",
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
  itemsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px",
  },
  itemCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    position: "relative",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "1px solid #e5e7eb",
  },
  itemCardPurchased: {
    opacity: 0.9,
    backgroundColor: "#f9fafb",
    borderColor: "#10b981",
  },
  purchasedBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    backgroundColor: "#10b981",
    color: "white",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },
  itemCategory: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  categoryIcon: {
    fontSize: "20px",
  },
  categoryName: {
    fontSize: "12px",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  itemTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "8px",
  },
  itemDescription: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "16px",
    lineHeight: "1.5",
  },
  itemDetails: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "16px",
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    color: "#4b5563",
  },
  detailIcon: {
    color: "#9ca3af",
  },
  detailText: {
    fontWeight: "500",
  },
  priorityBadge: {
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "500",
  },
  linksSection: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  linksTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  linksList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  linkItem: {
    display: "flex",
    alignItems: "center",
    padding: "4px 8px",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#3b82f6",
    textDecoration: "none",
    transition: "background-color 0.2s",
  },
  itemActions: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  actionButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "white",
  },
  toggleButton: {
    flex: 1.5,
  },
  editButton: {
    backgroundColor: "#3b82f6",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
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

export default BucketList;