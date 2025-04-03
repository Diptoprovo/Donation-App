// Create a new notification
export const createNotification = async (req, userId, title, message, type) => {
    try {
        // Get socket.io instance
        const io = req.app.get('socketio');

        // Emit notification to specific user
        io.to(userId.toString()).emit('notification', {
            title,
            message,
            type,
            createdAt: new Date()
        });

        return true;
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
};

// Send notification for new donation request
export const notifyDonationRequest = async (req, receiverName) => {
    const title = 'New Donation Request';
    const message = `${receiverName} has requested donation: ${req.body.category}`;
    const type = 'donation_request';

    return await createNotification(req, req.userId, title, message, type);
};

export const notifyInitiationTransaction = async (req, donorId, receiverName) => {
    const title = 'Listed product requested';
    const message = `${receiverName} has requested donation: ${req.body.category}`;
    const type = 'donation_request';

    return await createNotification(req, donorId, title, message, type);
}

// Send notification for request acceptance
export const notifyRequestAccepted = async (req, receiverId, itemName, donorName) => {
    const title = 'Request Accepted';
    const message = `${donorName} has accepted your request for: ${itemName}`;
    const type = 'request_accepted';

    return await createNotification(req, receiverId, title, message, type);
};

// Send notification for donation delivery
export const notifyDonationDelivery = async (req, receiverId, itemName) => {
    const title = 'Donation Delivered';
    const message = `Your requested item: ${itemName} has been marked as delivered`;
    const type = 'donation_delivered';

    return await createNotification(req, receiverId, title, message, type);
};

// Send notification for item match
export const notifyItemMatch = async (req, receiverId, itemName, category) => {
    const title = 'Item Match Found';
    const message = `A new ${category} item "${itemName}" matching your request is available`;
    const type = 'item_match';

    return await createNotification(req, receiverId, title, message, type);
};

// Send notification for new item matching request
export const notifyNewItemForRequest = async (req, receiverId, itemName, donorName) => {
    const title = 'New Item Available for Your Request';
    const message = `${donorName} has added a new item "${itemName}" that matches your request`;
    const type = 'item_match';

    return await createNotification(req, receiverId, title, message, type);
};

export default {
    createNotification,
    notifyDonationRequest,
    notifyRequestAccepted,
    notifyDonationDelivery,
    notifyItemMatch,
    notifyNewItemForRequest
}; 