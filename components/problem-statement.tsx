import { BookOpen } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/badge";
import type { Problem } from "@/lib/types";

interface ProblemStatementProps {
  problem: Problem;
}

export function ProblemStatement({ problem }: ProblemStatementProps) {
  return (
    <div className="h-full flex flex-col bg-bg-surface border-r-2 border-border-default shadow-sm">

      {/* Problem title bar */}
      <div className="px-5 py-5 border-b-2 border-border-default">
        <div className="flex items-center gap-3">
          <span className="text-brand-blue text-sm font-arcade">
            #{problem.number}
          </span>
          <h2 className="text-text-primary font-bold text-lg">
            {problem.title}
          </h2>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold text-text-secondary bg-bg-elevated px-2.5 py-1 rounded-sm border-2 border-border-default shadow-[2px_2px_0px_rgba(0,0,0,0.05)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Statement content */}
      <div
        className="flex-1 overflow-y-auto px-6 py-5 problem-statement-content text-text-secondary"
        dangerouslySetInnerHTML={{ __html: problem.statement }}
      />

      {/* Scoped styles for HTML content */}
      <style>{`
        .problem-statement-content h2 {
          display: none;
        }
        .problem-statement-content h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .problem-statement-content p {
          font-size: 0.95rem;
          line-height: 1.8;
          margin-bottom: 1rem;
        }
        .problem-statement-content code {
          font-family: ui-monospace, monospace;
          font-size: 0.85rem;
          background: var(--color-bg-elevated);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          border: 1px solid var(--color-border-default);
          color: var(--color-brand-blue);
          font-weight: 500;
        }
        .problem-statement-content pre {
          font-family: ui-monospace, monospace;
          font-size: 0.85rem;
          background: var(--color-bg-elevated);
          padding: 1rem;
          border-radius: 6px;
          border: 2px solid var(--color-border-default);
          box-shadow: 3px 3px 0px rgba(0,0,0,0.05);
          overflow-x: auto;
          margin-bottom: 1rem;
          line-height: 1.6;
          color: var(--color-text-primary);
        }
        .problem-statement-content ul,
        .problem-statement-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .problem-statement-content li {
          font-size: 0.95rem;
          line-height: 1.8;
          margin-bottom: 0.25rem;
        }
        .problem-statement-content em {
          font-style: italic;
        }
        .problem-statement-content strong {
          color: var(--color-text-primary);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
