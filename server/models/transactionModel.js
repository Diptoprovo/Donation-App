import mongoose from "mongoose";
const { Schema } = mongoose;

const transactionSchema = new Schema({
    donorId: {
        type: Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'Receiver',
        required: true
    },
    itemId: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    requestDate: {
        type: Date,
        required: true,
    },
    deliveryDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value >= this.requestDate;
            },
            message: "Delivery date cannot be before request date."
        }
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'on the way', 'delivered', 'rejected'],
        required: true,
        default: 'pending'
    }
}, { timestamps: true });

// Ensure reusability in Next.js API routes
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;
