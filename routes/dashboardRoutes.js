import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import Blog from '../models/Blog.js';

const router = express.Router();

// Dashboard Route (Protected)
router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        console.log("User object in dashboard:", req.user); // Debugging

        if (!req.user) {
            console.log("User is undefined. Redirecting to login.");
            return res.redirect('/login'); // Redirect if user is not authenticated
        }

        const blogs = await Blog.find().populate('author', 'username');

        res.render('dashboard', { 
            user: req.user, 
            blogs,
            success_msg: req.flash('success_msg'),  
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error("Error in dashboard route:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
