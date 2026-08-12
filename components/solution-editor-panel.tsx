"use client";

import { useState, useEffect } from "react";
import { Plus, Code, Lightbulb, Route, Timer, Trash2, Users, User, Send, Check, X, ClipboardList, HelpCircle } from "lucide-react";
import { CodeEditor } from "@/components/ui/code-editor";
import { TextEditor } from "@/components/ui/text-editor";
import { ClarityQuestionsEditor } from "@/components/ui/clarity-questions-editor";
import { ComplexityEditor } from "@/components/ui/complexity-editor";
import { CommentSidebar } from "@/components/comment-sidebar";
import { createSolutionSet, updateSolutionSet, deleteSolutionSet, assignReviewer } from "@/app/actions/solutions";
import { getAllUsers } from "@/app/actions/users";
import { useSearchParams } from "next/navigation";
import type { SolutionSet, Comment } from "@/lib/types";

interface SolutionEditorPanelProps {
  problemId: string;
  currentUser: any;
  solutions: SolutionSet[];
  comments: Comment[];
  onAddComment: (solutionSetId: string, field: "code" | "intuition" | "approach" | "complexity" | "clarityQuestions", line: number, content: string) => void;
}

type FieldTab = "code" | "intuition" | "approach" | "complexity" | "clarityQuestions";

const fieldTabs: { id: FieldTab; label: string; icon: React.ReactNode }[] = [
  { id: "clarityQuestions", label: "Clarity Questions", icon: <HelpCircle className="h-4 w-4" /> },
  { id: "intuition", label: "Intuition", icon: <Lightbulb className="h-4 w-4" /> },
  { id: "approach", label: "Approach", icon: <Route className="h-4 w-4" /> },
  { id: "code", label: "Code", icon: <Code className="h-4 w-4" /> },
  { id: "complexity", label: "Complexity", icon: <Timer className="h-4 w-4" /> },
];

export function SolutionEditorPanel({ problemId, currentUser, solutions, comments, onAddComment }: SolutionEditorPanelProps) {
  const searchParams = useSearchParams();
  const assignedSolutionId = searchParams.get("solutionId");

  const [view, setView] = useState<"mine" | "peers" | "assigned">("mine");
  const [activeSolutionIndex, setActiveSolutionIndex] = useState(0);
  const [activeField, setActiveField] = useState<FieldTab>("clarityQuestions");
  const [solutionData, setSolutionData] = useState(solutions);
  const [solutionIdToDelete, setSolutionIdToDelete] = useState<string | null>(null);
  
  const [showReviewPicker, setShowReviewPicker] = useState(false);
  const [peerUsers, setPeerUsers] = useState<any[]>([]);
  const [selectedReviewerId, setSelectedReviewerId] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);

  useEffect(() => {
    if (assignedSolutionId && solutions.length > 0) {
      const mySol = solutions.filter(s => s.authorId === currentUser?.id);
      const peerSol = solutions.filter(s => s.authorId !== currentUser?.id);
      const assignedSol = solutions.filter(s => s.reviewerId === currentUser?.id);

      const assignedIndex = assignedSol.findIndex(s => s.id === assignedSolutionId);
      if (assignedIndex !== -1) {
        setView("assigned");
        setActiveSolutionIndex(assignedIndex);
      } else {
        const peerIndex = peerSol.findIndex(s => s.id === assignedSolutionId);
        if (peerIndex !== -1) {
          setView("peers");
          setActiveSolutionIndex(peerIndex);
        } else {
          const myIndex = mySol.findIndex(s => s.id === assignedSolutionId);
          if (myIndex !== -1) {
            setView("mine");
            setActiveSolutionIndex(myIndex);
          }
        }
      }
    }
  }, [assignedSolutionId, solutions, currentUser?.id]);

  // Sync state with props when data is refreshed from server
  useEffect(() => {
    setSolutionData(solutions);
  }, [solutions]);

  useEffect(() => {
    if (showReviewPicker && peerUsers.length === 0) {
      getAllUsers().then(res => {
        if (res.success && res.users) {
          setPeerUsers(res.users.filter((u: any) => u.id !== currentUser?.id));
        }
      });
    }
  }, [showReviewPicker, currentUser?.id, peerUsers.length]);

  const displayedSolutions = solutionData.filter(s => {
    if (view === "mine") return s.authorId === currentUser?.id;
    if (view === "assigned") return s.reviewerId === currentUser?.id;
    return s.authorId !== currentUser?.id;
  });
  const activeSolution = displayedSolutions[activeSolutionIndex];

  function handleViewChange(newView: "mine" | "peers" | "assigned") {
    setView(newView);
    setActiveSolutionIndex(0);
    setActiveField("clarityQuestions");
  }

  async function updateField(field: keyof SolutionSet, value: string) {
    if (!activeSolution) return;
    
    // Optimistic UI update
    setSolutionData((prev) =>
      prev.map((s) => (s.id === activeSolution.id ? { ...s, [field]: value } : s))
    );

    try {
      await updateSolutionSet(activeSolution.id, { [field]: value });
    } catch (error) {
      console.error("Failed to update field", error);
    }
  }

  async function handleAddSolution() {
    if (!currentUser) return;
    
    try {
      const savedSol = await createSolutionSet({
        problemId,
        authorId: currentUser.id,
        label: `Solution ${displayedSolutions.length + 1}`,
        language: "python",
        code: "",
        intuition: "",
        approach: "",
        complexity: JSON.stringify([
          { label: "Worst Case Time Complexity", value: "" },
          { label: "Worst Case Space Complexity", value: "" },
        ]),
        clarityQuestions: "[]",
      });

      // Optimistic update using returned data
      setSolutionData((prev) => [...prev, {
        ...savedSol,
        authorName: currentUser.fullName || currentUser.username || "Anonymous",
        createdAt: savedSol.createdAt.toISOString()
      } as unknown as SolutionSet]);
      
      setView("mine");
      setActiveSolutionIndex(displayedSolutions.length);
      setActiveField("clarityQuestions");
    } catch (error) {
      console.error("Failed to create solution", error);
    }
  }

  function confirmDelete(id: string) {
    setSolutionIdToDelete(id);
  }

  async function executeDelete() {
    if (!solutionIdToDelete) return;
    const id = solutionIdToDelete;
    
    // Optimistic UI update
    setSolutionData((prev) => prev.filter((s) => s.id !== id));
    setActiveSolutionIndex((prev) => Math.max(0, prev - 1));
    setSolutionIdToDelete(null);

    try {
      await deleteSolutionSet(id);
    } catch (error) {
      console.error("Failed to delete solution", error);
    }
  }

  async function handleAssignReviewer() {
    if (!activeSolution || !selectedReviewerId) return;
    try {
      await assignReviewer(activeSolution.id, selectedReviewerId);
      
      // Optimistically update the solution's reviewer
      const reviewer = peerUsers.find(u => u.id === selectedReviewerId);
      if (reviewer) {
        setSolutionData(prev => prev.map(s => 
          s.id === activeSolution.id ? { ...s, reviewerId: reviewer.id, reviewer } : s
        ));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setShowReviewPicker(false);
    }
  }

  return (
    <div className="h-full flex flex-col bg-bg-surface/90 backdrop-blur-sm">
      {/* View Toggle - Arcade Style */}
      <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-border-default bg-brand-yellow/10">
        <button
          onClick={() => handleViewChange("mine")}
          className={`flex items-center gap-1.5 px-4 py-2 border-2 border-text-primary font-arcade text-[9px] uppercase transition-all duration-150 rounded-sm ${
            view === "mine"
              ? "bg-bg-surface text-text-primary translate-y-[3px] shadow-[1px_1px_0px_rgba(0,0,0,1)]"
              : "bg-text-primary text-bg-base shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]"
          }`}
        >
          <User className="h-3 w-3" />
          My Solutions
        </button>
        <button
          onClick={() => handleViewChange("peers")}
          className={`flex items-center gap-1.5 px-4 py-2 border-2 border-text-primary font-arcade text-[9px] uppercase transition-all duration-150 rounded-sm ${
            view === "peers"
              ? "bg-bg-surface text-text-primary translate-y-[3px] shadow-[1px_1px_0px_rgba(0,0,0,1)]"
              : "bg-text-primary text-bg-base shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]"
          }`}
        >
          <Users className="h-3 w-3" />
          Peers' Solutions
        </button>
        <button
          onClick={() => handleViewChange("assigned")}
          className={`flex items-center gap-1.5 px-4 py-2 border-2 border-text-primary font-arcade text-[9px] uppercase transition-all duration-150 rounded-sm ${
            view === "assigned"
              ? "bg-bg-surface text-text-primary translate-y-[3px] shadow-[1px_1px_0px_rgba(0,0,0,1)]"
              : "bg-text-primary text-bg-base shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]"
          }`}
        >
          <ClipboardList className="h-3 w-3" />
          Pending for review
        </button>
      </div>

      {/* Solution set tabs */}
      <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-border-default bg-bg-surface overflow-x-auto">
        {displayedSolutions.map((sol, i) => (
          <div
            key={sol.id}
            onClick={() => {
              setActiveSolutionIndex(i);
              setActiveField("clarityQuestions");
            }}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-sm border-2 transition-all duration-150 cursor-pointer ${
              i === activeSolutionIndex
                ? "bg-bg-elevated text-brand-blue border-brand-blue shadow-[2px_2px_0px_rgba(59,130,246,0.3)]"
                : "text-text-secondary border-transparent hover:border-border-default hover:bg-bg-base"
            }`}
          >
            {i === activeSolutionIndex && view === "mine" ? (
              <>
                <input
                  value={sol.label}
                  onChange={(e) => updateField("label", e.target.value)}
                  className="bg-transparent outline-none w-28 text-brand-blue border-b-2 border-brand-blue/50 focus:border-brand-blue"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(sol.id);
                  }}
                  className="p-1 ml-1 text-text-muted hover:text-brand-red hover:bg-brand-red/10 rounded-sm transition-colors"
                  title="Delete solution"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <span>{sol.label}</span>
            )}
          </div>
        ))}
        {view === "mine" && (
          <button
            onClick={handleAddSolution}
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1.5 text-xs text-text-muted hover:text-brand-green border-2 border-dashed border-border-default hover:border-brand-green transition-colors rounded-sm hover:bg-brand-green/5 ml-1"
            title="Add new solution"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
          </button>
        )}
      </div>

      {activeSolution ? (
        <>
          {/* Field tabs */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b-2 border-border-default bg-bg-surface overflow-x-auto">
            {fieldTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveField(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[9px] font-arcade uppercase rounded-sm transition-all duration-150 whitespace-nowrap border-2 ${
                  activeField === tab.id
                    ? "bg-brand-blue border-text-primary text-bg-surface shadow-[2px_2px_0px_rgba(0,0,0,1)] translate-y-[1px]"
                    : "bg-transparent border-transparent text-text-muted hover:text-text-primary hover:bg-bg-elevated hover:border-border-default"
                }`}
              >
                <div className="hidden sm:block">{tab.icon}</div>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor area */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeField === "clarityQuestions" && (
              <ClarityQuestionsEditor
                value={activeSolution.clarityQuestions || "[]"}
                onChange={view === "mine" ? (v) => updateField("clarityQuestions", v) : undefined}
                readOnly={view !== "mine"}
                lineComments={comments.filter((c) => c.solutionSetId === activeSolution.id && c.field === "clarityQuestions")}
                onAddLineComment={(line, content) => onAddComment(activeSolution.id, "clarityQuestions", line, content)}
              />
            )}
            {activeField === "intuition" && (
              <TextEditor
                value={activeSolution.intuition}
                onChange={view === "mine" ? (v) => updateField("intuition", v) : undefined}
                label="Intuition"
                placeholder={view === "mine" ? "What's the key insight behind this solution?" : ""}
                readOnly={view !== "mine"}
                lineComments={comments.filter((c) => c.solutionSetId === activeSolution.id && c.field === "intuition")}
                onAddLineComment={(line, content) => onAddComment(activeSolution.id, "intuition", line, content)}
              />
            )}
            {activeField === "approach" && (
              <TextEditor
                value={activeSolution.approach}
                onChange={view === "mine" ? (v) => updateField("approach", v) : undefined}
                label="Approach"
                placeholder={view === "mine" ? "Describe the step-by-step approach..." : ""}
                readOnly={view !== "mine"}
                lineComments={comments.filter((c) => c.solutionSetId === activeSolution.id && c.field === "approach")}
                onAddLineComment={(line, content) => onAddComment(activeSolution.id, "approach", line, content)}
              />
            )}
            {activeField === "code" && activeSolution && (
              <CodeEditor
                value={activeSolution.code}
                onChange={view === "mine" ? (v) => updateField("code", v) : undefined}
                language={activeSolution.language}
                onLanguageChange={view === "mine" ? (v) => updateField("language", v) : undefined}
                readOnly={view !== "mine"}
                lineComments={comments.filter((c) => c.solutionSetId === activeSolution.id && c.field === "code")}
                onAddLineComment={(line, content) => onAddComment(activeSolution.id, "code", line, content)}
              />
            )}
            {activeField === "complexity" && (
              <ComplexityEditor
                value={activeSolution.complexity}
                onChange={view === "mine" ? (v) => updateField("complexity", v) : undefined}
                readOnly={view !== "mine"}
                lineComments={comments.filter((c) => c.solutionSetId === activeSolution.id && c.field === "complexity")}
                onAddLineComment={(line, content) => onAddComment(activeSolution.id, "complexity", line, content)}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t-2 border-border-default bg-brand-blue/5 flex items-center justify-between text-xs text-text-secondary font-medium">
            <span className="flex items-center gap-1.5">
              by <span className="font-bold text-text-primary">{activeSolution.authorName}</span>
            </span>
            <div className="flex items-center gap-3">
              {activeSolution.reviewer ? (
                <span className={`flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.1)] ${
                  activeSolution.reviewerId === currentUser?.id 
                    ? "bg-brand-green/20 text-brand-green border-brand-green/50" 
                    : "bg-bg-elevated text-brand-blue border-brand-blue/30"
                }`}>
                  <Check className="h-3 w-3" strokeWidth={3} />
                  {activeSolution.reviewerId === currentUser?.id ? "Assigned to You" : `Assigned to ${activeSolution.reviewer.name}`}
                </span>
              ) : null}
              {view === "mine" && (
                <button
                  onClick={() => {
                    setSelectedReviewerId(activeSolution.reviewerId || null);
                    setShowReviewPicker(true);
                  }}
                  className="btn-arcade bg-bg-surface !py-1.5 !px-3 !text-[9px] hover:text-brand-blue"
                >
                  <Send className="h-3 w-3 mr-1" />
                  {activeSolution.reviewer ? "Change Reviewer" : "Request Review"}
                </button>
              )}
              <span className="opacity-60">
                {new Date(activeSolution.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Code className="h-10 w-10 text-text-muted/30 mx-auto mb-3" />
            <p className="text-sm text-text-muted">
              {view === "mine" 
                ? "No solutions yet" 
                : view === "assigned"
                  ? "No solutions assigned to you"
                  : "No peer solutions available"}
            </p>
            {view === "mine" && (
              <p className="text-xs text-text-muted/60 mt-1">
                Click the + button to add your first solution
              </p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {solutionIdToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-surface border border-border-default rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Delete Solution?</h3>
            <p className="text-sm text-text-muted mb-6">
              Are you sure you want to delete "{solutionData.find(s => s.id === solutionIdToDelete)?.label}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSolutionIdToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 text-sm font-medium bg-state-error/15 text-state-error hover:bg-state-error/25 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviewer Picker Modal */}
      {showReviewPicker && activeSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-surface border border-border-default rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Request Review</h3>
              <button
                onClick={() => setShowReviewPicker(false)}
                className="p-1 text-text-muted hover:text-text-primary rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-text-muted mb-4">
              Select a peer to review your solution:
            </p>
            
            {peerUsers.length === 0 ? (
              <div className="text-sm text-text-muted/70 italic text-center py-4">No other users have registered on this platform yet.</div>
            ) : (
              <div className="space-y-1 mb-6 max-h-60 overflow-y-auto">
                {peerUsers.map((peer) => {
                  const isSelected = selectedReviewerId === peer.id;
                  return (
                    <button
                      key={peer.id}
                      onClick={() => {
                        setSelectedReviewerId(isSelected ? null : peer.id);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-accent-primary/10 border border-accent-primary/30"
                          : "hover:bg-bg-elevated border border-transparent"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {peer.avatar ? (
                        <img src={peer.avatar} alt={peer.name} className="h-8 w-8 rounded-full border border-border-default" />
                      ) : (
                        <div className="h-8 w-8 rounded-full border border-border-default bg-bg-elevated flex items-center justify-center text-xs text-text-muted uppercase">
                          {peer.name?.slice(0,2) || "??"}
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-text-primary">{peer.name}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-accent-primary border-accent-primary"
                          : "border-border-default"
                      }`}>
                        {isSelected && <Check className="h-3 w-3 text-bg-base" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewPicker(false)}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignReviewer}
                disabled={!selectedReviewerId}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent-primary text-bg-base rounded-lg hover:bg-accent-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment sidebar */}
      {activeSolution && (
        <CommentSidebar
          comments={comments.filter((c) => c.solutionSetId === activeSolution.id && c.field === activeField)}
          isOpen={commentsOpen}
          onToggle={() => setCommentsOpen((o) => !o)}
        />
      )}
    </div>
  );
}
