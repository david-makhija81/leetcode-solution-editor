"use client";

import { useState, useRef, useCallback, Fragment, useEffect } from "react";
import { Plus, MessageSquare, Send, Pencil, Eye } from "lucide-react";
import type { LineComment } from "@/lib/types";
import { currentUser } from "@/lib/mock-data";

interface TextEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  label?: string;
  className?: string;
  lineComments?: LineComment[];
  onAddLineComment?: (line: number, content: string) => void;
}

export function TextEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = "Start writing...",
  label,
  className = "",
  lineComments = [],
  onAddLineComment,
}: TextEditorProps) {
  const [internalValue, setInternalValue] = useState(value);
  const displayValue = onChange ? value : internalValue;
  const lines = displayValue.split("\n");

  const [mode, setMode] = useState<"review" | "edit">(
    readOnly || lineComments.length > 0 ? "review" : "edit"
  );
  const [commentingLine, setCommentingLine] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [expandedLines, setExpandedLines] = useState<Set<number>>(new Set());
  const [showCommentsInline, setShowCommentsInline] = useState(true);

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

  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const commentsByLine: Record<number, LineComment[]> = {};
  for (const c of lineComments) {
    if (!commentsByLine[c.line]) commentsByLine[c.line] = [];
    commentsByLine[c.line].push(c);
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      if (onChange) {
        onChange(val);
      } else {
        setInternalValue(val);
      }
    },
    [onChange]
  );

  function handleSubmitComment() {
    if (!commentDraft.trim() || commentingLine === null) return;
    onAddLineComment?.(commentingLine, commentDraft.trim());
    setCommentDraft("");
    setCommentingLine(null);
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
    if (mode === "edit") setMode("review");
  }

  const hasAnyComments = lineComments.length > 0;

  return (
    <div
      className={`relative bg-bg-base rounded-lg border border-border-default overflow-hidden flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-surface border-b border-border-default flex-shrink-0">
        <div className="flex items-center gap-3">
          {label && (
            <span className="text-[10px] text-brand-blue font-bold font-arcade uppercase tracking-wider">
              {label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasAnyComments && (
            <div className="flex items-center gap-3 mr-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-brand-yellow uppercase">
                <MessageSquare className="h-3 w-3" />
                {lineComments.length}
              </span>
              {mode === "review" && (
                <button
                  onClick={() => setShowCommentsInline((prev) => !prev)}
                  className="text-[9px] font-bold text-text-muted hover:text-text-primary transition-colors uppercase underline decoration-dotted underline-offset-2 tracking-wider"
                >
                  {showCommentsInline ? "Hide Comments" : "Show Comments"}
                </button>
              )}
            </div>
          )}
          {!readOnly && (
            <div className="flex items-center bg-bg-elevated rounded-sm p-0.5 border border-border-default">
              <button
                onClick={() => setMode("edit")}
                className={`flex items-center gap-1 px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm transition-all ${
                  mode === "edit"
                    ? "bg-bg-surface text-brand-blue shadow-[1px_1px_0px_rgba(0,0,0,0.1)] border-b border-r border-border-default/50"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={() => setMode("review")}
                className={`flex items-center gap-1 px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm transition-all ${
                  mode === "review"
                    ? "bg-bg-surface text-brand-blue shadow-[1px_1px_0px_rgba(0,0,0,0.1)] border-b border-r border-border-default/50"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Eye className="h-3 w-3" />
                Review
              </button>
            </div>
          )}
          {readOnly && (
            <span className="text-[9px] font-arcade text-text-muted uppercase border border-border-default shadow-[2px_2px_0px_rgba(0,0,0,0.1)] px-2 py-1 rounded-sm bg-bg-base">
              READ ONLY
            </span>
          )}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto max-h-[60vh] min-h-[200px]">
        {mode === "edit" && !readOnly ? (
          /* ── Edit Mode: textarea ── */
          <div className="flex h-full min-h-[200px]" style={{ overflow: 'auto' }}>
            <div
              className="flex-shrink-0 py-4 pl-4 pr-2 text-right select-none font-code text-sm leading-7 text-text-muted sticky left-0 bg-bg-base z-10"
              aria-hidden="true"
            >
              {lines.map((_, i) => {
                const lineNum = i + 1;
                const hasComments = !!commentsByLine[lineNum]?.length;
                return (
                  <div
                    key={i}
                    className="h-7 relative flex items-center justify-end gap-1"
                    onMouseEnter={() => setHoveredLine(lineNum)}
                    onMouseLeave={() => setHoveredLine(null)}
                  >
                    {hoveredLine === lineNum && onAddLineComment && (
                      <button
                        onClick={() => openCommentForm(lineNum)}
                        className="absolute -left-1 w-5 h-5 flex items-center justify-center rounded bg-brand-blue text-bg-base hover:bg-brand-blue/80 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
                        title={`Comment on paragraph ${lineNum}`}
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
                        <MessageSquare className="h-3 w-3 text-brand-yellow drop-shadow-sm" />
                      </button>
                    )}
                    <span>{lineNum}</span>
                  </div>
                );
              })}
            </div>
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                spellCheck={false}
                wrap="off"
                className="w-full h-full py-4 pr-4 pl-2 bg-transparent text-text-primary text-sm sm:text-[15px] leading-7 resize-none outline-none whitespace-pre font-code font-bold"
                style={{
                  minHeight: `${Math.max(lines.length, 10) * 28 + 32}px`,
                  overflowX: 'auto',
                  overflowWrap: 'normal',
                  wordBreak: 'normal',
                }}
              />
            </div>
          </div>
        ) : (
          /* ── Review Mode: line-by-line with inline comments ── */
          <div className="pb-4">
            {lines.map((lineContent, i) => {
              const lineNum = i + 1;
              const lineHasComments = !!commentsByLine[lineNum]?.length;
              const isExpanded = showCommentsInline && expandedLines.has(lineNum);
              const isCommenting = commentingLine === lineNum;
              const isEmpty = lineContent.trim() === "";

              return (
                <Fragment key={i}>
                  {/* Text line row */}
                  <div
                    className="flex group hover:bg-bg-elevated/30 transition-colors"
                    onMouseEnter={() => setHoveredLine(lineNum)}
                    onMouseLeave={() => setHoveredLine(null)}
                  >
                    {/* Gutter */}
                    <div className="flex-shrink-0 w-14 py-0 pl-2 pr-1 text-right select-none font-code text-sm leading-7 text-text-muted relative flex items-start justify-end gap-0.5 pt-0.5">
                      {(hoveredLine === lineNum && onAddLineComment) ? (
                        <button
                          onClick={() => openCommentForm(lineNum)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-brand-blue text-bg-base hover:bg-brand-blue/80 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.2)] mt-1"
                          title={`Comment on paragraph ${lineNum}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      ) : lineHasComments ? (
                        <button
                          onClick={() => {
                        toggleLineExpansion(lineNum);
                        if (!showCommentsInline) setShowCommentsInline(true);
                      }}
                          className="w-5 h-5 flex items-center justify-center rounded transition-colors mt-1"
                          title={`${commentsByLine[lineNum].length} comment(s)`}
                        >
                          <MessageSquare className={`h-3 w-3 ${isExpanded ? "text-brand-yellow drop-shadow-sm" : "text-brand-yellow/60"}`} />
                        </button>
                      ) : (
                        <span className="w-5" />
                      )}
                      <span className="w-6 text-right inline-block mt-0.5">{lineNum}</span>
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0 py-1 pr-4 pl-2">
                      <div className={`text-sm sm:text-[15px] leading-7 text-text-primary whitespace-pre-wrap font-code font-bold ${isEmpty ? "h-7" : ""}`}>
                        {lineContent}
                      </div>
                    </div>
                  </div>

                  {/* Inline comment thread for this line */}
                  {lineHasComments && isExpanded && (
                    <div className="border-y border-brand-yellow/30 bg-bg-elevated/80 ml-14 mr-4 my-1 rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
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

                      {/* Reply form within expanded thread */}
                      {onAddLineComment && !isCommenting && (
                        <button
                          onClick={() => openCommentForm(lineNum)}
                          className="w-full px-4 py-2 text-[10px] uppercase font-bold text-brand-blue hover:text-text-primary hover:bg-brand-blue/10 transition-colors text-left"
                        >
                          Write a reply…
                        </button>
                      )}
                    </div>
                  )}

                  {/* New comment form for this line */}
                  {isCommenting && (
                    <div className="border border-brand-blue/50 bg-bg-elevated/80 ml-14 mr-4 my-1 rounded-sm p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
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
                            placeholder={`COMMENTING ON LINE ${lineNum}...`}
                            className="w-full bg-bg-base border-2 border-border-default rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 outline-none focus:border-brand-blue transition-colors resize-none font-medium"
                            rows={2}
                          />
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                              ⌘ Enter to submit · Esc to cancel
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setCommentingLine(null);
                                  setCommentDraft("");
                                }}
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
          </div>
        )}
      </div>
    </div>
  );
}
