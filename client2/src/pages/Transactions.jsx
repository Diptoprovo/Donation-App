import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TransactionCard from '../components/TransactionCard';

const Transactions = () => {
  const { getTransactions, user } = useApp();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Define filter options
  const filters = [
    { id: 'all', name: 'All Transactions' },
    { id: 'pending', name: 'Pending' },
    { id: 'approved', name: 'Approved' },
    { id: 'completed', name: 'Completed' },
    { id: 'rejected', name: 'Rejected' }
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactions();
        console.log(data)
        setTransactions(data);
      } catch (err) {
        setError('Failed to load transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on active filter
  const filteredTransactions = activeFilter === 'all'
    ? transactions
    : transactions.filter(t => t.status === activeFilter);

  return (
    <div>
      <div className="bg-white p-6 mb-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">
          {user?.role === 'donor' ? 'Donation Requests' : 'My Requests'}
        </h1>
        <p className="text-gray-600">
          {user?.role === 'donor'
            ? 'Manage requests for your donated items'
            : 'Track your requests for items'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <div className="flex overflow-x-auto p-1">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 mx-1 rounded-md transition-colors ${activeFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>

          <h2 className="text-xl font-semibold mt-4 mb-2">No transactions found</h2>

          <p className="text-gray-600 mb-6">
            {activeFilter !== 'all'
              ? `You don't have any ${activeFilter} transactions.`
              : user?.role === 'donor'
                ? "You don't have any requests for your items yet."
                : "You haven't requested any items yet."}
          </p>

          <div>
            {user?.role === 'donor' ? (
              <Link
                to="/upload"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                Donate an Item
              </Link>
            ) : (
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                Browse Available Items
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map(transaction => (
            <TransactionCard key={transaction._id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Transactions;
