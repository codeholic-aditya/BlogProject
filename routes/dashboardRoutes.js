import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import Blog from '../models/Blog.js';

const router = express.Router();

// Dashboard Route (Protected)
router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/login'); // Redirect if user is not authenticated
        }

        // Fetch blogs and pass them to the template
        const blogs = await Blog.find().populate('author', 'username');

        console.log("User object:", req.user); // Debugging

        res.render('dashboard', { 
            user: req.user, 
            blogs,
            success_msg: req.flash('success_msg'),  // Pass flash messages explicitly
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error("Error in dashboard route:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
