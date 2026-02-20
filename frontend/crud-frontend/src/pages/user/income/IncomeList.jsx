// pages/user/income/IncomeList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Filter, ArrowLeft } from 'lucide-react';
import api from '../../../api';

function IncomeList() {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIncomes();
  }, [filterMonth, filterYear]);

  const fetchIncomes = async () => {
  try {
    setLoading(true);
    setError('');
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
    setError(error.response?.data?.message || 'Failed to fetch incomes');
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
          <h1 className="text-2xl font-bold text-gray-800">Income Management</h1>
          <p className="text-gray-600">Track and manage your income sources</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <p className="text-sm opacity-90">Total Income for {filterMonth}/{filterYear}</p>
        <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
      </div>

      {/* Filters and Add Button */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(parseInt(e.target.value))}
              className="border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[2023, 2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <Link
            to="/user/income/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Add Income
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Income List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading incomes...</p>
          </div>
        ) : incomes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No income entries for this period.</p>
            <Link
              to="/user/income/add"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Add your first income →
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recurring</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {incomes.map((income) => (
                <tr key={income.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{formatDate(income.date)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {income.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{income.description || '-'}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    {formatCurrency(income.amount)}
                  </td>
                  <td className="px-6 py-4">
                    {income.isRecurring ? (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Monthly
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/user/income/edit/${income.id}`)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(income.id)}
                      className="text-red-600 hover:text-red-800"
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

export default IncomeList;