import mongoose, { Schema } from 'mongoose';

const receiverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    requestList: [{
        type: Schema.Types.ObjectId,
        ref: 'Request',
        required: true,
    }],
    x: {
        type: Number,
    },
    y: {
        type: Number,
    }
    // verifyOtp: { type: String, default: '' },
    // verifyOtpExpireAt: { type: Number, default: 0 },
    // isAccountVerified: { type: Boolean, default: false },
    // resetOtp: { type: String, default: '' },
    // resetOtpExpire: { type: Number, default: 0 },
});

const Receiver = mongoose.models.Receiver || mongoose.model('Receiver', receiverSchema);

export default Receiver;