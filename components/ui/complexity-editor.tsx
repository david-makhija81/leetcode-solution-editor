"use client";

import { useState, useEffect, Fragment } from "react";
import { Plus, Trash2, Timer, MessageSquare, Send } from "lucide-react";
import type { LineComment } from "@/lib/types";
import { currentUser } from "@/lib/mock-data";

export interface ComplexityField {
  label: string;
  value: string;
}

const DEFAULT_FIELDS: ComplexityField[] = [
  { label: "Worst Case Time Complexity", value: "" },
  { label: "Worst Case Space Complexity", value: "" },
];

interface ComplexityEditorProps {
  /** JSON string of ComplexityField[] — OR legacy plain-text string for backward compat */
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  lineComments?: LineComment[];
  onAddLineComment?: (line: number, content: string) => void;
}

function parseComplexity(raw: string): ComplexityField[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object" && "label" in parsed[0]) {
      return parsed as ComplexityField[];
    }
  } catch {
    /* not JSON */
  }
  // Legacy: plain text → migrate into defaults with value filled into time complexity
  if (raw.trim()) {
    return [
      { label: "Worst Case Time Complexity", value: raw.trim() },
      { label: "Worst Case Space Complexity", value: "" },
    ];
  }
  return DEFAULT_FIELDS.map((f) => ({ ...f }));
}

export function ComplexityEditor({
  value,
  onChange,
  readOnly = false,
  className = "",
  lineComments = [],
  onAddLineComment,
}: ComplexityEditorProps) {
  const [fields, setFields] = useState<ComplexityField[]>(() => parseComplexity(value));

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
    setFields(parseComplexity(value));
  }, [value]);

  function persist(updated: ComplexityField[]) {
    setFields(updated);
    onChange?.(JSON.stringify(updated));
  }

  function updateFieldValue(index: number, val: string) {
    const updated = [...fields];
    updated[index] = { ...updated[index], value: val };
    persist(updated);
  }

  function updateFieldLabel(index: number, label: string) {
    const updated = [...fields];
    updated[index] = { ...updated[index], label };
    persist(updated);
  }

  function addField() {
    persist([...fields, { label: "", value: "" }]);
  }

  function removeField(index: number) {
    // Don't allow removing the two default rows
    if (index < 2) return;
    persist(fields.filter((_, i) => i !== index));
  }

  function handleSubmitComment() {
    if (!commentDraft.trim() || commentingLine === null) return;
    onAddLineComment?.(commentingLine, commentDraft.trim());
    setCommentDraft("");
    setCommentingLine(null);
  }

  return (
    <div
      className={`relative bg-bg-surface rounded-sm border-2 border-border-default shadow-[4px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col ${className}`}
    >
      {/* Header - Terminal Style */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-elevated border-b-2 border-border-default flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 mr-1">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-red"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-brand-yellow"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-brand-green"></div>
          </div>
          <Timer className="h-4 w-4 text-brand-blue" strokeWidth={2.5} />
          <span className="font-arcade text-[9px] text-text-secondary mt-1">
            complexity.json
          </span>
          {lineComments.length > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-arcade text-brand-yellow ml-2 mt-1">
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

      {/* Fields */}
      <div className="flex-1 overflow-y-auto max-h-[60vh] min-h-[120px] p-4 space-y-1">
        {fields.map((field, i) => {
          const isDefault = i < 2;
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
                <div className="flex-shrink-0 w-6 mt-2 flex items-center justify-center">
                  {hoveredLine === lineNum && onAddLineComment ? (
                    <button
                      onClick={() => { setCommentingLine(lineNum); setCommentDraft(""); }}
                      className="w-5 h-5 flex items-center justify-center rounded bg-accent-primary text-bg-base hover:bg-accent-primary/80 transition-colors"
                      title={`Comment on field ${lineNum}`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  ) : lineHasComments ? (
                    <MessageSquare className="h-3.5 w-3.5 text-accent-primary" />
                  ) : null}
                </div>

                {/* Label */}
                <div className="flex-shrink-0 w-32 sm:w-56 mt-2 sm:border-r-2 sm:border-border-default/50 sm:pr-4">
                  {readOnly || isDefault ? (
                    <span className="text-[10px] sm:text-[11px] font-arcade text-brand-blue uppercase">
                      {field.label}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateFieldLabel(i, e.target.value)}
                      placeholder="FIELD NAME..."
                      className="w-full text-[10px] sm:text-[11px] font-arcade text-brand-blue uppercase bg-transparent border-b-2 border-brand-blue/30 outline-none focus:border-brand-blue pb-1 placeholder:text-text-muted/40"
                    />
                  )}
                </div>

                {/* Value */}
                {readOnly ? (
                  <div className="flex-1 px-4 py-3 bg-bg-elevated/50 rounded-sm text-base font-bold text-text-primary border-2 border-border-default min-h-[48px] font-code shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
                    {field.value || <span className="text-[10px] font-arcade font-normal text-text-muted/40 uppercase">NOT SPECIFIED</span>}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateFieldValue(i, e.target.value)}
                    placeholder={i === 0 ? "E.G. O(N²)" : i === 1 ? "E.G. O(N)" : "VALUE..."}
                    className="flex-1 px-4 py-3 bg-bg-base rounded-sm text-base font-bold text-text-primary border-2 border-border-default outline-none focus:border-brand-blue transition-all font-code placeholder:text-text-muted/40 placeholder:font-normal shadow-[4px_4px_0px_rgba(0,0,0,0.05)] focus:shadow-[4px_4px_0px_rgba(59,130,246,0.2)] focus:-translate-y-[1px]"
                  />
                )}

                {/* Delete button (only for custom fields) */}
                {!readOnly && !isDefault && (
                  <button
                    onClick={() => removeField(i)}
                    className="flex-shrink-0 mt-1.5 p-1 text-text-muted/40 hover:text-state-error opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove field"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                {!readOnly && isDefault && (
                  <span className="flex-shrink-0 w-6" />
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
                        placeholder={`Comment on field ${lineNum}…`}
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
            onClick={addField}
            className="flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] font-arcade text-text-muted hover:text-brand-green hover:bg-brand-green/10 rounded-sm transition-colors w-full border-2 border-dashed border-border-default hover:border-brand-green mt-3 uppercase"
          >
            <Plus className="h-3 w-3" strokeWidth={3} />
            Add Field
          </button>
        )}
      </div>
    </div>
  );
}
