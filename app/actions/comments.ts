"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { currentUser } from "@clerk/nextjs/server";

export async function createComment(data: {
  solutionSetId: string;
  authorId: string;
  field: string;
  line: number;
  content: string;
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

  const comment = await prisma.comment.create({
    data: {
      solutionSetId: data.solutionSetId,
      authorId: data.authorId,
      field: data.field,
      line: data.line,
      content: data.content,
    },
    include: {
      author: true, // we need the author details to render the comment
    }
  });

  const solution = await prisma.solutionSet.findUnique({
    where: { id: data.solutionSetId }
  });

  if (solution) {
    revalidatePath(`/problems/${solution.problemId}`);
  }
  
  return comment;
}

export async function deleteComment(id: string) {
  const comment = await prisma.comment.delete({
    where: { id },
    include: {
      solutionSet: true,
    }
  });

  revalidatePath(`/problems/${comment.solutionSet.problemId}`);
  return comment;
}
