import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Filter, ArrowLeft } from 'lucide-react';
import api from '../../../api';

function ExpenseList() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, [filterMonth, filterYear]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
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
      setError(error.response?.data?.message || 'Failed to fetch expenses');
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
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Rent/Housing': 'bg-purple-100 text-purple-800',
      'Travel': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-indigo-100 text-indigo-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Education': 'bg-green-100 text-green-800',
      'Others': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/user/home')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>
          <p className="text-gray-600">Track and manage your expenses</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <p className="text-sm opacity-90">Total Expenses for {filterMonth}/{filterYear}</p>
        <p className="text-3xl font-bold">{formatCurrency(totalExpense)}</p>
      </div>

      {/* Filters and Add Button */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(parseInt(e.target.value))}
              className="border rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
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
              className="border rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
            >
              {[2023, 2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <Link
            to="/user/expenses/add"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Add Expense
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Expense List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-500">Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No expense entries for this period.</p>
            <Link
              to="/user/expenses/add"
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Add your first expense →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{formatDate(expense.date)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{expense.description || '-'}</td>
                  <td className="px-6 py-4 font-semibold text-red-600">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/user/expenses/edit/${expense.id}`)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
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
  );
}

export default ExpenseList;