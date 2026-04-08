import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireAadhaarVerification = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Admin bypass
  if (req.user.role === 'admin') {
    return next();
  }

  // Check if user has submitted Aadhaar
  if (!req.user.aadhaarNumber) {
    return res.status(403).json({ 
      message: 'Aadhaar verification required. Please submit your Aadhaar details to proceed with land transactions.',
      requiresAadhaar: true,
      aadhaarSubmitted: false
    });
  }

  // Check if Aadhaar is verified
  if (!req.user.aadhaarVerified) {
    return res.status(403).json({ 
      message: 'Your Aadhaar is pending verification. Please wait for admin approval before proceeding with land transactions.',
      requiresAadhaar: true,
      aadhaarSubmitted: true,
      aadhaarVerified: false
    });
  }

  next();
};
