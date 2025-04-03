import Transaction from '../models/transactionModel.js';
import Item from '../models/itemModel.js';
import Donor from '../models/donorModel.js';
import Receiver from '../models/receiverModel.js';
import { notifyDonationRequest, notifyRequestAccepted, notifyDonationDelivery, createNotification } from '../utils/notificationUtils.js';
import { sendDonationMatchEmail, sendRequestAcceptedEmail } from '../utils/emailUtils.js';
import Request from '../models/requestModel.js';
import { captureRejectionSymbol } from 'nodemailer/lib/xoauth2/index.js';

// Request an Category of items
export const requestCategory = async (req, res) => {
    try {
        const { message,category,location } = req.body;
        const receiverId = req.userId;

        // Check if a pending request already exists for this item and receiver
        const existingRequest = await Request.findOne({
            category: category,
            receiverId: receiverId
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You have already requested for this category'
            });
        }

        // Get receiver details for notification
        const receiver = await Receiver.findById(receiverId);

        // Create a new request specifically for this item
        const request = await Request.create({
            category: category,
            location: location,
            receiverId: receiverId,
            message: message
        });

        // Add request to receiver's request list
        await Receiver.findByIdAndUpdate(
            receiverId,
            { $push: { requestList: request._id } }
        );

        // Send notification to donor
        await notifyDonationRequest(
            req,
            receiver.name
        );

        res.status(201).json({
            success: true,
            message: 'Item requested successfully. Your Requested has been posted',
            request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to request item',
            error: error.message
        });
    }
};

// Donor initiates a donation for a specific request
export const initiateItemDonation = async (req, res) => {
    try {
        const { receiverId, itemId } = req.body;
        const donorId = req.userId;

        // Check if request and item exist
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        const category = item.category;
        const request = await Request.findOne({receiverId:receiverId, category:category}).populate('receiverId');
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Check if donor owns the item
        if (item.donorId.toString() !== donorId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not the owner of the item'
            });
        }

        // Verify that item category and location match the request
        if (item.location !== request.location) {
            return res.status(400).json({
                success: false,
                message: 'Location of request and donation are not same'
            });
        }

        // Create transaction with initial status 'on the way' (auto-approved by donor)
        const transaction = await Transaction.create({
            donorId,
            receiverId: receiverId,
            itemId,
            requestDate: new Date(),
            deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
            status: 'on the way'
        });

        // Get donor details
        const donor = await Donor.findById(donorId);

        // Notify receiver
        await notifyRequestAccepted(//check this function once
            req,
            receiverId,
            item.name,
            donor.name
        );

        // Remove the request from receiver's requestList
        await Receiver.findByIdAndUpdate(
            receiverId,
            { $pull: { requestList: request._id} }
        );

        // Delete the request
        await Request.findByIdAndDelete(request._id);

        // Remove the item from donor's donationList
        await Donor.findByIdAndUpdate(
            donorId,
            { $push: { donationList: itemId } }
        );

        // Delete the item
        await Item.findByIdAndDelete(itemId);

        res.status(201).json({
            success: true,
            message: 'Donation initiated successfully',
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to initiate donation',
            error: error.message
        });
    }
};

// Donor approves a specific request
// export const approveRequest = async (req, res) => {
//     try {
//         const { requestId } = req.params;
//         const { deliveryDate, itemId } = req.body; 
//         const donorId = req.userId;

//         // Find the request
//         const request = await Request.findById(requestId).populate('receiverId');

//         if (!request) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Request not found'
//             });
//         }

//         // Handle different request types (specific item vs. generic)
//         let selectedItem;

//         // If request has a specific itemId already
//         if (request.itemId) {
//             selectedItem = await Item.findById(request.itemId);

//             if (!selectedItem) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Item not found'
//                 });
//             }

//             // Check if the item belongs to the donor
//             if (selectedItem.donorId.toString() !== donorId) {
//                 return res.status(403).json({
//                     success: false,
//                     message: 'Access denied. Not the owner of the item'
//                 });
//             }
//         }
//         // If it's a generic request without a specific itemId
//         else {
//             return res.status(400).json({
//                 success: false,
//                 message: 'For specific requests, you must specify itemid'
//             });
            
//         }

//         // Update request status to approved
//         request.status = 'approved';
//         await request.save();

//         // Create a transaction
//         const transaction = await Transaction.create({
//             donorId,
//             receiverId: request.receiverId._id,
//             itemId: selectedItem._id,
//             requestDate: request.createdAt,
//             deliveryDate: deliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days if not specified
//             status: 'on the way'
//         });

//         // Get donor details
//         const donor = await Donor.findById(donorId);

//         // Notify the receiver
//         await notifyRequestAccepted(
//             req,
//             request.receiverId._id,
//             selectedItem.name,
//             donor.name
//         );

//         // Send email to receiver
//         await sendRequestAcceptedEmail(request.receiverId, {
//             ...selectedItem.toObject(),
//             donorId: donor
//         });

//         // Remove the request from receiver's requestList
//         await Receiver.findByIdAndUpdate(
//             request.receiverId._id,
//             { $pull: { requestList: requestId } }
//         );

//         // Remove the item from donor's donationList
//         await Donor.findByIdAndUpdate(
//             donorId,
//             { $pull: { donationList: selectedItem._id } }
//         );

//         // Delete or mark the item as unavailable
//         await Item.findByIdAndDelete(selectedItem._id);

//         res.status(200).json({
//             success: true,
//             message: 'Request approved and transaction created successfully',
//             transaction
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to approve request',
//             error: error.message
//         });
//     }
// };

// // Donor rejects a specific request
// export const rejectRequest = async (req, res) => {
//     try {
//         const { requestId } = req.params;
//         const donorId = req.userId;

//         // Find the request
//         const request = await Request.findById(requestId).populate('receiverId').populate('itemId');

//         if (!request) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Request not found'
//             });
//         }

//         // If request doesn't have an itemId (it's a generic request)
//         if (!request.itemId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'This is a generic request without a specific item'
//             });
//         }

//         // Check if the item belongs to the donor
//         const item = await Item.findById(request.itemId);

//         if (!item) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Item not found'
//             });
//         }

//         if (item.donorId.toString() !== donorId) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Access denied. Not the owner of the item'
//             });
//         }

//         // Update request status to rejected
//         request.status = 'rejected';
//         await request.save();

//         // Get donor details
//         const donor = await Donor.findById(donorId);

//         // Notify the receiver about rejection
//         await createNotification(
//             req,
//             request.receiverId._id,
//             'Request Rejected',
//             `${donor.name} has rejected your request for: ${item.name}`,
//             'request_rejected'
//         );

//         res.status(200).json({
//             success: true,
//             message: 'Request rejected successfully',
//             request
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to reject request',
//             error: error.message
//         });
//     }
// };


// track transaction status (admin action)
export const updateTransactionStatus = async (req, res) => {
    try {
        const { status, deliveryDate, transactionId } = req.body;
        const adminId = req.userId; // gotta check this functionality in adminMiddleware or authMiddleware
        // Find transaction
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        const donor = await Donor.findById(transaction.donorId);
        const item = await Item.findById(transaction.itemId);
        const receiver = await Receiver.findById(transaction.receiverId);   

        // Check if donor owns the transaction
        if (adminId !== process.env.ADMIN_ID) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not authorized to update this transaction'
            });
        }

        // Check if status is valid
        if (!['pending', 'on the way', 'delivered', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        // Get item, receiver, and donor details before updating
        // const item = await Item.findById(itemId);
        // const receiver = await Receiver.findById(transaction.receiverId);
        // const donor = await Donor.findById(donorId);

        // if (!item || !receiver || !donor) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Item, receiver, or donor not found'
        //     });
        // }
        // if transaction is created that means donor receiver and item are already present

        // Handle rejection case
        if (status === 'rejected') {
            // Update transaction status to rejected
            const updatedTransaction = await Transaction.findByIdAndUpdate(
                transactionId,
                { status: 'rejected' },
                { new: true }
            );

            // Notify receiver about rejection
            await createNotification(
                req,
                transaction.receiverId,
                'Request Rejected',
                `${donor.name} has rejected your request for: ${item.name}`,
                'request_rejected'
            );

            return res.status(200).json({
                success: true,
                message: 'Transaction rejected successfully',
                transaction: updatedTransaction
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

        // If status changed to 'on the way' (accepted), notify receiver
        // and remove the item from available items
        if (status === 'on the way') {
            // Notify the receiver
            await notifyRequestAccepted(
                req,
                transaction.receiverId,
                item.name,
                donor.name
            );

            // Send email to receiver
            await sendRequestAcceptedEmail(receiver, {
                ...item.toObject(),
                donorId: donor
            });

            // Find all matching requests to this item
            const matchingRequests = await Request.find({
                category: item.category,
                location: item.location
            });

            // Remove the matched request from the receiver's requestList
            for (const matchedRequest of matchingRequests) {
                if (matchedRequest.receiverId.toString() === transaction.receiverId.toString()) {
                    // Remove this request from receiver's requestList
                    await Receiver.findByIdAndUpdate(
                        transaction.receiverId,
                        { $pull: { requestList: matchedRequest._id } }
                    );

                    // Delete the request as it's now fulfilled
                    await Request.findByIdAndDelete(matchedRequest._id);
                }
            }

            // Remove the item from donor's donationList
            await Donor.findByIdAndUpdate(
                donor._id,
                { $pull: { donationList: item._id } }
            );

            // Mark the item as unavailable or delete it since it's now being donated
            await Item.findByIdAndDelete(transaction.itemId);
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
            message: `Transaction ${status === 'on the way' ? 'accepted' :
                status === 'delivered' ? 'marked as delivered' :
                    'updated'
                } successfully`,
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
        const transactions = await Transaction.find({ donorId:donorId })
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
    updateTransactionStatus,
    getDonorTransactions,
    getReceiverTransactions,
    getTransactionById,
    initiateItemDonation,
    approveRequest,
    rejectRequest,
    requestCategory
}; 