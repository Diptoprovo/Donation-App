import mongoose from "mongoose";
const { Schema } = mongoose;

const requestSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['clothes', 'shoes', 'books', 'electronics', 'accessories', 'other'],
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'Receiver',
        required: true
    },
    itemId: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        // Not required for general requests without a specific item
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);

export default Request;
