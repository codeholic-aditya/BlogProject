import express from 'express';
import { createBlog, getAllBlogs } from '../controllers/blog.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const blogRouter = express.Router();

// Create Blog (Protected Route)
blogRouter.post('/create', verifyToken, createBlog);

// Get All Blogs (Public Route)
blogRouter.get('/', getAllBlogs);

export default blogRouter;
