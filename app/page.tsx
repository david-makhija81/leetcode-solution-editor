import { prisma } from "@/lib/prisma";
import { Dashboard } from "@/components/dashboard";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
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

  const problems = await prisma.problem.findMany({
    include: {
      solutions: {
        include: {
          reviewer: true
        }
      }
    }
  });
  
  return <Dashboard problems={problems} />;
}
