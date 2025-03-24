import Blog from '../models/Blog.js';

// Create a Blog
export const createBlog = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        req.flash('error_msg', 'Title and content are required.');
        return res.redirect('/dashboard');
        // return res.status(400).json({ message: 'Title and content are required.' });
    }

    try {
        const newBlog = new Blog({
            title,
            content,
            author: req.user.userId  // Extracted from JWT middleware
        });

        await newBlog.save();

        req.flash('success_msg', 'Blog added successfully!'); // Store success message

        res.redirect('/dashboard'); // Redirect to dashboard after creating a blog
        // res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        req.flash('error_msg', 'Server error. Please try again.');
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Blogs
export const getAllBlogs = async (req, res) => {
    try {
        // Populate author details (username, email)
        const blogs = await Blog.find().populate('author', 'username email');
        res.status(200).json({ blogs });

        // res.render('dashboard', { blogs });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};