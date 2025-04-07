import mongoose, { Schema } from 'mongoose';

const donorSchema = new mongoose.Schema({
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
    donationList: [{
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    }],
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    }
    // verifyOtp: { type: String, default: '' },
    // verifyOtpExpireAt: { type: Number, default: 0 },
    // isAccountVerified: { type: Boolean, default: false },
    // resetOtp: { type: String, default: '' },
    // resetOtpExpire: { type: Number, default: 0 },
});

const Donor = mongoose.models.donor || mongoose.model('Donor', donorSchema);

export default Donor;