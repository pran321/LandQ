import { Response } from 'express';
import PriceOffer from '../models/priceOffer';
import Land from '../models/land';
import { AuthRequest } from '../middleware/auth';

export const createOffer = async (req: AuthRequest, res: Response) => {
  try {
    const { landId, offerPrice, message } = req.body;

    if (!offerPrice || offerPrice <= 0) {
      return res.status(400).json({ message: 'Please provide a valid offer price' });
    }

    const land = await Land.findById(landId);
    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    if (land.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot make an offer on your own land' });
    }

    const offer = await PriceOffer.create({
      buyerId: req.user._id,
      landId,
      sellerId: land.seller,
      offerPrice,
      message,
    });

    await offer.populate([
      { path: 'buyerId', select: 'name email phone' },
      { path: 'landId', select: 'title price images' },
    ]);

    res.status(201).json({ message: 'Offer submitted successfully', offer });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOffers = async (req: AuthRequest, res: Response) => {
  try {
    const offers = await PriceOffer.find({
      buyerId: req.user._id,
      deletedAt: null,
    })
      .populate('landId', 'title price images city state')
      .populate('sellerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ offers, count: offers.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReceivedOffers = async (req: AuthRequest, res: Response) => {
  try {
    const offers = await PriceOffer.find({
      sellerId: req.user._id,
      deletedAt: null,
    })
      .populate('landId', 'title price images city state')
      .populate('buyerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ offers, count: offers.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const respondToOffer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, counterPrice, counterMessage } = req.body;

    const offer = await PriceOffer.findOne({
      _id: id,
      sellerId: req.user._id,
      deletedAt: null,
    });

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (!['accepted', 'rejected', 'countered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    offer.status = status;

    if (status === 'countered') {
      if (!counterPrice || counterPrice <= 0) {
        return res.status(400).json({ message: 'Please provide a valid counter price' });
      }
      offer.counterPrice = counterPrice;
      offer.counterMessage = counterMessage;
    }

    await offer.save();
    await offer.populate([
      { path: 'buyerId', select: 'name email phone' },
      { path: 'landId', select: 'title price images' },
    ]);

    res.json({ message: 'Offer response sent successfully', offer });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOffer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const offer = await PriceOffer.findOne({
      _id: id,
      buyerId: req.user._id,
      deletedAt: null,
    });

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    offer.deletedAt = new Date();
    await offer.save();

    res.json({ message: 'Offer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
