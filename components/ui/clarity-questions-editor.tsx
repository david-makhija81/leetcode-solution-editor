"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";

interface ClarityQuestionsEditorProps {
  /** JSON string of string[] */
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

export function ClarityQuestionsEditor({
  value,
  onChange,
  readOnly = false,
  className = "",
}: ClarityQuestionsEditorProps) {
  const [questions, setQuestions] = useState<string[]>(() => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Sync with parent value
  useEffect(() => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) setQuestions(parsed);
    } catch {
      /* ignore */
    }
  }, [value]);

  function persist(updated: string[]) {
    setQuestions(updated);
    onChange?.(JSON.stringify(updated));
  }

  function addQuestion() {
    persist([...questions, ""]);
  }

  function updateQuestion(index: number, text: string) {
    const updated = [...questions];
    updated[index] = text;
    persist(updated);
  }

  function removeQuestion(index: number) {
    persist(questions.filter((_, i) => i !== index));
  }

  return (
    <div
      className={`relative bg-bg-base rounded-lg border border-border-default overflow-hidden flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-surface border-b border-border-default flex-shrink-0">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-3.5 w-3.5 text-text-muted" />
          <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
            Clarity Questions
          </span>
        </div>
        {readOnly && (
          <span className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-sm">
            Read only
          </span>
        )}
      </div>

      {/* Questions list */}
      <div className="flex-1 overflow-y-auto max-h-[60vh] min-h-[120px] p-4 space-y-3">
        {questions.length === 0 && readOnly && (
          <p className="text-sm text-text-muted/60 italic text-center py-6">
            No clarity questions yet.
          </p>
        )}

        {questions.map((q, i) => (
          <div key={i} className="flex items-start gap-3 group">
            {/* Label */}
            <span className="flex-shrink-0 mt-2.5 text-xs font-medium text-accent-primary/80 w-24 text-right">
              Question {i + 1}
            </span>

            {/* Input */}
            {readOnly ? (
              <div className="flex-1 px-3 py-2 bg-bg-elevated/40 rounded-lg text-sm text-text-primary border border-border-default/50 min-h-[38px]">
                {q || <span className="text-text-muted/40 italic">Empty</span>}
              </div>
            ) : (
              <input
                type="text"
                value={q}
                onChange={(e) => updateQuestion(i, e.target.value)}
                placeholder={`e.g. Why do we use a hashmap here?`}
                className="flex-1 px-3 py-2 bg-bg-elevated/40 rounded-lg text-sm text-text-primary border border-border-default/50 outline-none focus:border-accent-primary/60 transition-colors placeholder:text-text-muted/40"
              />
            )}

            {/* Delete button */}
            {!readOnly && (
              <button
                onClick={() => removeQuestion(i)}
                className="flex-shrink-0 mt-2 p-1 text-text-muted/40 hover:text-state-error opacity-0 group-hover:opacity-100 transition-all"
                title="Remove question"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}

        {/* Add button */}
        {!readOnly && (
          <button
            onClick={addQuestion}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-muted hover:text-accent-primary hover:bg-bg-elevated/50 rounded-lg transition-colors w-full border border-dashed border-border-default/50 hover:border-accent-primary/40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Question
          </button>
        )}
      </div>
    </div>
  );
}
