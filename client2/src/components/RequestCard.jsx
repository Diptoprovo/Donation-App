import React from 'react'
import { useState } from 'react';
import { useApp } from '../context/AppContext';

const RequestCard = ({ item = {} }) => {
    console.log(item)
    const { user } = useApp();
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? item.image.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === item.image.length - 1 ? 0 : prev + 1));
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
            {/* <div className="relative h-48 bg-gray-200">
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
        </div> */}

            {/* Item Info */}
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">{item.message || 'Unnamed Item'}</h3>
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

                {/* Action Button
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
                </div> */}
            </div>


        </div >
    )
}

export default RequestCard
