import Request from '../models/requestModel.js';
import Receiver from '../models/receiverModel.js';
import Item from '../models/itemModel.js';
import { notifyItemMatch } from '../utils/notificationUtils.js';
import { notifyDonationRequest } from '../utils/notificationUtils.js';
import { sendDonationMatchEmail } from '../utils/emailUtils.js';

// Create a new request (general request without specific item)
export const createRequest = async (req, res) => {
    try {
        const { name, category, location } = req.body;
        const receiverId = req.userId;

        // Create new request (general request without specific item)
        const request = await Request.create({
            name,
            category,
            location,
            receiverId,
            status: 'pending'
        });

        // Add request to receiver's request list
        await Receiver.findByIdAndUpdate(
            receiverId,
            { $push: { requestList: request._id } }
        );

        // Find matching items based on category and location
        const matchingItems = await Item.find({
            category: category,
            location: location
        }).populate('donorId', 'name email');

        // Notify matching donors if items are found
        if (matchingItems.length > 0) {
            // Get receiver details for notification
            const receiver = await Receiver.findById(receiverId);

            // Return matched items with the response
            return res.status(201).json({
                success: true,
                message: 'General request created successfully and matching items found',
                request,
                matchingItems: {
                    count: matchingItems.length,
                    items: matchingItems
                }
            });
        }

        // No matching items found
        res.status(201).json({
            success: true,
            message: 'General request created successfully but no matching items found',
            request,
            matchingItems: {
                count: 0,
                items: []
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create request',
            error: error.message
        });
    }
};

// Get all requests (admin feature)
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find().populate('receiverId', 'name email');

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

        // Find request by ID
        const request = await Request.findById(requestId).populate('receiverId', 'name email phone');

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
        const { requestId } = req.body;
        const { name, category, location } = req.body;
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
                name,
                category,
                location
            },
            { new: true }
        );

        // Find matching items based on updated category and location
        const matchingItems = await Item.find({
            category: category,
            location: location
        }).populate('donorId', 'name email');

        res.status(200).json({
            success: true,
            message: 'Request updated successfully',
            request: updatedRequest,
            matchingItems: {
                count: matchingItems.length,
                items: matchingItems
            }
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
