"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { ProblemStatement } from "@/components/problem-statement";
import { SolutionEditorPanel } from "@/components/solution-editor-panel";
import type { Problem, SolutionSet, Comment } from "@/lib/types";
import { createComment } from "@/app/actions/comments";
import { useUser } from "@clerk/nextjs";

interface ProblemPageClientProps {
  problem: any;
  initialSolutions: any[];
}

export function ProblemPageClient({ problem, initialSolutions }: ProblemPageClientProps) {
  const { user } = useUser();
  const [dividerPosition, setDividerPosition] = useState(40); // percentage
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // We manage comments state to allow instant optimistic updates
  const [comments, setComments] = useState<any[]>(
    initialSolutions.flatMap((s) => s.comments || [])
  );

  async function handleAddComment(
    solutionSetId: string,
    field: "code" | "intuition" | "approach" | "complexity" | "clarityQuestions",
    line: number,
    content: string
  ) {
    if (!user) return;
    
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const newComment = {
      id: tempId,
      solutionSetId,
      field,
      line,
      content,
      authorId: user.id,
      author: {
        name: user.fullName || user.username || "Anonymous",
        avatar: user.imageUrl,
      },
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);

    try {
      // Call server action
      const savedComment = await createComment({
        solutionSetId,
        authorId: user.id,
        field,
        line,
        content,
      });
      
      // Update with real ID
      setComments((prev) => 
        prev.map((c) => c.id === tempId ? savedComment : c)
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Revert optimistic update
      setComments((prev) => prev.filter((c) => c.id !== tempId));
    }
  }

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setDividerPosition(Math.max(20, Math.min(70, pct)));
    }

    function handleMouseUp() {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: `#${problem.number} ${problem.title}` },
        ]}
      />

      <div
        ref={containerRef}
        className="flex-1 flex overflow-hidden"
      >
        {/* Problem statement panel */}
        <div
          className="h-full overflow-hidden"
          style={{ width: `${dividerPosition}%` }}
        >
          <ProblemStatement problem={{...problem, tags: typeof problem.tags === 'string' ? problem.tags.split(", ") : problem.tags}} />
        </div>

        {/* Resizable divider */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 flex-shrink-0 bg-border-default hover:bg-accent-primary/50 cursor-col-resize transition-colors relative group"
        >
          <div className="absolute inset-y-0 -left-1 -right-1 z-10" />
          {/* Drag handle dots */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-1 rounded-full bg-accent-primary" />
            <div className="w-1 h-1 rounded-full bg-accent-primary" />
            <div className="w-1 h-1 rounded-full bg-accent-primary" />
          </div>
        </div>

        {/* Solution editor panel */}
        <div
          className="h-full overflow-hidden"
          style={{ width: `${100 - dividerPosition}%` }}
        >
          <SolutionEditorPanel 
            problemId={problem.id}
            currentUser={user}
            solutions={initialSolutions} 
            comments={comments.map(c => ({
              ...c,
              authorName: c.author?.name || c.authorName || "Anonymous",
              authorAvatar: c.author?.avatar || c.authorAvatar || "",
            }))} 
            onAddComment={handleAddComment} 
          />
        </div>
      </div>
    </div>
  );
}
