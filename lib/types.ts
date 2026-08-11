export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProblemStatus =
  | "unsolved"
  | "solved"
  | "in-review"
  | "reviewed";

export interface Problem {
  id: string;
  number: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  status: ProblemStatus;
  statement: string; // HTML content
  solutionCount: number;
}

export interface SolutionSet {
  id: string;
  problemId: string;
  authorId: string;
  reviewerId?: string | null;
  reviewer?: {
    id: string;
    name: string;
    avatar?: string | null;
  } | null;
  label: string;
  code: string;
  language: string;
  intuition: string;
  approach: string;
  complexity: string;
  authorName: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  solutionSetId: string;
  field: "code" | "intuition" | "approach" | "complexity";
  line: number;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
}

export interface MockUser {
  name: string;
  avatar: string;
  email: string;
}

export interface LineComment {
  id: string;
  solutionSetId: string;
  field: "code" | "intuition" | "approach" | "complexity";
  line: number; // 1-indexed line number
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
}
