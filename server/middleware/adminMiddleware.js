import jwt from 'jsonwebtoken';

export const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { id, type } = decoded;

        if (id !== process.env.ADMIN_ID) {
            return res.status(401).json({
                success: false,
                message: "You do not have permission"
            })
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
            error: error.message
        });
    }
}