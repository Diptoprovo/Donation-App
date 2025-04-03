import Request from '../models/requestModel.js';
import Receiver from '../models/receiverModel.js';
import Item from '../models/itemModel.js';
import { notifyItemMatch } from '../utils/notificationUtils.js';
import { notifyDonationRequest } from '../utils/notificationUtils.js';
import { sendDonationMatchEmail } from '../utils/emailUtils.js';

// Create a new request (general request without specific item) [not notifying the donors]
export const createRequest = async (req, res) => {
    try {
        const { message, category, location } = req.body;
        const receiverId = req.userId;

        //check if similar request exists
        const existingRequest = await Request.findOne({
            category: category,
            location: location,
            receiverId: receiverId
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You have already requested for this category'
            });
        }


        // Create new request (general request without specific item)
        const request = await Request.create({
            message,
            category,
            location,
            receiverId
        });

        // Add request to receiver's request list
        await Receiver.findByIdAndUpdate(
            receiverId,
            { $push: { requestList: request._id } }
        );

        // No matching items found
        res.status(201).json({
            success: true,
            message: 'General request created successfully',
            request,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create request',
            error: error.message
        });
    }
};

// Get all requests (admin feature) [it should be visible to all donors]
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find().populate('receiverId', 'message category');
        const donorId = req.userId;
        if (!donorId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not a donor'
            });
        }
        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get requests',
            error: error.message
        });
    }
};

// Get current receiver's requests
export const getReceiverRequests = async (req, res) => {
    try {
        const receiverId = req.userId;

        // Find all requests by receiver ID
        const requests = await Request.find({ receiverId });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get receiver requests',
            error: error.message
        });
    }
};

// Get request by ID
export const getRequestById = async (req, res) => {
    try {
        const { requestId } = req.body;
        const receiverId = req.userId;
        // Find request by ID
        const request = await Request.findOne({ receiverId: receiverId, requestId: requestId }).populate('receiverId', 'message category');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }
        res.status(200).json({
            success: true,
            request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get request',
            error: error.message
        });
    }
};

// Update a request
export const updateRequest = async (req, res) => {
    try {
        const { message, category, location, requestId } = req.body;
        const receiverId = req.userId;

        // Find request
        const request = await Request.findById(requestId);

        // Check if request exists
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Check if receiver owns the request
        if (request.receiverId.toString() !== receiverId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not the owner of the request'
            });
        }

        // Update request
        const updatedRequest = await Request.findByIdAndUpdate(
            requestId,
            {
                message,
                category,
                location
            },
            { new: true }
        );

        // Find matching items based on updated category and location
        res.status(200).json({
            success: true,
            message: 'Request updated successfully',
            request: updatedRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update request',
            error: error.message
        });
    }
};

// Delete a request
export const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const receiverId = req.userId;

        // Find request
        const request = await Request.findById(requestId);

        // Check if request exists
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Check if receiver owns the request
        if (request.receiverId.toString() !== receiverId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not the owner of the request'
            });
        }

        // Delete request
        await Request.findByIdAndDelete(requestId);

        // Remove request from receiver's request list
        await Receiver.findByIdAndUpdate(
            receiverId,
            { $pull: { requestList: requestId } }
        );

        res.status(200).json({
            success: true,
            message: 'Request deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete request',
            error: error.message
        });
    }
};


export default {
    createRequest,
    getAllRequests,
    getReceiverRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
};
