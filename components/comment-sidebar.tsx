"use client";

import { useState } from "react";
import { MessageSquare, X, Code, Lightbulb, Route, Timer } from "lucide-react";
import type { Comment } from "@/lib/types";

interface CommentSidebarProps {
  comments: Comment[];
  isOpen: boolean;
  onToggle: () => void;
}

const fieldIcons: Record<string, React.ReactNode> = {
  code: <Code className="h-3 w-3" />,
  intuition: <Lightbulb className="h-3 w-3" />,
  approach: <Route className="h-3 w-3" />,
  complexity: <Timer className="h-3 w-3" />,
};

const fieldLabels: Record<string, string> = {
  code: "Code",
  intuition: "Intuition",
  approach: "Approach",
  complexity: "Complexity",
};

export function CommentSidebar({
  comments,
  isOpen,
  onToggle,
}: CommentSidebarProps) {
  const [newComment, setNewComment] = useState("");

  return (
    <>
      {/* Toggle button (always visible) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-4 top-18 z-40 flex items-center gap-1.5 px-3 py-2 bg-bg-surface border border-border-default rounded-lg text-text-muted hover:text-accent-primary hover:border-border-active transition-all shadow-lg"
          title="Show comments"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs font-medium">{comments.length}</span>
        </button>
      )}

      {/* Sidebar panel */}
      <div
        className={`
          fixed top-14 right-0 h-[calc(100vh-3.5rem)] w-80
          bg-bg-surface border-l border-border-default
          flex flex-col z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-accent-primary" />
            <span className="text-sm font-medium text-text-primary">
              Comments
            </span>
            <span className="text-xs text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded-sm">
              {comments.length}
            </span>
          </div>
          <button
            onClick={onToggle}
            className="p-1 text-text-muted hover:text-text-primary transition-colors rounded-sm hover:bg-bg-elevated"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto">
          {comments.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-6">
                <MessageSquare className="h-8 w-8 text-text-muted/20 mx-auto mb-2" />
                <p className="text-sm text-text-muted">No comments yet</p>
                <p className="text-xs text-text-muted/60 mt-1">
                  Comments from mentors and peers will appear here
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border-default">
              {comments.map((comment) => (
                <div key={comment.id} className="px-4 py-3 hover:bg-bg-elevated/30 transition-colors">
                  {/* Comment header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 rounded-full overflow-hidden flex-shrink-0 bg-bg-elevated">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="h-full w-full"
                      />
                    </div>
                    <span className="text-xs font-medium text-text-primary">
                      {comment.authorName}
                    </span>
                    <span className="text-xs text-text-muted ml-auto">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Line/field reference */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs text-accent-primary bg-accent-primary/10 px-1.5 py-0.5 rounded-sm">
                      {fieldIcons[comment.field]}
                      {fieldLabels[comment.field]}
                      <span className="text-accent-primary/70">
                        :L{comment.line}
                      </span>
                    </span>
                  </div>

                  {/* Comment body */}
                  <p className="text-xs text-text-primary/80 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New comment input */}
        <div className="p-3 border-t border-border-default bg-bg-surface">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 bg-bg-base border border-border-default rounded-lg text-sm text-text-primary placeholder:text-text-muted/50 outline-none focus:border-accent-primary/50 transition-colors"
            />
            <button
              className="px-3 py-2 bg-accent-primary/15 text-accent-primary text-xs font-medium rounded-lg hover:bg-accent-primary/25 transition-colors disabled:opacity-40"
              disabled={!newComment.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
