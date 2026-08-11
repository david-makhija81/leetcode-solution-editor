import { prisma } from '../lib/prisma'
import { problems, currentUser, peerUsers } from '../lib/mock-data'
import { getSolutionSets, getComments } from '../lib/mock-data'

async function main() {

  // 1. Seed Users
  const usersToSeed = [currentUser, ...peerUsers]
  for (const user of usersToSeed) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.name.toLowerCase().replace(/\\s+/g, '-'), // stable id based on name
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    })
  }
  console.log(`Seeded ${usersToSeed.length} users.`)

  // 2. Seed Problems
  for (const problem of problems) {
    await prisma.problem.upsert({
      where: { id: problem.id },
      update: {},
      create: {
        id: problem.id,
        number: problem.number,
        title: problem.title,
        difficulty: problem.difficulty,
        tags: JSON.stringify(problem.tags),
        statement: problem.statement,
        status: problem.status,
      },
    })
  }
  console.log(`Seeded ${problems.length} problems.`)

  // 3. Seed Solutions & Comments
  let solCount = 0;
  let commentCount = 0;
  
  for (const problem of problems) {
    const solutions = getSolutionSets(problem.id);
    for (const sol of solutions) {
      // Find author id
      const authorId = sol.authorName.toLowerCase().replace(/\\s+/g, '-');
      
      await prisma.solutionSet.upsert({
        where: { id: sol.id },
        update: {},
        create: {
          id: sol.id,
          problemId: problem.id,
          authorId: authorId,
          label: sol.label,
          language: sol.language,
          code: sol.code,
          intuition: sol.intuition,
          approach: sol.approach,
          complexity: sol.complexity,
          createdAt: new Date(sol.createdAt),
        },
      })
      solCount++;

      const comments = getComments(sol.id);
      for (const comment of comments) {
        const commentAuthorId = comment.authorName.toLowerCase().replace(/\\s+/g, '-');
        await prisma.comment.upsert({
          where: { id: comment.id },
          update: {},
          create: {
            id: comment.id,
            solutionSetId: sol.id,
            authorId: commentAuthorId,
            field: comment.field,
            line: comment.line,
            content: comment.content,
            createdAt: new Date(comment.createdAt),
          },
        })
        commentCount++;
      }
    }
  }
  console.log(`Seeded ${solCount} solutions and ${commentCount} comments.`)
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
