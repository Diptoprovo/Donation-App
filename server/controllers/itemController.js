import Item from '../models/itemModel.js';
import Donor from '../models/donorModel.js';
import Request from '../models/requestModel.js';
import Receiver from '../models/receiverModel.js';
import { cloudinary } from '../config/cloudinaryConfig.js';
import { notifyItemMatch, notifyNewItemForRequest } from '../utils/notificationUtils.js';

// Create a new donation item [puts in both itemlist and donationlist of donor] [notifying the receivers]
export const createItem = async (req, res) => {
    try {
        const { name, condition, category, location, x, y } = req.body;
        const donorId = req.userId;

        // Handle image uploads - expects req.files from multer middleware
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'donation-app/items'
                });
                imageUrls.push(result.secure_url);
            }
        }

        // Create new item
        const item = await Item.create({
            name,
            condition,
            category,
            location,
            image: imageUrls,
            donorId,
            x,
            y,
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

        let hasMatchingRequests = false;

        // If matching requests found, send notifications to receivers
        if (matchingRequests.length > 0) {
            hasMatchingRequests = true;

            // Get donor details
            const donor = await Donor.findById(donorId);

            // Send notifications to matching receivers
            for (const request of matchingRequests) {
                // Notify the receiver that a matching item is available
                await notifyItemMatch(
                    req,
                    request.receiverId._id,
                    item.name,
                    item.category
                );
            }
        }

        res.status(201).json({
            success: true,
            message: hasMatchingRequests
                ? 'Item added successfully and matching requests found'
                : 'Item added successfully',
            item,
            matchingRequests: {
                count: matchingRequests.length,
                requests: matchingRequests
            },
            hasMatchingRequests
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
        // Get all items with available filter
        const items = await Item.find({ isAvailable: true }).populate('donorId', 'name email');

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
        const { itemId } = req.body;

        // Find item by ID and populate donor information
        const item = await Item.findById(itemId).populate('donorId', 'name email phone');

        if (!item || item.isAvailable === false) {
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

// Update an item [not updating the item at donor's donation list]
export const updateItem = async (req, res) => {
    try {
        const { itemId } = req.body;
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

        let imageUrls = [...item.image];
        if (req.files && req.files.length > 0) {
            imageUrls = [
                ...imageUrls,
                ...req.files.map(file => file.path)
            ];
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

// Delete an item [deletes the item from itemlist and donor's donation list]
export const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.body;
        const donorId = req.userId;

        const item = await Item.findById(itemId);
        if (!item || item.isAvailable === false) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        if (item.donorId.toString() !== donorId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not the owner of the item'
            });
        }
        //logical deletion no waaaaay
        await Item.findByIdAndUpdate(itemId, { isAvailable: false });
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

// Get all available items in the basis of category and location.. use this to apply filter.
export const getAvailableItems = async (req, res) => {
    try {
        // Optional filtering parameters
        const { category, location } = req.body;
        // Apply filters if provided
        if (category) filter.category = category;
        if (location) filter.location = location;
        filter.isAvailable = true;

        const items = await Item.find(filter).populate('donorId', 'name').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get available items',
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
    getAvailableItems
}; 