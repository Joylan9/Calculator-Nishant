import { Request, Response, NextFunction } from 'express';
import { evaluateExpression } from '../services/calculationService';
import { createHistoryEntry, getHistory, clearUserHistory } from '../services/historyService';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';

export async function calculate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { expression, mode } = req.body;
    const result = evaluateExpression(expression);

    // If authenticated, save to history
    const authReq = req as AuthRequest;
    if (authReq.userId) {
      try {
        await createHistoryEntry({
          expression,
          result: result.result,
          steps: result.steps,
          userId: authReq.userId,
          mode: mode || 'standard',
        });
      } catch (err) {
        logger.warn('Failed to save calculation to history', { error: err });
      }
    }

    res.json({
      success: true,
      data: {
        result: result.result,
        steps: result.steps,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function fetchHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const { entries, total } = await getHistory(authReq.userId!, limit, offset);

    res.json({
      success: true,
      data: entries,
      meta: { total, limit, offset },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    await clearUserHistory(authReq.userId!);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}
