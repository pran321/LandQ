import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { AuthRequest } from '../middleware/auth';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role, userType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!userType || !['buyer', 'seller'].includes(userType)) {
      return res.status(400).json({ message: 'Please select if you are a buyer or seller' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'user',
      userType,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  res.json({ message: 'Logout successful' });
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Google OAuth Success Handler
export const googleAuthSuccess = async (req: any, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
    }

    const token = generateToken(user._id.toString());

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/callback?token=${token}`);
  } catch (error: any) {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
  }
};

// Google OAuth Failure Handler
export const googleAuthFailure = async (req: Request, res: Response) => {
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`);
};
