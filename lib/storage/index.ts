import type { LearningState } from "@/types/learning";
const key = "quantmath-phase1-v2";
export const initialState = (): LearningState => ({ version: 2, conceptProgress: {}, review: {}, lastTopic: "order", theme: "light" });
export function loadState(): LearningState {
  if (typeof window === "undefined") return initialState();
  try { const value = JSON.parse(localStorage.getItem(key) || "null"); return value?.version === 2 ? { ...initialState(), ...value } : initialState(); } catch { return initialState(); }
}
export function saveState(state: LearningState) { try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* storage can be unavailable */ } }
export function dueReview(state: LearningState) { const now = Date.now(); return Object.values(state.review).filter(item => item.nextReviewAt <= now).sort((a,b) => b.mistakes - a.mistakes); }
