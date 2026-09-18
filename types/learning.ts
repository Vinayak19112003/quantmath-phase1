export type TopicId = "order" | "fractions" | "decimals" | "percentages" | "ratios" | "negatives" | "exponents" | "roots";
export type AnswerKind = "number" | "fraction" | "percentage" | "ratio" | "choice";
export type Difficulty = "beginner" | "intermediate" | "mastery";

export type Concept = {
  id: string;
  title: string;
  intuition: string;
  why: string;
  workedExample: string[];
  quant: string;
  commonMistake: string;
  critical?: boolean;
};

export type Topic = {
  id: TopicId;
  number: number;
  title: string;
  short: string;
  color: string;
  description: string;
  prerequisites: string[];
  concepts: Concept[];
};

export type Question = {
  id: string;
  topicId: TopicId;
  conceptId: string;
  difficulty: Difficulty;
  prompt: string;
  answer: string | number;
  answerKind: AnswerKind;
  explanation: string[];
  hint: string;
  acceptedTolerance?: number;
};

export type Evidence = {
  correct: boolean;
  difficulty: Difficulty;
  source: "guided" | "practice" | "test" | "diagnostic";
  questionId: string;
  at: number;
};

export type ConceptProgress = {
  evidence: Evidence[];
  mastery: number;
  lastAttempted?: number;
};

export type ReviewItem = {
  conceptId: string;
  topicId: TopicId;
  mistakes: number;
  correctStreak: number;
  nextReviewAt: number;
  lastAttempted: number;
};

export type LearningState = {
  version: 2;
  conceptProgress: Record<string, ConceptProgress>;
  review: Record<string, ReviewItem>;
  lastTopic: TopicId;
  theme: "light" | "dark";
  diagnostic?: { completedAt: number; scores: Record<TopicId, number> };
  finalTest?: { completedAt: number; score: number; passed: boolean };
};
