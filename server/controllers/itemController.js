import Item from '../models/itemModel.js';
import Donor from '../models/donorModel.js';
import Request from '../models/requestModel.js';
import Receiver from '../models/receiverModel.js';
import { notifyItemMatch } from '../utils/notificationUtils.js';

// Create a new donation item
export const createItem = async (req, res) => {
    try {
        const { name, condition, category, location } = req.body;
        const donorId = req.userId;
        
        // Handle image uploads - expects req.files from multer middleware
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
        }
        
        // Create new item
        const item = await Item.create({
            name,
            condition,
            category,
            location,
            image: imageUrls,
            donorId
        });
        
        // Add item to donor's donation list
        await Donor.findByIdAndUpdate(
            donorId,
            { $push: { donationList: item._id } }
        );
        
        // Find matching requests based on category and location
        const matchingRequests = await Request.find({
            category: category,
            location: location
        }).populate('receiverId');
        
        // Send notifications to matching receivers
        for (const request of matchingRequests) {
            await notifyItemMatch(
                req,
                request.receiverId._id,
                item.name,
                item.category
            );
        }
        
        res.status(201).json({
            success: true,
            message: 'Item added successfully',
            item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add item',
            error: error.message
        });
    }
};

// Get all donation items
export const getAllItems = async (req, res) => {
    try {
        // Parse query parameters
        const { category, condition, location } = req.query;
        const filter = {};
        
        // Apply filters if provided
        if (category) filter.category = category;
        if (condition) filter.condition = condition;
        if (location) filter.location = location;
        
        // Get all items with applied filters
        const items = await Item.find(filter).populate('donorId', 'name email');
        
        res.status(200).json({
            success: true,
            count: items.length,
            items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get items',
            error: error.message
        });
    }
};

// Get a single item by ID
export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.id;
        
        // Find item by ID and populate donor information
        const item = await Item.findById(itemId).populate('donorId', 'name email phone');
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        res.status(200).json({
            success: true,
            item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get item',
            error: error.message
        });
    }
};

// Get current donor's items
export const getDonorItems = async (req, res) => {
    try {
        const donorId = req.userId;
        
        // Find all items by donor ID
        const items = await Item.find({ donorId });
        
        res.status(200).json({
            success: true,
            count: items.length,
            items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get donor items',
            error: error.message
        });
    }
};

// Update an item
export const updateItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const { name, condition, category, location } = req.body;
        const donorId = req.userId;
        
        // Find item
        const item = await Item.findById(itemId);
        
        // Check if item exists
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        // Check if donor owns the item
        if (item.donorId.toString() !== donorId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not the owner of the item'
            });
        }
        
        // Handle image uploads - expects req.files from multer middleware
        let imageUrls = [...item.image]; // Keep existing images
        if (req.files && req.files.length > 0) {
            const newImageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
            imageUrls = [...imageUrls, ...newImageUrls];
        }
        
        // Update item
        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            {
                name,
                condition,
                category,
                location,
                image: imageUrls
            },
            { new: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            item: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update item',
            error: error.message
        });
    }
};

// Delete an item
export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const donorId = req.userId;
        
        // Find item
        const item = await Item.findById(itemId);
        
        // Check if item exists
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        // Check if donor owns the item
        if (item.donorId.toString() !== donorId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not the owner of the item'
            });
        }
        
        // Delete item
        await Item.findByIdAndDelete(itemId);
        
        // Remove item from donor's donation list
        await Donor.findByIdAndUpdate(
            donorId,
            { $pull: { donationList: itemId } }
        );
        
        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete item',
            error: error.message
        });
    }
};

// Get items matching receiver's requests
export const getMatchingItems = async (req, res) => {
    try {
        const receiverId = req.userId;
        
        // Get receiver's requests
        const receiver = await Receiver.findById(receiverId).populate('requestList');
        
        if (!receiver.requestList || receiver.requestList.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No requests found to match',
                items: []
            });
        }
        
        // Extract categories and locations from requests
        const requestFilters = receiver.requestList.map(request => ({
            category: request.category,
            location: request.location
        }));
        
        // Find items matching any request criteria
        const matchingItems = await Item.find({
            $or: requestFilters
        }).populate('donorId', 'name email');
        
        res.status(200).json({
            success: true,
            count: matchingItems.length,
            items: matchingItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get matching items',
            error: error.message
        });
    }
};

export default {
    createItem,
    getAllItems,
    getItemById,
    getDonorItems,
    updateItem,
    deleteItem,
    getMatchingItems
}; 