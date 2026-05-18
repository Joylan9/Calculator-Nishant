import { Calculation, ICalculation } from '../models/Calculation.model';

interface CreateEntryParams {
  expression: string;
  result: string;
  steps: { expression: string; result: string; operation: string }[];
  userId: string;
  mode: 'standard' | 'scientific';
}

export async function createHistoryEntry(params: CreateEntryParams): Promise<ICalculation> {
  const entry = new Calculation(params);
  return entry.save();
}

export async function getHistory(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ entries: ICalculation[]; total: number }> {
  const [entries, total] = await Promise.all([
    Calculation.find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean(),
    Calculation.countDocuments({ userId }),
  ]);

  return { entries: entries as unknown as ICalculation[], total };
}

export async function clearUserHistory(userId: string): Promise<void> {
  await Calculation.deleteMany({ userId });
}
