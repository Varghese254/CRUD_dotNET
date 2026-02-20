// pages/user/income/AddIncome.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api';

function AddIncome() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Salary',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Others'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ FIXED: Changed from '/user/income' to '/income'
      await api.post('/income', formData);
      navigate('/user/income');
    } catch (error) {
      console.error('Error adding income:', error);
      setError(error.response?.data?.message || 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/user/income')}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Income List
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Income</h1>

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
              className="w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="e.g., Monthly salary, Freelance project payment..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="recurring" className="ml-2 text-sm text-gray-700">
              This is recurring income (monthly)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Income'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddIncome;