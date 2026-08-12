"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { currentUser } from "@clerk/nextjs/server";

export async function createSolutionSet(data: {
  problemId: string;
  authorId: string;
  label: string;
  language: string;
  code: string;
  intuition: string;
  approach: string;
  complexity: string;
  clarityQuestions?: string;
}) {
  const user = await currentUser();
  if (user) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.fullName || user.username || "Anonymous",
        email: user.emailAddresses[0]?.emailAddress || "",
        avatar: user.imageUrl,
      },
      create: {
        id: user.id,
        name: user.fullName || user.username || "Anonymous",
        email: user.emailAddresses[0]?.emailAddress || "",
        avatar: user.imageUrl,
      }
    });
  }

  const solution = await prisma.solutionSet.create({
    data: {
      problemId: data.problemId,
      authorId: data.authorId,
      label: data.label,
      language: data.language,
      code: data.code,
      intuition: data.intuition,
      approach: data.approach,
      complexity: data.complexity,
      clarityQuestions: data.clarityQuestions || "[]",
    },
  });

  if (data.code && data.code.trim().length > 0) {
    const problem = await prisma.problem.findUnique({ where: { id: data.problemId } });
    if (problem && problem.status === "unsolved") {
      await prisma.problem.update({
        where: { id: data.problemId },
        data: { status: "solved" },
      });
    }
  }

  revalidatePath(`/problems/${data.problemId}`);
  revalidatePath(`/`);
  return solution;
}

export async function updateSolutionSet(
  id: string,
  data: {
    label?: string;
    language?: string;
    code?: string;
    intuition?: string;
    approach?: string;
    complexity?: string;
    clarityQuestions?: string;
  }
) {
  const solution = await prisma.solutionSet.update({
    where: { id },
    data,
  });

  if (data.code && data.code.trim().length > 0) {
    const problem = await prisma.problem.findUnique({ where: { id: solution.problemId } });
    if (problem && problem.status === "unsolved") {
      await prisma.problem.update({
        where: { id: solution.problemId },
        data: { status: "solved" },
      });
    }
  }

  revalidatePath(`/problems/${solution.problemId}`);
  revalidatePath(`/`);
  return solution;
}

export async function deleteSolutionSet(id: string) {
  const solution = await prisma.solutionSet.delete({
    where: { id },
  });

  revalidatePath(`/problems/${solution.problemId}`);
  return solution;
}

export async function assignReviewer(solutionId: string, reviewerId: string) {
  const solution = await prisma.solutionSet.update({
    where: { id: solutionId },
    data: {
      reviewerId,
    },
    include: {
      problem: true,
      reviewer: true,
    }
  });

  // Mark the parent problem as in-review
  await prisma.problem.update({
    where: { id: solution.problemId },
    data: { status: "in-review" }
  });

  revalidatePath(`/problems/${solution.problemId}`);
  revalidatePath(`/`); // Update dashboard
  return solution;
}
