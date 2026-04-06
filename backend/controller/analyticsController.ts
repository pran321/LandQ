import { Response } from 'express';
import Land from '../models/land';
import User from '../models/user';
import BuyerLeads from '../models/buyerLeads';
import SavedLands from '../models/savedLands';
import PriceOffer from '../models/priceOffer';
import Review from '../models/review';
import { AuthRequest } from '../middleware/auth';

export const getAdminAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Total counts
    const totalUsers = await User.countDocuments({ deletedAt: null });
    const totalLands = await Land.countDocuments({ deletedAt: null });
    const totalLeads = await BuyerLeads.countDocuments({ deletedAt: null });
    const totalOffers = await PriceOffer.countDocuments({ deletedAt: null });

    // User breakdown
    const buyers = await User.countDocuments({ userType: 'buyer', deletedAt: null });
    const sellers = await User.countDocuments({ userType: 'seller', deletedAt: null });

    // Land status breakdown
    const availableLands = await Land.countDocuments({ status: 'available', deletedAt: null });
    const soldLands = await Land.countDocuments({ status: 'sold', deletedAt: null });
    const pendingLands = await Land.countDocuments({ status: 'pending', deletedAt: null });

    // Land type breakdown
    const landsByType = await Land.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$landType', count: { $sum: 1 } } },
    ]);

    // Popular cities
    const popularCities = await Land.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Recent activity
    const recentLands = await Land.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title price city createdAt');

    const recentUsers = await User.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email userType createdAt');

    // Revenue calculation (sum of sold lands)
    const revenueData = await Land.aggregate([
      { $match: { status: 'sold', deletedAt: null } },
      { $group: { _id: null, totalRevenue: { $sum: '$price' } } },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Average land price
    const avgPriceData = await Land.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: null, avgPrice: { $avg: '$price' } } },
    ]);

    const avgPrice = avgPriceData.length > 0 ? avgPriceData[0].avgPrice : 0;

    res.json({
      overview: {
        totalUsers,
        totalLands,
        totalLeads,
        totalOffers,
        buyers,
        sellers,
        totalRevenue,
        avgPrice: Math.round(avgPrice),
      },
      landStatus: {
        available: availableLands,
        sold: soldLands,
        pending: pendingLands,
      },
      landsByType,
      popularCities,
      recentActivity: {
        lands: recentLands,
        users: recentUsers,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const sellerId = req.user._id;

    // My lands count
    const myLands = await Land.countDocuments({ seller: sellerId, deletedAt: null });
    const availableLands = await Land.countDocuments({ seller: sellerId, status: 'available', deletedAt: null });
    const soldLands = await Land.countDocuments({ seller: sellerId, status: 'sold', deletedAt: null });

    // Get all my land IDs
    const myLandIds = await Land.find({ seller: sellerId, deletedAt: null }).select('_id');
    const landIds = myLandIds.map(land => land._id);

    // Total views on my lands
    const viewsData = await Land.aggregate([
      { $match: { seller: sellerId, deletedAt: null } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);
    const totalViews = viewsData.length > 0 ? viewsData[0].totalViews : 0;

    // Total saves on my lands
    const totalSaves = await SavedLands.countDocuments({
      landId: { $in: landIds },
      deletedAt: null,
    });

    // Total leads received
    const totalLeads = await BuyerLeads.countDocuments({
      landId: { $in: landIds },
      deletedAt: null,
    });

    // Total offers received
    const totalOffers = await PriceOffer.countDocuments({
      sellerId,
      deletedAt: null,
    });

    // Pending offers
    const pendingOffers = await PriceOffer.countDocuments({
      sellerId,
      status: 'pending',
      deletedAt: null,
    });

    // Most viewed lands
    const mostViewedLands = await Land.find({ seller: sellerId, deletedAt: null })
      .sort({ views: -1 })
      .limit(5)
      .select('title views price city images');

    // Most saved lands
    const mostSavedLands = await SavedLands.aggregate([
      { $match: { landId: { $in: landIds }, deletedAt: null } },
      { $group: { _id: '$landId', saveCount: { $sum: 1 } } },
      { $sort: { saveCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'lands',
          localField: '_id',
          foreignField: '_id',
          as: 'land',
        },
      },
      { $unwind: '$land' },
    ]);

    res.json({
      overview: {
        myLands,
        availableLands,
        soldLands,
        totalViews,
        totalSaves,
        totalLeads,
        totalOffers,
        pendingOffers,
      },
      mostViewedLands,
      mostSavedLands,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
