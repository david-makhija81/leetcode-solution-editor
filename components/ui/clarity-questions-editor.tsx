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
          <HelpCircle className="h-3.5 w-3.5 text-brand-blue" />
          <span className="text-[10px] text-brand-blue font-bold font-arcade uppercase tracking-wider">
            Clarity Questions
          </span>
          {lineComments.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-brand-yellow uppercase ml-2">
              <MessageSquare className="h-3 w-3" />
              {lineComments.length}
            </span>
          )}
        </div>
        {readOnly && (
          <span className="text-[9px] font-arcade text-text-muted uppercase border border-border-default shadow-[2px_2px_0px_rgba(0,0,0,0.1)] px-2 py-1 rounded-sm bg-bg-base">
            READ ONLY
          </span>
        )}
      </div>

      {/* Questions list */}
      <div className="flex-1 overflow-y-auto max-h-[60vh] min-h-[120px] p-4 space-y-2">
        {questions.length === 0 && readOnly && (
          <p className="text-[10px] font-arcade text-text-muted/60 text-center py-6 uppercase">
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
                className="flex items-start sm:items-center flex-col sm:flex-row gap-3 group py-1 rounded-sm transition-colors px-1"
                onMouseEnter={() => setHoveredLine(lineNum)}
                onMouseLeave={() => setHoveredLine(null)}
              >
                {/* Comment gutter (desktop) / Label (mobile) */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="flex-shrink-0 w-6 flex items-center justify-center h-full">
                    {hoveredLine === lineNum && onAddLineComment ? (
                      <button
                        onClick={() => { setCommentingLine(lineNum); setCommentDraft(""); }}
                        className="w-5 h-5 flex items-center justify-center rounded bg-brand-blue text-bg-base hover:bg-brand-blue/80 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
                        title={`Comment on question ${lineNum}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    ) : lineHasComments ? (
                      <MessageSquare className="h-3.5 w-3.5 text-brand-yellow drop-shadow-sm" />
                    ) : (
                      <span className="w-5" />
                    )}
                  </div>

                  {/* Label */}
                  <span className="flex-shrink-0 text-[9px] sm:text-[10px] font-arcade text-brand-blue uppercase sm:w-28 sm:text-right">
                    QUESTION {lineNum}
                  </span>
                </div>

                {/* Input */}
                {readOnly ? (
                  <div className="flex-1 px-4 py-3 bg-bg-elevated/40 rounded-sm text-sm sm:text-[15px] font-code font-bold text-text-primary border-2 border-border-default min-h-[48px] shadow-[4px_4px_0px_rgba(0,0,0,0.05)] w-full">
                    {q || <span className="text-[10px] font-arcade font-normal text-text-muted/40 uppercase">EMPTY</span>}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => updateQuestion(i, e.target.value)}
                    placeholder={`E.G. WHY DO WE USE A HASHMAP HERE?`}
                    className="flex-1 px-4 py-3 bg-bg-base rounded-sm text-sm sm:text-[15px] font-code font-bold text-text-primary border-2 border-border-default outline-none focus:border-brand-blue transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.05)] focus:shadow-[4px_4px_0px_rgba(59,130,246,0.2)] focus:-translate-y-[1px] placeholder:font-normal placeholder:text-[12px] placeholder:text-text-muted/40 w-full"
                  />
                )}

                {/* Delete button */}
                {!readOnly && (
                  <button
                    onClick={() => removeQuestion(i)}
                    className="flex-shrink-0 p-1 text-text-muted hover:text-state-error opacity-0 group-hover:opacity-100 transition-all self-end sm:self-auto hidden sm:block"
                    title="Remove question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                {!readOnly && (
                  <button
                    onClick={() => removeQuestion(i)}
                    className="flex-shrink-0 p-1 text-state-error transition-all self-end sm:hidden -mt-2"
                    title="Remove question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Inline comment thread */}
              {lineHasComments && (
                <div className="border-y border-brand-yellow/30 bg-bg-elevated/80 ml-0 sm:ml-[144px] mr-0 sm:mr-8 my-2 rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                  {commentsByLine[lineNum].map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 px-4 py-3 border-b border-border-default/50 last:border-b-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5 border border-border-default/20"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                            {comment.authorName}
                          </span>
                          <span className="text-[10px] text-text-muted uppercase">
                            {new Date(comment.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-text-primary leading-relaxed font-medium">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  {onAddLineComment && !isCommenting && (
                    <button
                      onClick={() => { setCommentingLine(lineNum); setCommentDraft(""); }}
                      className="w-full px-4 py-2 text-[10px] uppercase font-bold text-brand-blue hover:text-text-primary hover:bg-brand-blue/10 transition-colors text-left"
                    >
                      Write a reply…
                    </button>
                  )}
                </div>
              )}

              {/* New comment form */}
              {isCommenting && (
                <div className="border border-brand-blue/50 bg-bg-elevated/80 ml-0 sm:ml-[144px] mr-0 sm:mr-8 my-2 rounded-sm p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full flex-shrink-0 mt-1 border border-border-default/20"
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
                        placeholder={`COMMENTING ON QUESTION ${lineNum}...`}
                        className="w-full bg-bg-base border-2 border-border-default rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 outline-none focus:border-brand-blue transition-colors resize-none font-medium"
                        rows={2}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider hidden sm:inline">
                          ⌘ Enter to submit · Esc to cancel
                        </span>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => { setCommentingLine(null); setCommentDraft(""); }}
                            className="px-3 py-1 text-[10px] uppercase font-bold text-text-muted hover:text-text-primary transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitComment}
                            disabled={!commentDraft.trim()}
                            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-brand-blue text-bg-base rounded-sm hover:bg-brand-blue/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
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
            className="flex items-center justify-center gap-2 px-3 py-3 text-[10px] font-bold font-arcade uppercase text-text-muted hover:text-brand-blue hover:bg-bg-elevated/50 rounded-sm transition-all w-full border-2 border-dashed border-border-default/50 hover:border-brand-blue/40 mt-4 tracking-wider"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        )}
      </div>
    </div>
  );
}
