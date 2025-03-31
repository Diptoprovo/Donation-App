import Transaction from '../models/transactionModel.js';
import Item from '../models/itemModel.js';
import Donor from '../models/donorModel.js';
import Receiver from '../models/receiverModel.js';
import { notifyDonationRequest, notifyRequestAccepted, notifyDonationDelivery } from '../utils/notificationUtils.js';
import { sendDonationMatchEmail, sendRequestAcceptedEmail } from '../utils/emailUtils.js';

// Request an item (receiver initiates a transaction)
export const requestItem = async (req, res) => {
    try {
        const { itemId } = req.body;
        const receiverId = req.userId;
        
        // Get the item details
        const item = await Item.findById(itemId).populate('donorId');
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        // Check if transaction already exists
        const existingTransaction = await Transaction.findOne({
            itemId,
            receiverId
        });
        
        if (existingTransaction) {
            return res.status(400).json({
                success: false,
                message: 'You have already requested this item',
                transaction: existingTransaction
            });
        }
        
        // Create transaction with initial status 'pending'
        const transaction = await Transaction.create({
            donorId: item.donorId._id,
            receiverId,
            itemId,
            requestDate: new Date(),
            deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
            status: 'pending'
        });
        
        // Get receiver details for notification
        const receiver = await Receiver.findById(receiverId);
        
        // Send notification to donor
        await notifyDonationRequest(
            req,
            item.donorId._id,
            item.name,
            receiver.name
        );
        
        // Send email to donor
        await sendDonationMatchEmail(item.donorId, {
            name: item.name,
            category: item.category,
            receiverId: receiver
        });
        
        res.status(201).json({
            success: true,
            message: 'Item requested successfully',
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to request item',
            error: error.message
        });
    }
};

// Accept or reject a donation request (donor action)
export const updateTransactionStatus = async (req, res) => {
    try {
        const { status, deliveryDate } = req.body;
        const transactionId = req.params.id;
        const donorId = req.userId;
        
        // Find transaction
        const transaction = await Transaction.findById(transactionId);
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        
        // Check if donor owns the transaction
        if (transaction.donorId.toString() !== donorId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not authorized to update this transaction'
            });
        }
        
        // Check if status is valid
        if (!['pending', 'on the way', 'delivered'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }
        
        // Update transaction
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            transactionId,
            {
                status,
                ...(deliveryDate && { deliveryDate: new Date(deliveryDate) })
            },
            { new: true }
        );
        
        // Get item and receiver details
        const item = await Item.findById(transaction.itemId);
        const receiver = await Receiver.findById(transaction.receiverId);
        const donor = await Donor.findById(donorId);
        
        // If status changed to 'on the way' (accepted), notify receiver
        if (status === 'on the way') {
            await notifyRequestAccepted(
                req,
                transaction.receiverId,
                item.name,
                donor.name
            );
            
            await sendRequestAcceptedEmail(receiver, {
                ...item.toObject(),
                donorId: donor
            });
        }
        
        // If status changed to 'delivered', notify receiver
        if (status === 'delivered') {
            await notifyDonationDelivery(
                req,
                transaction.receiverId,
                item.name
            );
        }
        
        res.status(200).json({
            success: true,
            message: `Transaction ${status === 'on the way' ? 'accepted' : status === 'delivered' ? 'marked as delivered' : 'updated'} successfully`,
            transaction: updatedTransaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update transaction',
            error: error.message
        });
    }
};

// Get transactions by donor
export const getDonorTransactions = async (req, res) => {
    try {
        const donorId = req.userId;
        
        // Find all transactions by donor ID
        const transactions = await Transaction.find({ donorId })
            .populate('itemId')
            .populate('receiverId', 'name email phone')
            .sort({ requestDate: -1 });
        
        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get donor transactions',
            error: error.message
        });
    }
};

// Get transactions by receiver
export const getReceiverTransactions = async (req, res) => {
    try {
        const receiverId = req.userId;
        
        // Find all transactions by receiver ID
        const transactions = await Transaction.find({ receiverId })
            .populate('itemId')
            .populate('donorId', 'name email phone')
            .sort({ requestDate: -1 });
        
        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get receiver transactions',
            error: error.message
        });
    }
};

// Get a transaction by ID
export const getTransactionById = async (req, res) => {
    try {
        const transactionId = req.params.id;
        
        // Find transaction by ID and populate related fields
        const transaction = await Transaction.findById(transactionId)
            .populate('itemId')
            .populate('donorId', 'name email phone address')
            .populate('receiverId', 'name email phone address');
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        
        // Check if user is authorized to view this transaction
        if (
            transaction.donorId._id.toString() !== req.userId &&
            transaction.receiverId._id.toString() !== req.userId
        ) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not authorized to view this transaction'
            });
        }
        
        res.status(200).json({
            success: true,
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get transaction',
            error: error.message
        });
    }
};

export default {
    requestItem,
    updateTransactionStatus,
    getDonorTransactions,
    getReceiverTransactions,
    getTransactionById
}; 