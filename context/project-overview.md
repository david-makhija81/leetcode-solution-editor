# Leetcode Solution Editor

## Overview

Leetcode Solution Editor is a collaborative Leetcode specific text editor. User selects a problem out of the many problems on leetcode, a new space/page is created with several text windows - one window holds the problem statement (immutable), the other one holds the coded solution to it (mutable), another one holds the intuition of this solution (mutable), another one holds the approach (mutable), Another one holds the time and space complexity. Let's call this space/page as solution editor page. Each solution editor page can have only one problem statement; to a problem there must exist multiple solution sets - each solution set consisting of "Solution Code", "Intuition", "Approach", and "Time/Space Complexity".

## Goals

1. Let users document their solutions to leetcode problems.
2. Let them revisit those solutions.
3. Let them showcase those solutions to their friends and mentors.
4. Let the friends and mentors collaborate on those solutions by letting them comment on specific lines of the solution.

## Core User Flow

1. User signs in
2. Different lists of leetcode problems appear:
   1. Submitted for a review.
   2. Reviewed by mentor.
   3. Solved.
   4. Unsolved.
   ...
3. User Picks up an unsolved problem - it's problem statement loads up - user is ready to document the solution.
4. User Picks up a mentor reviewed solution that he posted earlier, is able to see the comments of his peers and mentor on the solution.
5. User sees 2 kinds of solution streams - one is his personal, another is the collective feed of solutions of his peers or mentees.

## Features

### Keep track of solutions

- User is able to lookup previous solutions written by him and solutions posted by his friends.
- Add multiple solutions to already solved problems.

### Collaborate on solutions

- If you get stuck somewhere - you ask your friend how to proceed further on this
- You can ask your mentor on how well did you explain this solution.

## Scope

### In Scope

- A collaborative text editor with multiple editable text fields for a problem.

### Out of Scope

- An AI solution writer, that writes solutions for you.

## Success Criteria

1. A signed in user can keep track of his solutions.
2. He can review other's solutions.
