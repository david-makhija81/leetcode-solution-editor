import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { ProblemPageClient } from "@/components/problem-page-client";

import { ensureProblemStatement } from "@/app/actions/problems";

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: problemId } = await params;
  
  let problem = null;
  try {
    const result = await ensureProblemStatement(problemId);
    problem = result.problem;
  } catch (e) {
    console.error("Error loading problem:", e);
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar
          breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Not Found" }]}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-text-muted">Problem not found</p>
            <p className="text-sm text-text-muted/60 mt-1">
              The problem you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const solutions = await prisma.solutionSet.findMany({
    where: { problemId: problem.id },
    include: {
      author: true,
      reviewer: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Map Prisma models to expected format for the frontend
  const mappedSolutions = solutions.map((s: any) => ({
    ...s,
    authorName: s.author?.name || "Anonymous",
  }));

  return <ProblemPageClient problem={problem} initialSolutions={mappedSolutions} />;
}
