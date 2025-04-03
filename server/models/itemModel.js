import mongoose from "mongoose";
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    condition: {
        type: String,
        enum: ['new', 'fairly used', 'needs repair'],
        required: true,  // Consider making it required
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
    image: [{
        type: String,
        required: true,
    }]
    ,
    donorId: {
        type: Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    isAvailable:{
        type: Boolean,
        default: true,
        required: false
    }
});

// Ensure reusability in Next.js API routes
const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

export default Item;
