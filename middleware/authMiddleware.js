import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("Token not found");
        return res.redirect('/login'); // Redirect if no token is found
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded user:", req.user); // Debugging
        req.user = decoded;  // Attach user details to req
        next();
    } catch (error) {
        console.error("Invalid token:", error.message);
        return res.redirect('/login'); // Redirect if token is invalid
    }
};
