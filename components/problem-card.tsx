import Link from "next/link";
import { FileCode2, MessageSquare } from "lucide-react";
import { DifficultyBadge, StatusBadge, Badge } from "@/components/ui/badge";
import type { Problem } from "@/lib/types";

interface ProblemCardProps {
  problem: Problem;
  assignedSolutionId?: string;
}

export function ProblemCard({ problem, assignedSolutionId }: ProblemCardProps) {
  const href = assignedSolutionId 
    ? `/problems/${problem.id}?solutionId=${assignedSolutionId}`
    : `/problems/${problem.id}`;

  return (
    <Link
      href={href}
      className="group block p-5 bg-bg-surface rounded-lg border border-border-default hover:border-border-active hover:bg-bg-elevated/50 transition-all duration-200"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-brand-blue text-[10px] font-arcade flex-shrink-0 mt-0.5">
            #{problem.number}
          </span>
          <h3 className="text-text-primary font-arcade text-xs truncate group-hover:text-brand-blue transition-colors uppercase">
            {problem.title}
          </h3>
        </div>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {problem.tags.map((tag) => (
          <Badge key={tag} variant="default" className="font-arcade text-[8px] uppercase">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <StatusBadge status={problem.status} />
        <div className="flex items-center gap-3">
          {problem.solutionCount > 0 && (
            <span className="flex items-center gap-1">
              <FileCode2 className="h-3.5 w-3.5" />
              {problem.solutionCount} solution{problem.solutionCount !== 1 ? "s" : ""}
            </span>
          )}
          {problem.status !== "unsolved" && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
