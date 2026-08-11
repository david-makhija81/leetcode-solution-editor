"use client";

import { useState, useRef, useCallback, Fragment, useEffect } from "react";
import { Plus, MessageSquare, Send, Pencil, Eye } from "lucide-react";
import type { LineComment } from "@/lib/types";
import { currentUser } from "@/lib/mock-data";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  language?: string;
  onLanguageChange?: (language: string) => void;
  className?: string;
  lineComments?: LineComment[];
  onAddLineComment?: (line: number, content: string) => void;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  language = "python",
  onLanguageChange,
  className = "",
  lineComments = [],
  onAddLineComment,
}: CodeEditorProps) {
  const [internalValue, setInternalValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayValue = onChange ? value : internalValue;
  const lines = displayValue.split("\n");

  // Review vs edit mode
  const [mode, setMode] = useState<"review" | "edit">(
    readOnly || lineComments.length > 0 ? "review" : "edit"
  );
  // Line currently showing the comment form (1-indexed)
  const [commentingLine, setCommentingLine] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  // Lines with expanded comment threads
  const [expandedLines, setExpandedLines] = useState<Set<number>>(new Set());
  // Global toggle for inline comments
  const [showCommentsInline, setShowCommentsInline] = useState(true);

  // Auto-expand any line that has comments
  useEffect(() => {
    setExpandedLines((prev) => {
      const next = new Set(prev);
      let changed = false;
      lineComments.forEach((c) => {
        if (!next.has(c.line)) {
          next.add(c.line);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [lineComments]);
  // Hovered line number (for showing "+" button)
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  // Group comments by line
  const commentsByLine: Record<number, LineComment[]> = {};
  for (const c of lineComments) {
    if (!commentsByLine[c.line]) commentsByLine[c.line] = [];
    commentsByLine[c.line].push(c);
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (onChange) {
        onChange(newValue);
      } else {
        setInternalValue(newValue);
      }
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue =
          displayValue.substring(0, start) +
          "    " +
          displayValue.substring(end);
        if (onChange) {
          onChange(newValue);
        } else {
          setInternalValue(newValue);
        }
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        });
      }
    },
    [displayValue, onChange]
  );

  function handleSubmitComment() {
    if (!commentDraft.trim() || commentingLine === null) return;
    onAddLineComment?.(commentingLine, commentDraft.trim());
    setCommentDraft("");
    setCommentingLine(null);
    // Auto-expand the thread for that line
    setExpandedLines((prev) => new Set(prev).add(commentingLine));
  }

  function toggleLineExpansion(line: number) {
    setExpandedLines((prev) => {
      const next = new Set(prev);
      if (next.has(line)) next.delete(line);
      else next.add(line);
      return next;
    });
  }

  function openCommentForm(line: number) {
    setCommentingLine(line);
    setCommentDraft("");
    // Switch to review mode to show the inline form
    if (mode === "edit") setMode("review");
  }

  const hasAnyComments = lineComments.length > 0;

  return (
    <div
      className={`relative bg-bg-base rounded-lg border border-border-default overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-surface border-b border-border-default">
        <div className="flex items-center gap-3">
          {onLanguageChange && !readOnly ? (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="text-xs text-text-primary bg-bg-elevated border border-border-default rounded px-2 py-1 uppercase tracking-wider focus:outline-none focus:border-accent-primary outline-none"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          ) : (
            <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
              {language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasAnyComments && (
            <div className="flex items-center gap-3 mr-2">
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <MessageSquare className="h-3 w-3" />
                {lineComments.length}
              </span>
              {mode === "review" && (
                <button
                  onClick={() => setShowCommentsInline((prev) => !prev)}
                  className="text-xs text-text-muted hover:text-text-primary transition-colors underline decoration-dotted underline-offset-2"
                >
                  {showCommentsInline ? "Hide Comments" : "Show Comments"}
                </button>
              )}
            </div>
          )}
          {!readOnly && (
            <div className="flex items-center bg-bg-elevated rounded-md p-0.5">
              <button
                onClick={() => setMode("edit")}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                  mode === "edit"
                    ? "bg-bg-surface text-accent-primary shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={() => setMode("review")}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                  mode === "review"
                    ? "bg-bg-surface text-accent-primary shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Eye className="h-3 w-3" />
                Review
              </button>
            </div>
          )}
          {readOnly && (
            <span className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-sm">
              Read only
            </span>
          )}
        </div>
      </div>

      {/* Code area */}
      {mode === "edit" && !readOnly ? (
        /* ── Edit Mode: textarea ── */
        <div className="flex overflow-auto max-h-[60vh]">
          <div
            className="flex-shrink-0 py-4 pl-4 pr-2 text-right select-none font-code text-sm leading-6 text-text-muted"
            aria-hidden="true"
          >
            {lines.map((_, i) => {
              const lineNum = i + 1;
              const hasComments = !!commentsByLine[lineNum]?.length;
              return (
                <div
                  key={i}
                  className="h-6 relative flex items-center justify-end gap-1"
                  onMouseEnter={() => setHoveredLine(lineNum)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  {hoveredLine === lineNum && onAddLineComment && (
                    <button
                      onClick={() => openCommentForm(lineNum)}
                      className="absolute -left-1 w-5 h-5 flex items-center justify-center rounded bg-accent-primary text-bg-base hover:bg-accent-primary/80 transition-colors"
                      title={`Comment on line ${lineNum}`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  )}
                  {hasComments && (
                    <button
                      onClick={() => {
                        setMode("review");
                        setExpandedLines((prev) => new Set(prev).add(lineNum));
                      }}
                      className="w-4 h-4 flex items-center justify-center"
                      title={`${commentsByLine[lineNum].length} comment(s)`}
                    >
                      <MessageSquare className="h-3 w-3 text-accent-primary" />
                    </button>
                  )}
                  <span>{lineNum}</span>
                </div>
              );
            })}
          </div>

          <div className="relative flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={displayValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              wrap="off"
              className="w-full h-full py-4 pr-4 pl-2 bg-transparent text-text-primary font-code text-sm leading-6 resize-none outline-none whitespace-pre overflow-x-auto"
              style={{
                minHeight: `${Math.max(lines.length, 10) * 24 + 32}px`,
              }}
            />
          </div>
        </div>
      ) : (
        /* ── Review Mode: line-by-line with inline comments ── */
        <div className="overflow-auto max-h-[60vh]">
          {lines.map((lineContent, i) => {
            const lineNum = i + 1;
            const lineHasComments = !!commentsByLine[lineNum]?.length;
            const isExpanded = showCommentsInline && expandedLines.has(lineNum);
            const isCommenting = commentingLine === lineNum;

            return (
              <Fragment key={i}>
                {/* Code line row */}
                <div
                  className="flex group hover:bg-bg-elevated/30 transition-colors"
                  onMouseEnter={() => setHoveredLine(lineNum)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  {/* Gutter */}
                  <div className="flex-shrink-0 w-14 py-0 pl-2 pr-1 text-right select-none font-code text-sm leading-6 text-text-muted relative flex items-center justify-end gap-0.5">
                    {(hoveredLine === lineNum && onAddLineComment) ? (
                      <button
                        onClick={() => openCommentForm(lineNum)}
                        className="w-5 h-5 flex items-center justify-center rounded bg-accent-primary text-bg-base hover:bg-accent-primary/80 transition-all"
                        title={`Comment on line ${lineNum}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    ) : lineHasComments ? (
                      <button
                        onClick={() => {
                          toggleLineExpansion(lineNum);
                          if (!showCommentsInline) setShowCommentsInline(true);
                        }}
                        className="w-5 h-5 flex items-center justify-center rounded transition-colors"
                        title={`${commentsByLine[lineNum].length} comment(s)`}
                      >
                        <MessageSquare className={`h-3 w-3 ${isExpanded ? "text-accent-primary" : "text-accent-primary/60"}`} />
                      </button>
                    ) : (
                      <span className="w-5" />
                    )}
                    <span className="w-6 text-right inline-block">{lineNum}</span>
                  </div>

                  {/* Code content */}
                  <div className="flex-1 min-w-0 py-0 pr-4 pl-2">
                    <pre className="font-code text-sm leading-6 text-text-primary whitespace-pre overflow-x-auto">
                      {lineContent || "\u00A0"}
                    </pre>
                  </div>
                </div>

                {/* Inline comment thread for this line */}
                {lineHasComments && isExpanded && (
                  <div className="border-y border-accent-primary/20 bg-bg-elevated/40 ml-14 mr-4 my-0.5 rounded-lg overflow-hidden">
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

                    {/* Reply form within expanded thread */}
                    {onAddLineComment && !isCommenting && (
                      <button
                        onClick={() => openCommentForm(lineNum)}
                        className="w-full px-4 py-2 text-xs text-text-muted hover:text-accent-primary hover:bg-bg-elevated/50 transition-colors text-left"
                      >
                        Write a reply…
                      </button>
                    )}
                  </div>
                )}

                {/* New comment form for this line */}
                {isCommenting && (
                  <div className="border-y border-accent-primary/30 bg-bg-elevated/50 ml-14 mr-4 my-0.5 rounded-lg p-3">
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
                          placeholder={`Leave a comment on line ${lineNum}…`}
                          className="w-full bg-bg-base border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 outline-none focus:border-accent-primary resize-none"
                          rows={2}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-text-muted">
                            ⌘ Enter to submit · Esc to cancel
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setCommentingLine(null);
                                setCommentDraft("");
                              }}
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
        </div>
      )}
    </div>
  );
}
