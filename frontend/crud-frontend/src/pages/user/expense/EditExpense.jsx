import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api';

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    'Food & Dining', 'Rent/Housing', 'Travel', 'Shopping', 
    'Entertainment', 'Healthcare', 'Utilities', 'Education', 'Others'
  ];

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const fetchExpense = async () => {
    try {
      const response = await api.get(`/expense/${id}`);
      const expense = response.data;
      setFormData({
        amount: expense.amount,
        category: expense.category,
        date: expense.date.split('T')[0],
        description: expense.description || ''
      });
    } catch (error) {
      console.error('Error fetching expense:', error);
      setError('Failed to load expense');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/expense/${id}`, formData);
      navigate('/user/expenses');
    } catch (error) {
      console.error('Error updating expense:', error);
      setError(error.response?.data?.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <p className="mt-2 text-gray-500">Loading expense...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/user/expenses')}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Expenses List
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Expense</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
              rows="3"
              placeholder="e.g., Grocery shopping, Restaurant bill..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Expense'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditExpense;