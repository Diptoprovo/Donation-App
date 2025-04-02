import mongoose from 'mongoose';
import { createNotification } from '../utils/notificationUtils.js';

// Create a notification schema for storing notifications
const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userModel'
    },
    userModel: {
        type: String,
        required: true,
        enum: ['Donor', 'Receiver']
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['donation_request', 'request_accepted', 'donation_delivered', 'item_match', 'request_rejected'],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Notification model if it doesn't already exist
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

// Create a new notification
export const createNewNotification = async (req, res) => {
    try {
        const { userId, userModel, title, message, type } = req.body;
        
        // Create notification in database
        const notification = await Notification.create({
            userId,
            userModel,
            title,
            message,
            type
        });
        
        // Send real-time notification
        await createNotification(req, userId, title, message, type);
        
        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create notification',
            error: error.message
        });
    }
};

// Get user's notifications
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const userType = req.userType;
        const userModel = userType === 'donor' ? 'Donor' : 'Receiver';
        
        // Get limit and page from query parameters
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        
        // Find all notifications for user, sorted by date (newest first)
        const notifications = await Notification.find({ 
            userId, 
            userModel 
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        // Count total notifications
        const total = await Notification.countDocuments({ userId, userModel });
        
        // Count unread notifications
        const unreadCount = await Notification.countDocuments({ 
            userId, 
            userModel,
            isRead: false
        });
        
        res.status(200).json({
            success: true,
            count: notifications.length,
            total,
            unreadCount,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get notifications',
            error: error.message
        });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.userId;
        
        // Find notification
        const notification = await Notification.findById(notificationId);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        // Check if user owns the notification
        if (notification.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not the owner of the notification'
            });
        }
        
        // Update notification
        notification.isRead = true;
        await notification.save();
        
        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read',
            error: error.message
        });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        const userType = req.userType;
        const userModel = userType === 'donor' ? 'Donor' : 'Receiver';
        
        // Update all unread notifications
        const result = await Notification.updateMany(
            { userId, userModel, isRead: false },
            { isRead: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            count: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to mark all notifications as read',
            error: error.message
        });
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.userId;
        
        // Find notification
        const notification = await Notification.findById(notificationId);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        // Check if user owns the notification
        if (notification.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not the owner of the notification'
            });
        }
        
        // Delete notification
        await Notification.findByIdAndDelete(notificationId);
        
        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification',
            error: error.message
        });
    }
};

export default {
    createNewNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
}; 