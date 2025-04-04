import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import Donor from '../models/donorModel.js';
import Receiver from '../models/receiverModel.js';
import { generateToken, setTokenCookie } from '../utils/jwtUtils.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register a new donor
export const registerDonor = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        // Check if user already exists
        const existingDonor = await Donor.findOne({ email });
        if (existingDonor) {
            return res.status(400).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new donor
        const donor = await Donor.create({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
            donationList: []
        });

        // Generate JWT token
        const token = generateToken(donor._id, 'donor');

        // Set token in cookie
        setTokenCookie(res, token);

        res.status(201).json({
            success: true,
            message: 'Donor registered successfully',
            user: {
                _id: donor._id,
                name: donor.name,
                email: donor.email,
                type: 'donor'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to register donor',
            error: error.message
        });
    }
};

// Register a new receiver
export const registerReceiver = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        // Check if user already exists
        const existingReceiver = await Receiver.findOne({ email });
        if (existingReceiver) {
            return res.status(400).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new receiver
        const receiver = await Receiver.create({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
            requestList: []
        });

        // Generate JWT token
        const token = generateToken(receiver._id, 'receiver');

        // Set token in cookie
        setTokenCookie(res, token);

        res.status(201).json({
            success: true,
            message: 'Receiver registered successfully',
            user: {
                _id: receiver._id,
                name: receiver.name,
                email: receiver.email,
                type: 'receiver'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to register receiver',
            error: error.message
        });
    }
};

// Login user (donor or receiver)
export const login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        let user;

        // Find user based on type
        if (userType === 'donor') {
            user = await Donor.findOne({ email });
        } else if (userType === 'receiver') {
            user = await Receiver.findOne({ email });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid user type'
            });
        }

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // if (password !== user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(user._id, userType);

        // Set token in cookie
        setTokenCookie(res, token);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                type: userType
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to login',
            error: error.message
        });
    }
};

// Google OAuth login/register
export const googleAuth = async (req, res) => {
    try {
        const { token, userType } = req.body;

        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, picture } = ticket.getPayload();

        let user;
        let newUser = false;

        // Check if user exists based on type
        if (userType === 'donor') {
            user = await Donor.findOne({ email });

            // If user doesn't exist, create a new donor
            if (!user) {
                // Create a random password for OAuth users
                const randomPassword = Math.random().toString(36).slice(-8);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(randomPassword, salt);

                user = await Donor.create({
                    name,
                    email,
                    password: hashedPassword,
                    address: '',
                    phone: '',
                    donationList: []
                });

                newUser = true;
            }
        } else if (userType === 'receiver') {
            user = await Receiver.findOne({ email });

            // If user doesn't exist, create a new receiver
            if (!user) {
                // Create a random password for OAuth users
                const randomPassword = Math.random().toString(36).slice(-8);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(randomPassword, salt);

                user = await Receiver.create({
                    name,
                    email,
                    password: hashedPassword,
                    address: '',
                    phone: '',
                    requestList: []
                });

                newUser = true;
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid user type'
            });
        }

        // Generate JWT token
        const jwtToken = generateToken(user._id, userType);

        // Set token in cookie
        setTokenCookie(res, jwtToken);

        res.status(200).json({
            success: true,
            message: newUser ? 'Registration successful' : 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                type: userType,
                newUser
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Google authentication failed',
            error: error.message
        });
    }
};

// Logout user
export const logout = (req, res) => {
    // Clear the token cookie
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const user = req.user;

        // Return user profile without password
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                phone: user.phone,
                type: req.userType
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile',
            error: error.message
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, address, phone } = req.body;

        // Update user profile based on user type
        if (req.userType === 'donor') {
            await Donor.findByIdAndUpdate(req.userId, {
                name,
                address,
                phone
            });
        } else if (req.userType === 'receiver') {
            await Receiver.findByIdAndUpdate(req.userId, {
                name,
                address,
                phone
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

export default {
    registerDonor,
    registerReceiver,
    login,
    googleAuth,
    logout,
    getProfile,
    updateProfile
}; 