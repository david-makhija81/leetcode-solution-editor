"use client";

import { useState, useRef, useCallback, Fragment, useEffect } from "react";
import { Plus, MessageSquare, Send, Pencil, Eye } from "lucide-react";
import type { LineComment } from "@/lib/types";
import { currentUser } from "@/lib/mock-data";

import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/themes/prism.css";

import { Highlight, themes } from "prism-react-renderer";

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
    (val: string) => {
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

  const highlightWithPrism = (code: string) => {
    const langStr = language.toLowerCase();
    const grammar = Prism.languages[langStr] || Prism.languages.javascript;
    return Prism.highlight(code, grammar, langStr);
  };

  return (
    <div
      className={`relative bg-bg-base rounded-lg border border-border-default overflow-hidden flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-surface border-b border-border-default">
        <div className="flex items-center gap-3">
          {onLanguageChange && !readOnly ? (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="text-xs text-text-primary bg-bg-elevated border border-border-default rounded px-2 py-1 uppercase tracking-wider focus:outline-none focus:border-brand-blue outline-none"
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
            <span className="text-[10px] text-brand-blue font-bold uppercase tracking-wider">
              {language}
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

      {/* Code area */}
      {mode === "edit" && !readOnly ? (
        /* ── Edit Mode: react-simple-code-editor ── */
        <div className="flex overflow-auto max-h-[60vh] flex-1">
          <div
            className="flex-shrink-0 py-4 pl-4 pr-2 text-right select-none font-code text-sm leading-[24px] text-text-muted"
            aria-hidden="true"
          >
            {lines.map((_, i) => {
              const lineNum = i + 1;
              const hasComments = !!commentsByLine[lineNum]?.length;
              return (
                <div
                  key={i}
                  className="h-[24px] relative flex items-center justify-end gap-1"
                  onMouseEnter={() => setHoveredLine(lineNum)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  {hoveredLine === lineNum && onAddLineComment && (
                    <button
                      onClick={() => openCommentForm(lineNum)}
                      className="absolute -left-1 w-5 h-5 flex items-center justify-center rounded bg-brand-blue text-bg-base hover:bg-brand-blue/80 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
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
                      <MessageSquare className="h-3 w-3 text-brand-yellow drop-shadow-sm" />
                    </button>
                  )}
                  <span>{lineNum}</span>
                </div>
              );
            })}
          </div>

          <div className="relative flex-1 min-w-0">
            <Editor
              value={displayValue}
              onValueChange={handleChange}
              highlight={highlightWithPrism}
              padding={{ top: 16, right: 16, bottom: 16, left: 8 }}
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: 14,
                lineHeight: "24px",
                minHeight: `${Math.max(lines.length, 10) * 24 + 32}px`,
              }}
              className="w-full h-full bg-transparent text-text-primary outline-none overflow-x-auto editor-container"
            />
            {/* Scoped styles to remove the default outline from react-simple-code-editor */}
            <style>{`
              .editor-container textarea:focus {
                outline: none !important;
              }
            `}</style>
          </div>
        </div>
      ) : (
        /* ── Review Mode: line-by-line with inline comments via prism-react-renderer ── */
        <div className="overflow-auto max-h-[60vh] flex-1">
          <Highlight
            theme={themes.github}
            code={displayValue || ""}
            language={language as any}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <div className={className} style={{ ...style, backgroundColor: "transparent", paddingTop: "1rem", paddingBottom: "1rem" }}>
                {tokens.map((lineTokens, i) => {
                  const lineNum = i + 1;
                  const lineHasComments = !!commentsByLine[lineNum]?.length;
                  const isExpanded = showCommentsInline && expandedLines.has(lineNum);
                  const isCommenting = commentingLine === lineNum;

                  return (
                    <Fragment key={i}>
                      {/* Code line row */}
                      <div
                        {...getLineProps({ line: lineTokens, key: i })}
                        className="flex group hover:bg-bg-elevated/30 transition-colors"
                        onMouseEnter={() => setHoveredLine(lineNum)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        {/* Gutter */}
                        <div className="flex-shrink-0 w-14 py-0 pl-2 pr-1 text-right select-none font-code text-sm leading-[24px] text-text-muted relative flex items-center justify-end gap-0.5">
                          {(hoveredLine === lineNum && onAddLineComment) ? (
                            <button
                              onClick={() => openCommentForm(lineNum)}
                              className="w-5 h-5 flex items-center justify-center rounded bg-brand-blue text-bg-base hover:bg-brand-blue/80 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
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
                              <MessageSquare className={`h-3 w-3 ${isExpanded ? "text-brand-yellow drop-shadow-sm" : "text-brand-yellow/60"}`} />
                            </button>
                          ) : (
                            <span className="w-5" />
                          )}
                          <span className="w-6 text-right inline-block">{lineNum}</span>
                        </div>

                        {/* Code content */}
                        <div className="flex-1 min-w-0 py-0 pr-4 pl-2">
                          <pre className="font-code text-sm leading-[24px] whitespace-pre overflow-x-auto m-0">
                            {lineTokens.map((token, key) => (
                              <span key={key} {...getTokenProps({ token, key })} />
                            ))}
                            {lineTokens.length === 0 || (lineTokens.length === 1 && lineTokens[0].content === "") ? "\n" : null}
                          </pre>
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
          </Highlight>
        </div>
      )}
    </div>
  );
}
