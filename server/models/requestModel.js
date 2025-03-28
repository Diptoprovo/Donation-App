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
    }
});

const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);

export default Request;
