import { Response } from 'express';
import Land from '../models/land';
import { AuthRequest } from '../middleware/auth';

export const createLand = async (req: AuthRequest, res: Response) => {
  try {
    const landData = {
      ...req.body,
      seller: req.user._id,
    };

    // Handle image uploads
    if (req.files && Array.isArray(req.files)) {
      landData.images = req.files
        .filter((file: any) => file.fieldname === 'images')
        .map((file: any) => `/uploads/lands/${file.filename}`);
    }

    // Handle document uploads
    const documentFiles = req.files && Array.isArray(req.files)
      ? req.files.filter((file: any) => file.fieldname === 'documents')
      : [];
    
    if (documentFiles.length > 0) {
      landData.documents = documentFiles.map((file: any) => `/uploads/documents/${file.filename}`);
    }

    const land = await Land.create(landData);
    res.status(201).json({ message: 'Land created successfully', land });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLands = async (req: AuthRequest, res: Response) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      status,
      landType,
      search,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const filter: any = { deletedAt: null };

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
      ];
    }

    if (city) filter.city = { $regex: city, $options: 'i' };
    if (landType) filter.landType = landType;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (minSize || maxSize) {
      filter.size = {};
      if (minSize) filter.size.$gte = Number(minSize);
      if (maxSize) filter.size.$lte = Number(maxSize);
    }
    
    if (status) filter.status = status;

    // Sorting
    let sort: any = { createdAt: -1 };
    if (sortBy === 'price_asc') sort = { price: 1 };
    else if (sortBy === 'price_desc') sort = { price: -1 };
    else if (sortBy === 'size_asc') sort = { size: 1 };
    else if (sortBy === 'size_desc') sort = { size: -1 };
    else if (sortBy === 'views') sort = { views: -1 };
    else if (sortBy === 'featured') sort = { featured: -1, createdAt: -1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Land.countDocuments(filter);

    const lands = await Land.find(filter)
      .populate('seller', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      lands,
      count: lands.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLandById = async (req: AuthRequest, res: Response) => {
  try {
    const land = await Land.findById(req.params.id).populate('seller', 'name email phone profilePicture');
    
    if (!land || land.deletedAt) {
      return res.status(404).json({ message: 'Land not found' });
    }

    // Increment view count
    land.views += 1;
    await land.save();

    res.json({ land });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLand = async (req: AuthRequest, res: Response) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land || land.deletedAt) {
      return res.status(404).json({ message: 'Land not found' });
    }

    if (land.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this land' });
    }

    if (req.files && Array.isArray(req.files)) {
      req.body.images = req.files.map((file: any) => `/uploads/${file.filename}`);
    }

    const updatedLand = await Land.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ message: 'Land updated successfully', land: updatedLand });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLand = async (req: AuthRequest, res: Response) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land || land.deletedAt) {
      return res.status(404).json({ message: 'Land not found' });
    }

    if (land.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this land' });
    }

    land.deletedAt = new Date();
    await land.save();

    res.json({ message: 'Land deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyLands = async (req: AuthRequest, res: Response) => {
  try {
    const lands = await Land.find({ seller: req.user._id, deletedAt: null }).sort({ createdAt: -1 });
    res.json({ lands, count: lands.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
