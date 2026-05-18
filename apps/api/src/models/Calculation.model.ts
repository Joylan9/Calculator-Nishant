import mongoose, { Schema, Document } from 'mongoose';

export interface ICalculation extends Document {
  expression: string;
  result: string;
  steps: { expression: string; result: string; operation: string }[];
  userId: string;
  mode: 'standard' | 'scientific';
  createdAt: Date;
}

const calculationSchema = new Schema<ICalculation>(
  {
    expression: { type: String, required: true },
    result: { type: String, required: true },
    steps: [
      {
        expression: { type: String },
        result: { type: String },
        operation: { type: String },
      },
    ],
    userId: { type: String, required: true, index: true },
    mode: { type: String, enum: ['standard', 'scientific'], default: 'standard' },
  },
  { timestamps: true }
);

calculationSchema.index({ userId: 1, createdAt: -1 });

export const Calculation = mongoose.model<ICalculation>('Calculation', calculationSchema);
