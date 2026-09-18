import { clamp } from "@/lib/math/core";
import type { ConceptProgress, Evidence, LearningState, ReviewItem, Topic, TopicId } from "@/types/learning";

const sourceWeight = { guided: .2, practice: .35, test: .45, diagnostic: .25 };
const difficultyWeight = { beginner: .65, intermediate: .9, mastery: 1 };

export function computeConceptMastery(evidence: Evidence[]): number {
  if (!evidence.length) return 0;
  const recent = evidence.slice(-12);
  const weighted = recent.reduce((sum, item, index) => {
    const recency = .55 + .45 * ((index + 1) / recent.length);
    return sum + (item.correct ? 1 : 0) * sourceWeight[item.source] * difficultyWeight[item.difficulty] * recency;
  }, 0);
  const possible = recent.reduce((sum, item, index) => sum + sourceWeight[item.source] * difficultyWeight[item.difficulty] * (.55 + .45 * ((index + 1) / recent.length)), 0);
  const score = possible ? weighted / possible * 100 : 0;
  const distinct = new Set(recent.map(x => x.questionId)).size;
  const hard = recent.filter(x => x.difficulty !== "beginner").length;
  const cap = distinct < 5 ? 84 : hard < 2 ? 89 : 100;
  return Math.round(clamp(score, 0, cap));
}

export function recordEvidence(state: LearningState, topicId: TopicId, conceptId: string, evidence: Evidence): LearningState {
  const prior = state.conceptProgress[conceptId] ?? { evidence: [], mastery: 0 };
  const nextEvidence = [...prior.evidence, evidence].slice(-30);
  const progress: ConceptProgress = { evidence: nextEvidence, mastery: computeConceptMastery(nextEvidence), lastAttempted: evidence.at };
  const reviewPrior = state.review[conceptId];
  const review: ReviewItem = evidence.correct
    ? { topicId, conceptId, mistakes: Math.max(0, (reviewPrior?.mistakes ?? 0) - 1), correctStreak: (reviewPrior?.correctStreak ?? 0) + 1, lastAttempted: evidence.at, nextReviewAt: evidence.at + ((reviewPrior?.correctStreak ?? 0) >= 2 ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24 * 2) }
    : { topicId, conceptId, mistakes: (reviewPrior?.mistakes ?? 0) + 1, correctStreak: 0, lastAttempted: evidence.at, nextReviewAt: evidence.at };
  const nextReview = { ...state.review, [conceptId]: review };
  if (evidence.correct && review.mistakes === 0 && review.correctStreak >= 3) delete nextReview[conceptId];
  return { ...state, conceptProgress: { ...state.conceptProgress, [conceptId]: progress }, review: nextReview };
}

export function topicMastery(topic: Topic, state: LearningState) {
  const values = topic.concepts.map(c => state.conceptProgress[c.id]?.mastery ?? 0);
  return Math.round(values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1));
}
