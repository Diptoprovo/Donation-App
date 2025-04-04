import { useState } from 'react';
import { useApp } from '../context/AppContext';

const ItemCard = ({ item = {} }) => {
  if (!item || typeof item !== 'object') {
    return <div className="bg-white rounded-lg shadow-md p-4">Invalid item data</div>;
  }

  const { createRequest, user, initiateTranRecv } = useApp();
  const [isRequesting, setIsRequesting] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? item.image.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === item.image.length - 1 ? 0 : prev + 1));
  };

  const handleRequestItem = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsRequesting(true);
      await initiateTranRecv({
        itemId: item._id,
        donorId: item.donorId._id
      });
      setShowModal(false);
      setMessage('');
      // Display success message
    } catch (error) {
      console.error('Error requesting item:', error);
      // Display error message
    } finally {
      setIsRequesting(false);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      return '';
    }
  };

  // Check if user is a donor (can't request their own items)
  const isDonor = user && user._id === item.donorId;
  // Check if the user is a receiver (can request items)
  const isReceiver = user && user.type === 'receiver';
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Item Image Carousel */}
      <div className="relative h-48 bg-gray-200">
        {item.image && Array.isArray(item.image) && item.image.length > 0 ? (
          <img
            src={item.image[currentIndex]}
            alt={item.name || 'Item image'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
            No Image Available
          </div>
        )}


        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent  p-2 rounded-full hover:bg-opacity-90"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent  p-2 rounded-full hover:bg-opacity-90"
        >
          ▶
        </button>

        <div className="absolute top-0 right-0 m-2">
          <span className={`text-xs px-2 py-1 rounded ${item.condition === 'new' ? 'bg-green-500' :
            item.condition === 'fairly used' ? 'bg-yellow-500' :
              'bg-red-500'
            } text-white`}>
            {item.condition || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Item Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{item.name || 'Unnamed Item'}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {item.category || 'Uncategorized'}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          <span className="font-medium">Location:</span> {item.location || 'Not specified'}
        </p>

        {item.createdAt && (
          <p className="text-xs text-gray-500 mt-1">
            Posted on {formatDate(item.createdAt)}
          </p>
        )}

        {/* Action Button */}
        <div className="mt-4">
          {isReceiver && !isDonor && item.isAvailable ? (
            <button
              onClick={toggleModal}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              disabled={isRequesting}
            >
              {isRequesting ? 'Requesting...' : 'Request Item'}
            </button>
          ) : isDonor ? (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded"
            >
              Your Item
            </button>
          ) : !item.isAvailable ? (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded"
            >
              Not Available
            </button>
          ) : (
            <button
              onClick={() => window.location.href = '/signin'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Request
            </button>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Request Item: {item.name}</h3>

            <form onSubmit={handleRequestItem}>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message to Donor
                </label>
                <textarea
                  id="message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Explain why you need this item..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={isRequesting}
                >
                  {isRequesting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
