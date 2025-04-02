import jwt from 'jsonwebtoken';
import Donor from '../models/donorModel.js';
import Receiver from '../models/receiverModel.js';

// Middleware to verify the JWT token
export const authenticateUser = async (req, res, next) => {
    try {
        // Get token from cookie or authorization header
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user type and ID
        const { id, type } = decoded;

        // Find user based on type
        if (type === 'donor') {
            req.user = await Donor.findById(id).select('-password');
        } else if (type === 'receiver') {
            req.user = await Receiver.findById(id).select('-password');
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid user type'
            });
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.userType = type;
        req.userId = id;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
            error: error.message
        });
    }
};

// Middleware to authorize user role
export const authorizeRole = (role) => (req, res, next) => {
    if (req.userType !== role) {
        return res.status(403).json({
            success: false,
            message: `Access denied. ${role.charAt(0).toUpperCase() + role.slice(1)} access required.`
        });
    }
    next();
};

// For backward compatibility
export const isDonor = (req, res, next) => authorizeRole('donor')(req, res, next);
export const isReceiver = (req, res, next) => authorizeRole('receiver')(req, res, next);

export default { authenticateUser, authorizeRole, isDonor, isReceiver }; 