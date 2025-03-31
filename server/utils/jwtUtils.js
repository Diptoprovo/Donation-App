import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (id, type) => {
    return jwt.sign(
        { id, type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Set JWT token in HTTP-only cookie
export const setTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

export default { generateToken, setTokenCookie }; 