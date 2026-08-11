"use client";

import { useState, useEffect, Fragment } from "react";
import { Plus, Trash2, HelpCircle, MessageSquare, Send } from "lucide-react";
import type { LineComment } from "@/lib/types";
import { currentUser } from "@/lib/mock-data";

interface ClarityQuestionsEditorProps {
  /** JSON string of string[] */
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  lineComments?: LineComment[];
  onAddLineComment?: (line: number, content: string) => void;
}

export function ClarityQuestionsEditor({
  value,
  onChange,
  readOnly = false,
  className = "",
  lineComments = [],
  onAddLineComment,
}: ClarityQuestionsEditorProps) {
  const [questions, setQuestions] = useState<string[]>(() => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [commentingLine, setCommentingLine] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  // Group comments by line (1-indexed)
  const commentsByLine: Record<number, LineComment[]> = {};
  for (const c of lineComments) {
    if (!commentsByLine[c.line]) commentsByLine[c.line] = [];
    commentsByLine[c.line].push(c);
  }

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

  function handleSubmitComment() {
    if (!commentDraft.trim() || commentingLine === null) return;
    onAddLineComment?.(commentingLine, commentDraft.trim());
    setCommentDraft("");
    setCommentingLine(null);
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
          {lineComments.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-text-muted ml-2">
              <MessageSquare className="h-3 w-3" />
              {lineComments.length}
            </span>
          )}
        </div>
        {readOnly && (
          <span className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-sm">
            Read only
          </span>
        )}
      </div>

      {/* Questions list */}
      <div className="flex-1 overflow-y-auto max-h-[60vh] min-h-[120px] p-4 space-y-1">
        {questions.length === 0 && readOnly && (
          <p className="text-sm text-text-muted/60 italic text-center py-6">
            No clarity questions yet.
          </p>
        )}

        {questions.map((q, i) => {
          const lineNum = i + 1;
          const lineHasComments = !!commentsByLine[lineNum]?.length;
          const isCommenting = commentingLine === lineNum;

          return (
            <Fragment key={i}>
              <div
                className="flex items-start gap-3 group py-1 rounded-lg hover:bg-bg-elevated/30 transition-colors px-1"
                onMouseEnter={() => setHoveredLine(lineNum)}
                onMouseLeave={() => setHoveredLine(null)}
              >
                {/* Comment gutter */}
                <div className="flex-shrink-0 w-6 mt-2.5 flex items-center justify-center">
                  {hoveredLine === lineNum && onAddLineComment ? (
                    <button
                      onClick={() => { setCommentingLine(lineNum); setCommentDraft(""); }}
                      className="w-5 h-5 flex items-center justify-center rounded bg-accent-primary text-bg-base hover:bg-accent-primary/80 transition-colors"
                      title={`Comment on question ${lineNum}`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  ) : lineHasComments ? (
                    <MessageSquare className="h-3.5 w-3.5 text-accent-primary" />
                  ) : null}
                </div>

                {/* Label */}
                <span className="flex-shrink-0 mt-2.5 text-xs font-medium text-accent-primary/80 w-24 text-right">
                  Question {lineNum}
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

              {/* Inline comment thread */}
              {lineHasComments && (
                <div className="border-y border-accent-primary/20 bg-bg-elevated/40 ml-10 mr-4 my-1 rounded-lg overflow-hidden">
                  {commentsByLine[lineNum].map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 px-4 py-3 border-b border-border-default/50 last:border-b-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-text-primary">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-text-muted">
                            {new Date(comment.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  {onAddLineComment && !isCommenting && (
                    <button
                      onClick={() => { setCommentingLine(lineNum); setCommentDraft(""); }}
                      className="w-full px-4 py-2 text-xs text-text-muted hover:text-accent-primary hover:bg-bg-elevated/50 transition-colors text-left"
                    >
                      Write a reply…
                    </button>
                  )}
                </div>
              )}

              {/* New comment form */}
              {isCommenting && (
                <div className="border-y border-accent-primary/30 bg-bg-elevated/50 ml-10 mr-4 my-1 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full flex-shrink-0 mt-1"
                    />
                    <div className="flex-1">
                      <textarea
                        autoFocus
                        value={commentDraft}
                        onChange={(e) => setCommentDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault();
                            handleSubmitComment();
                          }
                          if (e.key === "Escape") {
                            setCommentingLine(null);
                            setCommentDraft("");
                          }
                        }}
                        placeholder={`Comment on question ${lineNum}…`}
                        className="w-full bg-bg-base border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 outline-none focus:border-accent-primary resize-none"
                        rows={2}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-text-muted">
                          ⌘ Enter to submit · Esc to cancel
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setCommentingLine(null); setCommentDraft(""); }}
                            className="px-3 py-1 text-xs text-text-muted hover:text-text-primary transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitComment}
                            disabled={!commentDraft.trim()}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-accent-primary text-bg-base rounded-md hover:bg-accent-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Send className="h-3 w-3" />
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}

        {/* Add button */}
        {!readOnly && (
          <button
            onClick={addQuestion}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-muted hover:text-accent-primary hover:bg-bg-elevated/50 rounded-lg transition-colors w-full border border-dashed border-border-default/50 hover:border-accent-primary/40 mt-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Question
          </button>
        )}
      </div>
    </div>
  );
}
