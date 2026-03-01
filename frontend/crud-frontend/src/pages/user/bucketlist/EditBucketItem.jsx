// pages/user/bucketlist/EditBucketItem.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Trash2 } from 'lucide-react';
import api from '../../../api';
import UserSidebar from '../UserSidebar';
import UserHeader from '../UserHeader';
import UserFooter from '../UserFooter';

function EditBucketItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    estimated_cost: '',
    priority: 'medium',
    target_date: '',
    category: 'other',
    purchased: false,
    productLinks: []
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bucketlist');
  const [currentLink, setCurrentLink] = useState({ platform: 'amazon', url: '' });

  const categories = [
    { value: 'travel', label: '✈️ Travel' },
    { value: 'shopping', label: '🛍️ Shopping' },
    { value: 'electronics', label: '📱 Electronics' },
    { value: 'vehicle', label: '🚗 Vehicle' },
    { value: 'home', label: '🏠 Home' },
    { value: 'experience', label: '🎉 Experience' },
    { value: 'other', label: '🎯 Other' }
  ];

  const priorities = [
    { value: 'high', label: '🔴 High Priority' },
    { value: 'medium', label: '🟡 Medium Priority' },
    { value: 'low', label: '🟢 Low Priority' }
  ];

  const platforms = [
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchBucketItem();
  }, [id]);

  const fetchBucketItem = async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      if (!token || !userStr) {
        navigate('/signin');
        return;
      }

      const response = await api.get(`/bucketlist/${id}`);
      const item = response.data;
      
      setFormData({
        item_name: item.item_name || '',
        description: item.description || '',
        estimated_cost: item.estimated_cost || '',
        priority: item.priority || 'medium',
        target_date: item.target_date ? item.target_date.split('T')[0] : '',
        category: item.category || 'other',
        purchased: item.purchased || false,
        productLinks: item.productLinks || []
      });
    } catch (error) {
      console.error('Error fetching bucket item:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/signin');
      } else {
        setError('Failed to load item');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        estimated_cost: parseFloat(formData.estimated_cost) || 0,
        productLinks: formData.productLinks.filter(link => link.url.trim() !== '')
      };

      await api.put(`/bucketlist/${id}`, submitData);
      navigate('/user/bucketlist');
    } catch (error) {
      console.error('Error updating bucket item:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/signin');
      } else {
        setError(error.response?.data?.message || 'Failed to update item');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await api.delete(`/bucketlist/${id}`);
        navigate('/user/bucketlist');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addProductLink = () => {
    if (currentLink.url.trim()) {
      setFormData(prev => ({
        ...prev,
        productLinks: [
          ...prev.productLinks,
          { 
            platform: currentLink.platform, 
            url: currentLink.url 
          }
        ]
      }));
      setCurrentLink({ platform: 'amazon', url: '' });
    }
  };

  const removeProductLink = (index) => {
    setFormData(prev => ({
      ...prev,
      productLinks: prev.productLinks.filter((_, i) => i !== index)
    }));
  };

  if (fetchLoading) {
    return (
      <div style={styles.container}>
        <UserHeader />
        <div style={styles.mainContent}>
          <UserSidebar activeTab={activeTab} onTabChange={handleTabChange} />
          <main style={styles.main}>
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading dream details...</p>
            </div>
          </main>
        </div>
        <UserFooter />
      </div>
    );
  }

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
                onClick={() => navigate('/user/bucketlist')}
                style={styles.backButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 style={styles.pageTitle}>Edit Dream</h1>
                <p style={styles.pageSubtitle}>Update your goal details</p>
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
                {/* Purchased Status */}
                <div style={styles.checkboxGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="purchased"
                      checked={formData.purchased}
                      onChange={handleChange}
                      style={styles.checkbox}
                    />
                    <span style={styles.checkboxText}>
                      ✓ I have achieved this goal / purchased this item
                    </span>
                  </label>
                </div>

                {/* Item Name */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Dream/Goal Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                {/* Description */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={styles.textarea}
                    rows="3"
                  />
                </div>

                {/* Two Column Layout */}
                <div style={styles.row}>
                  {/* Estimated Cost */}
                  <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label}>
                      Estimated Cost <span style={styles.required}>*</span>
                    </label>
                    <div style={styles.inputWrapper}>
                      <span style={styles.currencySymbol}>₹</span>
                      <input
                        type="number"
                        name="estimated_cost"
                        value={formData.estimated_cost}
                        onChange={handleChange}
                        style={styles.amountInput}
                        min="0"
                        step="1000"
                        required
                      />
                    </div>
                  </div>

                  {/* Priority */}
                  <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label}>Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      style={styles.select}
                    >
                      {priorities.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div style={styles.row}>
                  {/* Target Date */}
                  <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label}>Target Date</label>
                    <input
                      type="date"
                      name="target_date"
                      value={formData.target_date}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>

                  {/* Category */}
                  <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label}>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={styles.select}
                    >
                      {categories.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Product Links Section */}
                <div style={styles.linksSection}>
                  <label style={styles.label}>Product Links</label>
                  <p style={styles.helperText}>
                    Add or remove product links
                  </p>

                  {/* Current Link Input */}
                  <div style={styles.linkInputRow}>
                    <select
                      value={currentLink.platform}
                      onChange={(e) => setCurrentLink({...currentLink, platform: e.target.value})}
                      style={{...styles.select, width: '120px'}}
                    >
                      {platforms.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={currentLink.url}
                      onChange={(e) => setCurrentLink({...currentLink, url: e.target.value})}
                      style={{...styles.input, flex: 1}}
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={addProductLink}
                      style={styles.addLinkButton}
                      disabled={!currentLink.url.trim()}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {/* Added Links List */}
                  {formData.productLinks.length > 0 && (
                    <div style={styles.linksList}>
                      {formData.productLinks.map((link, index) => (
                        <div key={index} style={styles.linkItem}>
                          <span style={styles.linkPlatform}>
                            {link.platform === 'amazon' ? '🛒' : link.platform === 'flipkart' ? '📦' : '🔗'} 
                            {link.platform}
                          </span>
                          <span style={styles.linkUrl}>{link.url}</span>
                          <button
                            type="button"
                            onClick={() => removeProductLink(index)}
                            style={styles.removeLinkButton}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div style={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => navigate('/user/bucketlist')}
                    style={styles.cancelButton}
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
                  >
                    <Save size={18} style={styles.submitIcon} />
                    {loading ? 'Updating...' : 'Update Dream'}
                  </button>
                </div>
              </form>
            </div>

            {/* Delete Section */}
            <div style={styles.deleteSection}>
              <h3 style={styles.deleteTitle}>Danger Zone</h3>
              <p style={styles.deleteText}>
                Once you delete this dream, it cannot be recovered.
              </p>
              <button
                onClick={handleDelete}
                style={styles.deleteButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                <Trash2 size={16} style={{ marginRight: '8px' }} />
                Delete Dream
              </button>
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
    borderTopColor: "#10b981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: "14px",
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
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  row: {
    display: "flex",
    gap: "20px",
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
  select: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "white",
    cursor: "pointer",
  },
  checkboxGroup: {
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    marginBottom: "8px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#10b981",
  },
  checkboxText: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  linksSection: {
    marginTop: "8px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  helperText: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  linkInputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  },
  addLinkButton: {
    padding: "10px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  linksList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  linkItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
  },
  linkPlatform: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#4b5563",
    minWidth: "80px",
  },
  linkUrl: {
    flex: 1,
    fontSize: "12px",
    color: "#3b82f6",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  removeLinkButton: {
    padding: "4px",
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#10b981",
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
  deleteSection: {
    backgroundColor: "#fee2e2",
    border: "1px solid #ef4444",
    borderRadius: "8px",
    padding: "20px",
  },
  deleteTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#b91c1c",
    marginBottom: "8px",
  },
  deleteText: {
    fontSize: "14px",
    color: "#b91c1c",
    marginBottom: "16px",
    opacity: 0.9,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    display: "inline-flex",
    alignItems: "center",
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  input:focus, select:focus, textarea:focus {
    border-color: #10b981 !important;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default EditBucketItem;