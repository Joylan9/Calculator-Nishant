import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

// 4-layer error handler: validation → auth → app → system
export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): void {
  // Layer 1: Validation errors
  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors || err.issues,
    });
    return;
  }

  // Layer 2: Auth errors
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Authentication failed',
    });
    return;
  }

  // Layer 3: Application errors (known)
  if (err.statusCode) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Layer 4: System errors (unexpected)
  logger.error('Unhandled error', { error: err.message, stack: err.stack, path: req.path });
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}
