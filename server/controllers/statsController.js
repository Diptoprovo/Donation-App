import Donor from '../models/donorModel.js';
import Receiver from '../models/receiverModel.js';
import Transaction from '../models/transactionModel.js';

// Get site-wide statistics
export const getStats = async (req, res) => {
    try {
        // Count total donors
        const totalDonors = await Donor.countDocuments();
        
        // Count total receivers
        const totalReceivers = await Receiver.countDocuments();
        
        // Count completed transactions (successful donations)
        const completedTransactions = await Transaction.countDocuments({ 
            status: 'approved' // or whatever status represents completed donations
        });
        
        res.status(200).json({
            success: true,
            totalDonors,
            totalReceivers,
            completedTransactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics',
            error: error.message
        });
    }
};

export default {
    getStats
}; 