import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map((e: any) => e.message),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value entered',
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Server Error',
  });
};
