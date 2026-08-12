"use client";

import { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Star,
  BarChart3,
  Code2,
  TrendingUp,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/navbar";
import { ProblemCard } from "@/components/problem-card";
import type { ProblemStatus } from "@/lib/types";

type FilterTab = "all" | ProblemStatus | "assigned";

const filterTabs: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All Problems", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "unsolved", label: "Unsolved", icon: <Circle className="h-4 w-4" /> },
  { id: "solved", label: "Solved", icon: <CheckCircle2 className="h-4 w-4" /> },
  { id: "in-review", label: "In Review", icon: <Clock className="h-4 w-4" /> },
  { id: "reviewed", label: "Reviewed", icon: <Star className="h-4 w-4" /> },
  { id: "assigned", label: "Assigned to Me", icon: <CheckCircle2 className="h-4 w-4" /> },
];

export function Dashboard({ problems }: { problems: any[] }) {
  const { user } = useUser();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      let matchesFilter = false;
      if (activeFilter === "all") {
        matchesFilter = true;
      } else if (activeFilter === "assigned") {
        matchesFilter = p.solutions?.some((s: any) => s.reviewerId === user?.id);
      } else {
        matchesFilter = p.status === activeFilter;
      }

      const matchesSearch =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.number.toString().includes(searchQuery) ||
        (Array.isArray(p.tags) 
          ? p.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
          : (typeof p.tags === 'string' ? p.tags.split(", ") : []).some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery, problems, user?.id]);

  const stats = useMemo(() => {
    const total = problems.length;
    const solved = problems.filter((p) => p.status === "solved").length;
    const inReview = problems.filter((p) => p.status === "in-review").length;
    const reviewed = problems.filter((p) => p.status === "reviewed").length;
    return { total, solved, inReview, reviewed };
  }, [problems]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Code2 className="h-5 w-5 text-accent-primary" />}
            label="Total Problems"
            value={stats.total}
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5 text-state-success" />}
            label="Solved"
            value={stats.solved}
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-state-warning" />}
            label="In Review"
            value={stats.inReview}
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-accent-primary" />}
            label="Reviewed"
            value={stats.reviewed}
          />
        </div>

        {/* Filter tabs + search */}
        <div className="flex flex-col items-stretch gap-4 mb-6">
          <div className="flex items-center justify-between w-full gap-1 sm:gap-1.5 bg-bg-surface p-1.5 rounded-sm border-2 border-border-default shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
            {filterTabs.map((tab) => {
              const count =
                tab.id === "all"
                  ? problems.length
                  : tab.id === "assigned"
                  ? problems.filter((p) => p.solutions?.some((s: any) => s.reviewerId === user?.id)).length
                  : problems.filter((p) => p.status === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`
                    flex flex-1 min-w-0 items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-3 py-2 text-[6px] sm:text-[9px] font-arcade uppercase rounded-sm transition-all duration-150 border-2
                    ${
                      activeFilter === tab.id
                        ? "bg-brand-blue border-text-primary text-bg-surface shadow-[2px_2px_0px_rgba(0,0,0,1)] translate-y-[1px]"
                        : "bg-transparent border-transparent text-text-muted hover:text-text-primary hover:bg-bg-elevated hover:border-border-default"
                    }
                  `}
                  title={tab.label}
                >
                  <div className="hidden lg:block flex-shrink-0">{tab.icon}</div>
                  <span className="truncate">{tab.label}</span>
                  <span
                    className={`ml-0.5 sm:ml-1 text-[6px] sm:text-[8px] flex-shrink-0 ${
                      activeFilter === tab.id
                        ? "text-bg-surface/80"
                        : "text-text-muted/60"
                    }`}
                  >
                    [{count}]
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" strokeWidth={3} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH PROBLEMS..."
                className="w-full pl-9 pr-4 py-2 bg-bg-surface border-2 border-border-default rounded-sm text-sm font-arcade uppercase text-text-primary placeholder:text-text-muted/40 outline-none focus:border-brand-blue focus:shadow-[4px_4px_0px_rgba(59,130,246,0.2)] shadow-[4px_4px_0px_rgba(0,0,0,0.05)] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Problem grid */}
        {filteredProblems.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Search className="h-10 w-10 text-text-muted/20 mx-auto mb-3" />
              <p className="text-sm text-text-muted">No problems found</p>
              <p className="text-xs text-text-muted/60 mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProblems.map((problem) => {
              const assignedSolution = activeFilter === "assigned" 
                ? problem.solutions?.find((s: any) => s.reviewerId === user?.id)
                : undefined;
              return (
                <ProblemCard 
                  key={problem.id} 
                  problem={{...problem, tags: typeof problem.tags === 'string' ? problem.tags.split(", ") : problem.tags}} 
                  assignedSolutionId={assignedSolution?.id}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-bg-surface rounded-sm border-2 border-border-default shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
      <div className="flex-shrink-0 p-2 bg-bg-elevated rounded-sm border-2 border-border-default/50">{icon}</div>
      <div>
        <p className="text-xl font-arcade text-text-primary">{value}</p>
        <p className="text-[8px] font-arcade uppercase text-text-secondary mt-1 tracking-wider">{label}</p>
      </div>
    </div>
  );
}
