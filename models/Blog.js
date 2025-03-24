import mongoose, { Schema, model } from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // References User model
        required: true
    }
}, { timestamps: true });

const Blog = model('Blog', blogSchema);
export default Blog;
