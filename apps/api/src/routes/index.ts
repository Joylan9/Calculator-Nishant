import { Router } from 'express';
import { z } from 'zod';
import { calculate, fetchHistory, deleteHistory } from '../controllers/calculationController';
import { guestAuth } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────

const calculateSchema = z.object({
  expression: z.string().min(1).max(500),
  mode: z.enum(['standard', 'scientific']).optional().default('standard'),
});

// ─── Auth Routes ──────────────────────────────────────────────────────────────

router.post('/auth/guest', guestAuth);

// ─── Calculation Routes ───────────────────────────────────────────────────────

router.post('/calculate', validate(calculateSchema), calculate);

// ─── History Routes (JWT required) ────────────────────────────────────────────

router.get('/history', authMiddleware, fetchHistory);
router.delete('/history', authMiddleware, deleteHistory);

export default router;
