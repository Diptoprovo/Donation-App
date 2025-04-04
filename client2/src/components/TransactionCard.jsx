import { useState } from 'react';
import { useApp } from '../context/AppContext';

const TransactionCard = ({ transaction }) => {
  const { user, api } = useApp();
  const [status, setStatus] = useState(transaction.status);
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if the current user is the donor of this transaction
  const isDonor = user && user._id === transaction.item.donorId;
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Handle transaction status update
  const updateTransactionStatus = async (newStatus) => {
    try {
      setIsUpdating(true);
      const response = await api.put(`/transaction/${transaction._id}`, {
        status: newStatus
      });
      
      setStatus(response.data.status);
    } catch (error) {
      console.error('Error updating transaction:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{transaction.item.name}</h3>
            <p className="text-sm text-gray-600">
              {isDonor ? 'Requested by: ' : 'Donated by: '}
              <span className="font-medium">
                {isDonor ? transaction.receiverName : transaction.donorName}
              </span>
            </p>
          </div>
          
          <span className={`${getStatusBadgeColor(status)} text-xs px-2 py-1 rounded`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-3">
            {transaction.item.image && transaction.item.image.length > 0 ? (
              <img 
                src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000'}/${transaction.item.image[0]}`}
                alt={transaction.item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                No Image
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Category:</span> {transaction.item.category}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Condition:</span> {transaction.item.condition}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Location:</span> {transaction.item.location}
            </p>
          </div>
        </div>
        
        {transaction.message && (
          <div className="mb-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
            <span className="font-medium">Message:</span> {transaction.message}
          </div>
        )}
        
        <p className="text-xs text-gray-500 mb-3">
          Requested on: {formatDate(transaction.createdAt)}
        </p>
        
        {/* Action buttons for donor */}
        {isDonor && status === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={() => updateTransactionStatus('accepted')}
              disabled={isUpdating}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              {isUpdating ? 'Updating...' : 'Accept'}
            </button>
            <button
              onClick={() => updateTransactionStatus('rejected')}
              disabled={isUpdating}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              {isUpdating ? 'Updating...' : 'Reject'}
            </button>
          </div>
        )}
        
        {/* Mark as completed button (for donor when accepted) */}
        {isDonor && status === 'accepted' && (
          <button
            onClick={() => updateTransactionStatus('completed')}
            disabled={isUpdating}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            {isUpdating ? 'Updating...' : 'Mark as Completed'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
