// pages/user/bucketlist/AddBucketItem.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import api from '../../../api';
import UserSidebar from '../UserSidebar';
import UserHeader from '../UserHeader';
import UserFooter from '../UserFooter';

function AddBucketItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    estimated_cost: '',
    priority: 'medium',
    target_date: '',
    category: 'other',
    productLinks: [] // Array for multiple product links
  });
  const [loading, setLoading] = useState(false);
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

      // Prepare data with product links
      const submitData = {
        ...formData,
        estimated_cost: parseFloat(formData.estimated_cost) || 0,
        productLinks: formData.productLinks.filter(link => link.url.trim() !== '')
      };

      await api.post('/bucketlist', submitData);
      navigate('/user/bucketlist');
    } catch (error) {
      console.error('Error adding bucket item:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/signin');
      } else {
        setError(error.response?.data?.message || 'Failed to add item');
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
                <h1 style={styles.pageTitle}>Add New Dream</h1>
                <p style={styles.pageSubtitle}>Add your next goal to achieve</p>
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
                    placeholder="e.g., Buy a car, Trip to Goa, New Laptop..."
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
                    placeholder="Add more details about your dream..."
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
                        placeholder="0"
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
                      min={new Date().toISOString().split('T')[0]}
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
                  <label style={styles.label}>Product Links (Optional)</label>
                  <p style={styles.helperText}>
                    Add links from Amazon, Flipkart, or other sites
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
                    {loading ? 'Adding...' : 'Add to Bucket List'}
                  </button>
                </div>
              </form>
            </div>

            {/* Inspiration Card */}
            <div style={styles.inspirationCard}>
              <h3 style={styles.inspirationTitle}>✨ Dream Big!</h3>
              <p style={styles.inspirationText}>
                Every achievement starts with a dream. Write down your goals, 
                add product links to track them, and work towards making them reality!
              </p>
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
  inspirationCard: {
    backgroundColor: "#fef3c7",
    border: "1px solid #f59e0b",
    borderRadius: "8px",
    padding: "16px",
  },
  inspirationTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#92400e",
    marginBottom: "8px",
  },
  inspirationText: {
    fontSize: "14px",
    color: "#92400e",
    lineHeight: "1.5",
  },
};

// Add focus styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  input:focus, select:focus, textarea:focus {
    border-color: #10b981 !important;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default AddBucketItem;