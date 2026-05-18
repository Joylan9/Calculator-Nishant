import { evaluate, format as mathFormat } from 'mathjs';

interface CalcResult {
  result: string;
  steps: { expression: string; result: string; operation: string }[];
}

export function evaluateExpression(expression: string): CalcResult {
  const sanitized = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√\(/g, 'sqrt(')
    .replace(/(\d+)!/g, 'factorial($1)')
    .replace(/ln\(/g, 'log(')
    .replace(/log\(/g, 'log10(');

  const result = evaluate(sanitized);

  if (result === undefined || result === null || typeof result === 'function') {
    throw new AppError('Invalid expression', 400);
  }

  if (!isFinite(result) && result !== Infinity && result !== -Infinity) {
    throw new AppError('Calculation resulted in undefined value', 400);
  }

  const formatted = mathFormat(result, { precision: 14 });

  return {
    result: formatted,
    steps: [{ expression, result: formatted, operation: 'evaluate' }],
  };
}

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export { AppError };
