import { Router } from 'express';
import { register, login, logout, getCurrentUser, googleAuthSuccess, googleAuthFailure } from '../controller/authController';
import { authenticate } from '../middleware/auth';
import passport from '../config/passport';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

// Google OAuth routes
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && 
                          process.env.GOOGLE_CLIENT_SECRET &&
                          process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here';

if (isGoogleConfigured) {
  router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  router.get(
    '/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/api/auth/google/failure',
      session: false,
    }),
    googleAuthSuccess
  );

  router.get('/google/failure', googleAuthFailure);
} else {
  // Fallback routes when Google OAuth is not configured
  router.get('/google', (req, res) => {
    res.status(503).json({ 
      message: 'Google OAuth is not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env file.' 
    });
  });
  
  router.get('/google/callback', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_not_configured`);
  });
}

export default router;
