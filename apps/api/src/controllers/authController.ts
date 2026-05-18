import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { User } from '../models/User.model';
import { logger } from '../config/logger';

export async function guestAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const guestId = uuidv4();

    // Try to save guest user, but don't fail if DB is unavailable
    try {
      await User.create({ guestId });
    } catch (err) {
      logger.warn('Could not save guest user to DB', { error: err });
    }

    const token = jwt.sign({ userId: guestId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    const decoded = jwt.decode(token) as { exp: number };

    res.json({
      success: true,
      data: {
        token,
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}
