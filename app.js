import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import expressLayouts from 'express-ejs-layouts';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import Blog from './models/Blog.js';
import session from 'express-session';
import flash from 'connect-flash';
import { verifyToken } from './middleware/authMiddleware.js';

dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3002', credentials: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  Use express-ejs-layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout'); //  Set default layout


// ✅ Session Middleware (required for flash messages)
app.use(
    session({
        secret: 'your_secret_key', // Change this to a strong secret key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Use true if using HTTPS
    })
);

// ✅ Flash Middleware
app.use(flash());

// ✅ Make flash messages available in all templates
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.user || null; // Pass user to views
    res.locals.messages = req.flash();
    next();
});

// 🏠 Home Route
app.get('/', (req, res) => {
    res.render('home');
});

// 📝 Register Page
app.get('/register', (req, res) => {
    res.render('register');
});

// 🔑 Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// 📜 Dashboard Page
app.get('/dashboard', verifyToken, async (req, res) => {
    try {
        console.log("User object in dashboard:", req.user); // Debugging

        if (!req.user) {
            console.log("User is undefined. Redirecting to login.");
            return res.redirect('/login');
        }

        const blogs = await Blog.find().populate('author', 'username email');

        res.render('dashboard', { 
            user: req.user, 
            blogs
        });
    } catch (error) {
        console.error(error);
        res.render('dashboard', { user: null, blogs: [] });
    }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/blogs', blogRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).render('404', { message: 'Page not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

