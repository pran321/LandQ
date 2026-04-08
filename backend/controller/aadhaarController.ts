import { Response } from 'express';
import User from '../models/user';
import { AuthRequest } from '../middleware/auth';

// Submit Aadhaar for verification
export const submitAadhaar = async (req: AuthRequest, res: Response) => {
  try {
    const { aadhaarNumber } = req.body;

    // Validate Aadhaar format
    if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({ message: 'Invalid Aadhaar number. Must be 12 digits.' });
    }

    // Check if Aadhaar is already registered by another user
    const existingUser = await User.findOne({ 
      aadhaarNumber, 
      _id: { $ne: req.user._id } 
    });

    if (existingUser) {
      return res.status(400).json({ message: 'This Aadhaar number is already registered.' });
    }

    // Handle Aadhaar document upload
    let aadhaarDocument = req.user.aadhaarDocument;
    if (req.file) {
      aadhaarDocument = `/uploads/aadhaar/${req.file.filename}`;
    }

    // Update user with Aadhaar details
    req.user.aadhaarNumber = aadhaarNumber;
    req.user.aadhaarDocument = aadhaarDocument;
    req.user.aadhaarVerified = false; // Will be verified by admin
    await req.user.save();

    res.json({ 
      message: 'Aadhaar submitted successfully. Pending admin verification.',
      user: {
        aadhaarNumber: req.user.aadhaarNumber,
        aadhaarVerified: req.user.aadhaarVerified,
        aadhaarDocument: req.user.aadhaarDocument
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Aadhaar verification status
export const getAadhaarStatus = async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      aadhaarNumber: req.user.aadhaarNumber,
      aadhaarVerified: req.user.aadhaarVerified,
      aadhaarDocument: req.user.aadhaarDocument,
      hasAadhaar: !!req.user.aadhaarNumber
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Verify user's Aadhaar
export const verifyAadhaar = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { verified } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.aadhaarNumber) {
      return res.status(400).json({ message: 'User has not submitted Aadhaar details' });
    }

    user.aadhaarVerified = verified;
    await user.save();

    res.json({ 
      message: `Aadhaar ${verified ? 'verified' : 'rejected'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        aadhaarNumber: user.aadhaarNumber,
        aadhaarVerified: user.aadhaarVerified
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all pending Aadhaar verifications
export const getPendingVerifications = async (req: AuthRequest, res: Response) => {
  try {
    const pendingUsers = await User.find({
      aadhaarNumber: { $exists: true, $ne: null },
      aadhaarVerified: false,
      deletedAt: null
    }).select('name email phone userType aadhaarNumber aadhaarDocument createdAt');

    res.json({ 
      count: pendingUsers.length,
      users: pendingUsers 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all verified users
export const getVerifiedUsers = async (req: AuthRequest, res: Response) => {
  try {
    const verifiedUsers = await User.find({
      aadhaarVerified: true,
      deletedAt: null
    }).select('name email phone userType aadhaarNumber createdAt');

    res.json({ 
      count: verifiedUsers.length,
      users: verifiedUsers 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
