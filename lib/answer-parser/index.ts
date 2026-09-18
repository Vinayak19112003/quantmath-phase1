import { gcd } from "@/lib/math/core";
import type { AnswerKind, Question } from "@/types/learning";

const clean = (input: string) => input.trim().replace(/s+/g, "");
const finite = (n: number) => Number.isFinite(n);

export function parseMathValue(input: string, kind: AnswerKind): number | null {
  const raw = clean(input).replace("−", "-");
  if (!raw) return null;
  const percent = raw.endsWith("%");
  const valueText = percent ? raw.slice(0, -1) : raw;
  if (kind === "ratio") {
    const parts = valueText.split(":"); if (parts.length !== 2) return null;
    const a = Number(parts[0]); const b = Number(parts[1]); return finite(a) && finite(b) && b !== 0 ? a / b : null;
  }
  if (valueText.includes("/")) {
    const parts = valueText.split("/"); if (parts.length !== 2) return null;
    const a = Number(parts[0]); const b = Number(parts[1]); if (!finite(a) || !finite(b) || b === 0) return null;
    return a / b;
  }
  const n = Number(valueText);
  if (!finite(n)) return null;
  if (kind === "percentage") return percent ? n : (Math.abs(n) <= 1 ? n * 100 : n);
  return percent ? n / 100 : n;
}

export function answersMatch(input: string, question: Pick<Question, "answer" | "answerKind" | "acceptedTolerance">) {
  const actual = parseMathValue(input, question.answerKind);
  const expected = typeof question.answer === "number" ? question.answer : parseMathValue(String(question.answer), question.answerKind);
  if (actual === null || expected === null) return false;
  const tolerance = question.acceptedTolerance ?? 0.0001;
  return Math.abs(actual - expected) <= tolerance;
}

export const normalizedRatio = (a: number, b: number) => {
  if (!Number.isInteger(a) || !Number.isInteger(b) || b === 0) return null;
  const factor = gcd(a, b); return [a / factor, b / factor] as const;
};
