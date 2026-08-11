"use server";

import { prisma } from "@/lib/prisma";
import { fetchAllLeetCodeProblems, fetchLeetCodeProblemDetails } from "@/lib/leetcode";
import { revalidatePath } from "next/cache";

export async function syncAllLeetCodeProblems() {
  try {
    const problems = await fetchAllLeetCodeProblems(5000); // 5000 should cover all current problems
    
    // We'll process them in batches to avoid overwhelming the database
    const batchSize = 100;
    let synced = 0;

    for (let i = 0; i < problems.length; i += batchSize) {
      const batch = problems.slice(i, i + batchSize);
      
      const upserts = batch.map(p => 
        prisma.problem.upsert({
          where: { id: p.titleSlug },
          update: {
            title: p.title,
            difficulty: p.difficulty,
            tags: p.topicTags.map(t => t.name).join(", "),
            // We don't overwrite statement if it already exists, so we leave it out of update
          },
          create: {
            id: p.titleSlug,
            number: parseInt(p.frontendQuestionId, 10) || 0,
            title: p.title,
            difficulty: p.difficulty,
            tags: p.topicTags.map(t => t.name).join(", "),
            statement: "", // Initially empty, will lazy load when requested
            status: "unsolved",
          }
        })
      );

      await prisma.$transaction(upserts);
      synced += batch.length;
    }

    revalidatePath("/");
    return { success: true, count: synced };
  } catch (error) {
    console.error("Failed to sync problems:", error);
    throw new Error("Failed to sync problems from LeetCode");
  }
}

export async function ensureProblemStatement(problemId: string) {
  // Check if problem statement is already populated
  const problem = await prisma.problem.findUnique({
    where: { id: problemId }
  });

  if (problem && problem.statement && problem.statement.trim() !== "") {
    // Already populated
    return { success: true, updated: false, problem };
  }

  // Not populated, fetch from LeetCode
  try {
    const details = await fetchLeetCodeProblemDetails(problemId);
    if (!details) {
      throw new Error("Could not find problem details for " + problemId);
    }

    const updated = await prisma.problem.upsert({
      where: { id: problemId },
      update: {
        statement: details.content || "",
      },
      create: {
        id: details.titleSlug,
        number: parseInt(details.questionFrontendId, 10) || 0,
        title: details.title,
        difficulty: details.difficulty,
        tags: details.topicTags.map(t => t.name).join(", "),
        statement: details.content || "",
        status: "unsolved",
      }
    });

    return { success: true, updated: true, problem: updated };
  } catch (error) {
    console.error("Failed to load problem statement:", error);
    throw new Error("Failed to load problem statement from LeetCode");
  }
}
