import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';

const authRouter = express.Router();

// Register
authRouter.post('/register', register);

// Login
authRouter.post('/login', login);

// Logout
authRouter.get('/logout', logout);

export default authRouter;
