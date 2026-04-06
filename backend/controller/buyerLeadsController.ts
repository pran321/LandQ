import { Response } from 'express';
import BuyerLeads from '../models/buyerLeads';
import Land from '../models/land';
import { AuthRequest } from '../middleware/auth';

export const createLead = async (req: AuthRequest, res: Response) => {
  try {
    const { landId, message } = req.body;

    const land = await Land.findById(landId);
    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    const lead = await BuyerLeads.create({
      buyerId: req.user._id,
      landId,
      message,
    });

    res.status(201).json({ message: 'Lead created successfully', lead });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyLeads = async (req: AuthRequest, res: Response) => {
  try {
    const leads = await BuyerLeads.find({
      buyerId: req.user._id,
      deletedAt: null,
    }).populate('landId');

    res.json({ leads, count: leads.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeadsForMyLands = async (req: AuthRequest, res: Response) => {
  try {
    const lands = await Land.find({ seller: req.user._id, deletedAt: null });
    const landIds = lands.map((land) => land._id);

    const leads = await BuyerLeads.find({
      landId: { $in: landIds },
      deletedAt: null,
    })
      .populate('buyerId', 'name email phone profilePicture')
      .populate('landId', 'title price images city state')
      .sort({ createdAt: -1 });

    // Group by status for better organization
    const grouped = {
      pending: leads.filter(l => l.status === 'pending'),
      contacted: leads.filter(l => l.status === 'contacted'),
      interested: leads.filter(l => l.status === 'interested'),
      rejected: leads.filter(l => l.status === 'rejected'),
    };

    res.json({
      leads,
      count: leads.length,
      grouped,
      counts: {
        pending: grouped.pending.length,
        contacted: grouped.contacted.length,
        interested: grouped.interested.length,
        rejected: grouped.rejected.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeadStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const lead = await BuyerLeads.findById(req.params.id).populate('landId');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const land = await Land.findById(lead.landId);
    if (land && land.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    lead.status = status;
    await lead.save();

    res.json({ message: 'Lead status updated', lead });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await BuyerLeads.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (lead.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    lead.deletedAt = new Date();
    await lead.save();

    res.json({ message: 'Lead deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
