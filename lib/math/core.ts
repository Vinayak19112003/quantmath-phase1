export const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
export const isFiniteNumber = (value: number) => Number.isFinite(value);
export const gcd = (a: number, b: number): number => { a = Math.abs(Math.trunc(a)); b = Math.abs(Math.trunc(b)); while (b) [a, b] = [b, a % b]; return a || 1; };
export const simplifyFraction = (numerator: number, denominator: number) => {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) return null;
  const sign = denominator < 0 ? -1 : 1; const factor = gcd(numerator, denominator);
  return { numerator: sign * numerator / factor, denominator: sign * denominator / factor };
};
export const fractionValue = (numerator: number, denominator: number) => denominator === 0 ? null : numerator / denominator;
export const decimal = (value: number, digits = 4) => Number.isFinite(value) ? Number(value.toFixed(digits)).toString() : "—";
export const percentageChange = (oldValue: number, newValue: number) => oldValue === 0 ? null : ((newValue - oldValue) / oldValue) * 100;
export const safeDivide = (a: number, b: number) => b === 0 ? null : a / b;
