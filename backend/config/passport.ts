import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { UserType } from '../models/user';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Only configure Google Strategy if credentials are provided
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientId && googleClientSecret && 
    googleClientId !== 'your_google_client_id_here' && 
    googleClientSecret !== 'your_google_client_secret_here') {
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id, deletedAt: null });

          if (user) {
            // User exists, return user
            return done(null, user);
          }

          // Check if user exists with same email
          user = await User.findOne({ email: profile.emails?.[0].value, deletedAt: null });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = 'google';
            if (!user.profilePicture && profile.photos?.[0]?.value) {
              user.profilePicture = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
          }

          // Create new user
          const newUser = await User.create({
            name: profile.displayName || profile.name?.givenName || 'User',
            email: profile.emails?.[0].value,
            googleId: profile.id,
            authProvider: 'google',
            profilePicture: profile.photos?.[0]?.value,
            userType: UserType.BUYER, // Default to buyer, can be changed later
            password: Math.random().toString(36).slice(-8), // Random password (won't be used)
          });

          done(null, newUser);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  console.log('✅ Google OAuth configured successfully');
} else {
  console.log('⚠️  Google OAuth not configured - add credentials to .env file');
  console.log('   GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET required');
}

export default passport;
