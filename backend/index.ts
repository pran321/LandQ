import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import passport from './config/passport';
import connectDB from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/userRoutes';
import userProfileRoutes from './routes/userProfileRoutes';
import landRoutes from './routes/landRoutes';
import savedLandsRoutes from './routes/savedLandsRoutes';
import savedLandNoteRoutes from './routes/savedLandNoteRoutes';
import buyerLeadsRoutes from './routes/buyerLeadsRoutes';
import comparisonRoutes from './routes/comparisonRoutes';
import priceOfferRoutes from './routes/priceOfferRoutes';
import reviewRoutes from './routes/reviewRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve static files from subdirectories
app.use('/uploads/lands', express.static(path.join(__dirname, '../uploads/lands')));
app.use('/uploads/profiles', express.static(path.join(__dirname, '../uploads/profiles')));
app.use('/uploads/documents', express.static(path.join(__dirname, '../uploads/documents')));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user', userProfileRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/saved-lands', savedLandsRoutes);
app.use('/api/saved-land-notes', savedLandNoteRoutes);
app.use('/api/buyer-leads', buyerLeadsRoutes);
app.use('/api/comparisons', comparisonRoutes);
app.use('/api/price-offers', priceOfferRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
