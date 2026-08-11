import type { Difficulty, ProblemStatus } from "@/lib/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "easy" | "medium" | "hard" | "status";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default:
    "bg-bg-elevated text-text-muted border border-border-default",
  easy: "bg-difficulty-easy/15 text-difficulty-easy border border-difficulty-easy/30",
  medium:
    "bg-difficulty-medium/15 text-difficulty-medium border border-difficulty-medium/30",
  hard: "bg-difficulty-hard/15 text-difficulty-hard border border-difficulty-hard/30",
  status:
    "bg-accent-primary/10 text-accent-primary border border-accent-primary/25",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const variant = difficulty.toLowerCase() as "easy" | "medium" | "hard";
  return <Badge variant={variant}>{difficulty}</Badge>;
}

const statusLabels: Record<ProblemStatus, string> = {
  unsolved: "Unsolved",
  solved: "Solved",
  "in-review": "In Review",
  reviewed: "Reviewed",
};

const statusVariantStyles: Record<ProblemStatus, string> = {
  unsolved: "bg-bg-elevated text-text-muted border border-border-default",
  solved: "bg-state-success/15 text-state-success border border-state-success/30",
  "in-review":
    "bg-state-warning/15 text-state-warning border border-state-warning/30",
  reviewed:
    "bg-accent-primary/10 text-accent-primary border border-accent-primary/25",
};

export function StatusBadge({ status }: { status: ProblemStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm ${statusVariantStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
