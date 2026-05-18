import { evaluate, format as mathFormat } from 'mathjs';

// ─── Safe Evaluate ────────────────────────────────────────────────────────────

export function safeEvaluate(expression: string): string {
  try {
    const sanitized = sanitizeExpression(expression);
    if (!sanitized) return 'Error';

    const result = evaluate(sanitized);

    if (result === undefined || result === null) return 'Error';
    if (typeof result === 'function') return 'Error';
    if (result === Infinity || result === -Infinity) return 'Infinity';
    if (isNaN(result)) return 'Error';

    return mathFormat(result, { precision: 14 });
  } catch {
    return 'Error';
  }
}

// ─── Sanitize Expression ──────────────────────────────────────────────────────

function sanitizeExpression(expr: string): string {
  let sanitized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√\(/g, 'sqrt(')
    .replace(/(\d+)!/g, 'factorial($1)')
    .replace(/ln\(/g, 'log(')
    .replace(/log\(/g, 'log10(');

  // Validate: only allow safe characters
  const allowed = /^[0-9+\-*/().,%epi sqrt factorial log10 sin cos tan asin acos atan pow abs ceil floor round\s]+$/;
  if (!allowed.test(sanitized)) {
    return '';
  }

  return sanitized;
}

// ─── Format Display ──────────────────────────────────────────────────────────

export function formatDisplay(value: string, precision: number = 10): string {
  if (value === 'Error' || value === 'Infinity' || value === '-Infinity') {
    return value;
  }

  const num = parseFloat(value);
  if (isNaN(num)) return value;

  // Use scientific notation for very large/small numbers
  if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
    return num.toExponential(precision - 1);
  }

  // Trim trailing zeros
  const formatted = parseFloat(num.toPrecision(precision));
  return formatted.toString();
}

// ─── Format with Commas ──────────────────────────────────────────────────────

export function formatWithCommas(value: string): string {
  if (value === 'Error' || value === 'Infinity') return value;

  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
