import { BookOpen } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/badge";
import type { Problem } from "@/lib/types";

interface ProblemStatementProps {
  problem: Problem;
}

export function ProblemStatement({ problem }: ProblemStatementProps) {
  return (
    <div className="h-full flex flex-col bg-bg-surface">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border-default bg-bg-surface">
        <BookOpen className="h-4 w-4 text-accent-primary flex-shrink-0" />
        <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
          Problem Statement
        </span>
        <span className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-sm ml-auto">
          Read only
        </span>
      </div>

      {/* Problem title bar */}
      <div className="px-5 py-4 border-b border-border-default">
        <div className="flex items-center gap-3">
          <span className="text-text-muted text-sm font-code">
            #{problem.number}
          </span>
          <h2 className="text-text-primary font-semibold text-base">
            {problem.title}
          </h2>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-sm border border-border-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Statement content */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4 problem-statement-content"
        dangerouslySetInnerHTML={{ __html: problem.statement }}
      />

      {/* Scoped styles for HTML content */}
      <style>{`
        .problem-statement-content h2 {
          display: none;
        }
        .problem-statement-content h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .problem-statement-content p {
          font-size: 0.875rem;
          line-height: 1.75;
          color: var(--color-text-primary);
          margin-bottom: 0.75rem;
        }
        .problem-statement-content code {
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 0.8125rem;
          background: var(--color-bg-elevated);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          color: var(--color-accent-primary);
        }
        .problem-statement-content pre {
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 0.8125rem;
          background: var(--color-bg-base);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--color-border-default);
          overflow-x: auto;
          margin-bottom: 0.75rem;
          line-height: 1.6;
          color: var(--color-text-primary);
        }
        .problem-statement-content ul,
        .problem-statement-content ol {
          padding-left: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .problem-statement-content li {
          font-size: 0.875rem;
          line-height: 1.75;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }
        .problem-statement-content em {
          color: var(--color-text-primary);
          font-style: italic;
        }
        .problem-statement-content strong {
          color: var(--color-text-primary);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
