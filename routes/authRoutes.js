import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

const authRouter = express.Router();

// Register
authRouter.post('/register', register);

// Login
authRouter.post('/login', login);

export default authRouter;
