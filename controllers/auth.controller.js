import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            // return res.status(400).json({ message: "All fields are required" });
            req.flash('error_msg', 'All fields are required');
            return res.redirect('/register'); // Redirecting to register pag
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            // return res.status(400).json({ message: "Invalid email format" });
            req.flash('error_msg', 'Invalid email format');
            return res.redirect('/register');
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            // return res.status(400).json({ message: "Email already in use" });
            req.flash('error_msg', 'Email already in use');
            return res.redirect('/register');
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            // return res.status(400).json({ message: "Username already in use" });
            req.flash('error_msg', 'Username already in use');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // res.status(201).json({ message: "User registered successfully" });
        
        req.flash('success_msg', 'User registered successfully. You can login');
        return res.redirect('/register'); // Redirect to login after successful registration

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            // return res.status(400).json({ message: "All fields are required" });
            
            req.flash('error_msg', 'All fields are required');
            return res.redirect('/login');
        }

        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/login');
            // return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // return res.status(400).json({ message: "Invalid credentials" });
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/login');
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Set token in httpOnly cookie before redirecting
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Login error:", error);
        // res.status(500).json({ message: "Server error" });
        
        req.flash('error_msg', 'Server error, please try again later');
        res.redirect('/login');
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        req.flash('success_msg', 'You have been logged out');
        res.redirect('/login'); // Redirect user to login page after logout
    } catch (error) {
        console.error("Logout error:", error);
        req.flash('error_msg', 'Error logging out, please try again');
        res.redirect('/dashboard');
    }
};