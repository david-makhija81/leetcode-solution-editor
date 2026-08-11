import type { Problem, SolutionSet, Comment, MockUser } from "./types";

export const currentUser: MockUser = {
  name: "David Makhija",
  avatar: "https://api.dicebear.com/9.x/initials/svg?seed=DM&backgroundColor=0a0a0f&textColor=22d3ee",
  email: "david@example.com",
};

export const peerUsers: MockUser[] = [
  {
    name: "Ravi Kumar",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=RK&backgroundColor=0a0a0f&textColor=22d3ee",
    email: "ravi@example.com",
  },
  {
    name: "Priya Sharma",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=PS&backgroundColor=0a0a0f&textColor=22d3ee",
    email: "priya@example.com",
  },
  {
    name: "Amit Patel",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=AP&backgroundColor=0a0a0f&textColor=a78bfa",
    email: "amit@example.com",
  },
  {
    name: "Sneha Reddy",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=SR&backgroundColor=0a0a0f&textColor=fb923c",
    email: "sneha@example.com",
  },
];

export const problems: Problem[] = [
  {
    id: "two-sum",
    number: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    status: "solved",
    solutionCount: 2,
    statement: `<h2>Two Sum</h2>
<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
<p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
<p>You can return the answer in any order.</p>
<h3>Example 1:</h3>
<pre><strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</pre>
<h3>Example 2:</h3>
<pre><strong>Input:</strong> nums = [3,2,4], target = 6
<strong>Output:</strong> [1,2]</pre>
<h3>Constraints:</h3>
<ul>
<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
<li><strong>Only one valid answer exists.</strong></li>
</ul>`,
  },
  {
    id: "valid-parentheses",
    number: 20,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    status: "solved",
    solutionCount: 1,
    statement: `<h2>Valid Parentheses</h2>
<p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
<p>An input string is valid if:</p>
<ol>
<li>Open brackets must be closed by the same type of brackets.</li>
<li>Open brackets must be closed in the correct order.</li>
<li>Every close bracket has a corresponding open bracket of the same type.</li>
</ol>
<h3>Example 1:</h3>
<pre><strong>Input:</strong> s = "()"
<strong>Output:</strong> true</pre>
<h3>Example 2:</h3>
<pre><strong>Input:</strong> s = "()[]{}"
<strong>Output:</strong> true</pre>`,
  },
  {
    id: "merge-intervals",
    number: 56,
    title: "Merge Intervals",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    status: "in-review",
    solutionCount: 1,
    statement: `<h2>Merge Intervals</h2>
<p>Given an array of <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, merge all overlapping intervals, and return <em>an array of the non-overlapping intervals that cover all the intervals in the input</em>.</p>
<h3>Example 1:</h3>
<pre><strong>Input:</strong> intervals = [[1,3],[2,6],[8,10],[15,18]]
<strong>Output:</strong> [[1,6],[8,10],[15,18]]
<strong>Explanation:</strong> Since intervals [1,3] and [2,6] overlap, merge them into [1,6].</pre>
<h3>Constraints:</h3>
<ul>
<li><code>1 &lt;= intervals.length &lt;= 10<sup>4</sup></code></li>
<li><code>intervals[i].length == 2</code></li>
</ul>`,
  },
  {
    id: "best-time-to-buy-sell",
    number: 121,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    status: "reviewed",
    solutionCount: 1,
    statement: `<h2>Best Time to Buy and Sell Stock</h2>
<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.</p>
<p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.</p>
<p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.</p>
<h3>Example 1:</h3>
<pre><strong>Input:</strong> prices = [7,1,5,3,6,4]
<strong>Output:</strong> 5
<strong>Explanation:</strong> Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.</pre>`,
  },
  {
    id: "lru-cache",
    number: 146,
    title: "LRU Cache",
    difficulty: "Medium",
    tags: ["Hash Table", "Linked List", "Design"],
    status: "unsolved",
    solutionCount: 0,
    statement: `<h2>LRU Cache</h2>
<p>Design a data structure that follows the constraints of a <strong>Least Recently Used (LRU) cache</strong>.</p>
<p>Implement the <code>LRUCache</code> class:</p>
<ul>
<li><code>LRUCache(int capacity)</code> Initialize the LRU cache with <strong>positive</strong> size capacity.</li>
<li><code>int get(int key)</code> Return the value of the key if the key exists, otherwise return <code>-1</code>.</li>
<li><code>void put(int key, int value)</code> Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache.</li>
</ul>`,
  },
  {
    id: "binary-tree-level-order",
    number: 102,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    tags: ["Tree", "BFS"],
    status: "unsolved",
    solutionCount: 0,
    statement: `<h2>Binary Tree Level Order Traversal</h2>
<p>Given the <code>root</code> of a binary tree, return <em>the level order traversal of its nodes' values</em>. (i.e., from left to right, level by level).</p>
<h3>Example 1:</h3>
<pre><strong>Input:</strong> root = [3,9,20,null,null,15,7]
<strong>Output:</strong> [[3],[9,20],[15,7]]</pre>`,
  },
  {
    id: "trapping-rain-water",
    number: 42,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Stack", "Dynamic Programming"],
    status: "unsolved",
    solutionCount: 0,
    statement: `<h2>Trapping Rain Water</h2>
<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>
<h3>Example 1:</h3>
<pre><strong>Input:</strong> height = [0,1,0,2,1,0,1,3,2,1,2,1]
<strong>Output:</strong> 6
<strong>Explanation:</strong> The elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.</pre>`,
  },
  {
    id: "median-two-sorted",
    number: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    status: "in-review",
    solutionCount: 1,
    statement: `<h2>Median of Two Sorted Arrays</h2>
<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <strong>the median</strong> of the two sorted arrays.</p>
<p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>
<h3>Example 1:</h3>
<pre><strong>Input:</strong> nums1 = [1,3], nums2 = [2]
<strong>Output:</strong> 2.00000
<strong>Explanation:</strong> merged array = [1,2,3] and median is 2.</pre>`,
  },
  {
    id: "longest-substring",
    number: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    status: "solved",
    solutionCount: 2,
    statement: `<h2>Longest Substring Without Repeating Characters</h2>
<p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>
<h3>Example 1:</h3>
<pre><strong>Input:</strong> s = "abcabcbb"
<strong>Output:</strong> 3
<strong>Explanation:</strong> The answer is "abc", with the length of 3.</pre>
<h3>Example 2:</h3>
<pre><strong>Input:</strong> s = "bbbbb"
<strong>Output:</strong> 1
<strong>Explanation:</strong> The answer is "b", with the length of 1.</pre>`,
  },
  {
    id: "coin-change",
    number: 322,
    title: "Coin Change",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming", "BFS"],
    status: "unsolved",
    solutionCount: 0,
    statement: `<h2>Coin Change</h2>
<p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p>
<p>Return <em>the fewest number of coins that you need to make up that amount</em>. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>.</p>
<h3>Example 1:</h3>
<pre><strong>Input:</strong> coins = [1,2,5], amount = 11
<strong>Output:</strong> 3
<strong>Explanation:</strong> 11 = 5 + 5 + 1</pre>`,
  },
];

export const solutionSets: Record<string, SolutionSet[]> = {
  "two-sum": [
    {
      id: "ts-sol-1",
      problemId: "two-sum",
      label: "Solution 1 — Hash Map",
      language: "python",
      code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
      intuition: `The key insight is that for each number, we know exactly what its complement needs to be (target - num). Instead of searching for the complement with a nested loop, we can use a hash map to store numbers we've already seen and look up complements in O(1) time.

This transforms the problem from "find two numbers that sum to target" into "for each number, have I seen its complement before?"`,
      approach: `1. Create an empty hash map to store {number: index} pairs
2. Iterate through the array with index
3. For each number, calculate complement = target - number
4. Check if complement exists in the hash map
   - If yes: return [map[complement], current_index]
   - If no: add current number and index to the hash map
5. Continue until the pair is found`,
      complexity: `**Time Complexity:** O(n) — We traverse the list once. Each lookup in the hash map is O(1).

**Space Complexity:** O(n) — The hash map stores at most n elements.`,
      authorId: "david-makhija",
    authorName: "David Makhija",
      createdAt: "2026-08-01T10:30:00Z",
    },
    {
      id: "ts-sol-2",
      problemId: "two-sum",
      label: "Solution 2 — Brute Force",
      language: "python",
      code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        n = len(nums)
        for i in range(n):
            for j in range(i + 1, n):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []`,
      intuition: `The most straightforward approach — check every possible pair of numbers. While not optimal, this is useful to understand the problem before optimizing.`,
      approach: `1. Use two nested loops
2. Outer loop picks the first element (index i)
3. Inner loop picks the second element (index j, starting from i+1)
4. Check if nums[i] + nums[j] equals target
5. Return the indices when found`,
      complexity: `**Time Complexity:** O(n²) — Nested loops checking all pairs.

**Space Complexity:** O(1) — No extra data structures used.`,
      authorId: "david-makhija",
    authorName: "David Makhija",
      createdAt: "2026-07-28T09:00:00Z",
    },
    {
      id: "ts-sol-3",
      problemId: "two-sum",
      label: "Solution 3 — Two Pointers (Sorted)",
      language: "python",
      code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        sorted_nums = sorted(enumerate(nums), key=lambda x: x[1])
        left, right = 0, len(nums) - 1
        while left < right:
            current_sum = sorted_nums[left][1] + sorted_nums[right][1]
            if current_sum == target:
                return [sorted_nums[left][0], sorted_nums[right][0]]
            elif current_sum < target:
                left += 1
            else:
                right -= 1
        return []`,
      intuition: `If the array was sorted, we could use two pointers at the ends and move them inward based on the sum. Since we need original indices, we sort a list of (index, value) tuples first.`,
      approach: `1. Create a list of tuples: (original_index, value).
2. Sort the list based on the values.
3. Initialize two pointers: left at start, right at end.
4. Calculate sum of values at pointers.
5. If sum == target, return original indices.
6. If sum < target, increment left.
7. If sum > target, decrement right.`,
      complexity: `**Time Complexity:** O(n log n) — Due to sorting.

**Space Complexity:** O(n) — To store the tuples with original indices.`,
      authorId: "ravi-kumar",
    authorName: "Ravi Kumar",
      createdAt: "2026-08-05T12:00:00Z",
    },
    {
      id: "ts-sol-4",
      problemId: "two-sum",
      label: "Solution 4 — One-pass Hash Map in JS",
      language: "javascript",
      code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
      intuition: `Same as the optimal Python solution, but using a Map in JavaScript for O(1) lookups.`,
      approach: `We iterate through the array once, keeping track of the values we've seen and their indices in a Map. For each element, we check if its complement (target - current element) is already in the Map.`,
      complexity: `**Time Complexity:** O(n)

**Space Complexity:** O(n)`,
      authorId: "priya-sharma",
    authorName: "Priya Sharma",
      createdAt: "2026-08-08T16:45:00Z",
    }
  ],
  "valid-parentheses": [
    {
      id: "vp-sol-1",
      problemId: "valid-parentheses",
      label: "Solution 1 — Stack",
      language: "python",
      code: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}

        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)

        return not stack`,
      intuition: `Every closing bracket must match the most recent unmatched opening bracket. A stack naturally maintains this "most recent first" ordering — we push opening brackets and pop when we see a closing bracket, checking if they match.`,
      approach: `1. Initialize an empty stack and a mapping of closing → opening brackets
2. For each character in the string:
   - If it's a closing bracket: pop from stack and verify it matches
   - If it's an opening bracket: push onto stack
3. At the end, the stack should be empty (all brackets matched)`,
      complexity: `**Time Complexity:** O(n) — Single pass through the string.

**Space Complexity:** O(n) — Stack can hold up to n/2 opening brackets.`,
      authorId: "david-makhija",
    authorName: "David Makhija",
      createdAt: "2026-08-03T14:00:00Z",
    },
  ],
  "merge-intervals": [
    {
      id: "mi-sol-1",
      problemId: "merge-intervals",
      label: "Solution 1 — Sort & Merge",
      language: "python",
      code: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort(key=lambda x: x[0])
        merged = [intervals[0]]

        for start, end in intervals[1:]:
            if start <= merged[-1][1]:
                merged[-1][1] = max(merged[-1][1], end)
            else:
                merged.append([start, end])

        return merged`,
      intuition: `If we sort intervals by start time, overlapping intervals will be adjacent. Then we can merge them in a single linear scan by comparing each interval's start with the previous merged interval's end.`,
      approach: `1. Sort intervals by start time
2. Initialize merged list with the first interval
3. For each remaining interval:
   - If it overlaps with the last merged interval (start ≤ last_end), extend the end
   - Otherwise, add it as a new merged interval
4. Return the merged list`,
      complexity: `**Time Complexity:** O(n log n) — Dominated by the sorting step.

**Space Complexity:** O(n) — For the merged output array.`,
      authorId: "david-makhija",
    authorName: "David Makhija",
      createdAt: "2026-08-05T16:30:00Z",
    },
  ],
  "best-time-to-buy-sell": [
    {
      id: "btbs-sol-1",
      problemId: "best-time-to-buy-sell",
      label: "Solution 1 — Kadane's Variant",
      language: "python",
      code: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price = float('inf')
        max_profit = 0

        for price in prices:
            if price < min_price:
                min_price = price
            elif price - min_price > max_profit:
                max_profit = price - min_price

        return max_profit`,
      intuition: `We want to buy low and sell high. As we scan through prices, we track the minimum price seen so far. At each day, the best profit we could make is today's price minus that minimum. We keep a running maximum of this profit.`,
      approach: `1. Track min_price (initially infinity) and max_profit (initially 0)
2. For each price:
   - Update min_price if current price is lower
   - Update max_profit if selling at current price gives better profit
3. Return max_profit`,
      complexity: `**Time Complexity:** O(n) — Single pass through the prices array.

**Space Complexity:** O(1) — Only two variables tracked.`,
      authorId: "david-makhija",
    authorName: "David Makhija",
      createdAt: "2026-08-02T11:00:00Z",
    },
  ],
  "longest-substring": [
    {
      id: "ls-sol-1",
      problemId: "longest-substring",
      label: "Solution 1 — Sliding Window",
      language: "python",
      code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        left = 0
        max_len = 0

        for right in range(len(s)):
            while s[right] in char_set:
                char_set.remove(s[left])
                left += 1
            char_set.add(s[right])
            max_len = max(max_len, right - left + 1)

        return max_len`,
      intuition: `Use a sliding window that expands to the right. When we encounter a duplicate character, shrink the window from the left until the duplicate is removed. The window always contains unique characters, and we track the maximum window size.`,
      approach: `1. Use a set to track characters in the current window
2. Expand the right pointer one step at a time
3. If the new character is already in the set, shrink from the left
4. Track the maximum window size throughout`,
      complexity: `**Time Complexity:** O(n) — Each character is added and removed from the set at most once.

**Space Complexity:** O(min(m, n)) — Where m is the charset size and n is the string length.`,
      authorId: "david-makhija",
    authorName: "David Makhija",
      createdAt: "2026-08-04T08:15:00Z",
    },
    {
      id: "ls-sol-2",
      problemId: "longest-substring",
      label: "Solution 2 — Optimized with HashMap",
      language: "python",
      code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_index = {}
        left = 0
        max_len = 0

        for right, char in enumerate(s):
            if char in char_index and char_index[char] >= left:
                left = char_index[char] + 1
            char_index[char] = right
            max_len = max(max_len, right - left + 1)

        return max_len`,
      intuition: `Instead of shrinking the window character by character, we can jump the left pointer directly to one position after the last occurrence of the duplicate character. A hash map lets us look up the last index of any character in O(1).`,
      approach: `1. Use a hash map to store {character: last_seen_index}
2. For each character at position right:
   - If it was seen before and its last index is within the current window, jump left to last_index + 1
   - Update the character's last seen index
   - Track max window size`,
      complexity: `**Time Complexity:** O(n) — Single pass, no inner while loop.

**Space Complexity:** O(min(m, n)) — Hash map stores at most min(charset, string length) entries.`,
      authorId: "david-makhija",
    authorName: "David Makhija",
      createdAt: "2026-08-04T09:30:00Z",
    },
  ],
  "median-two-sorted": [
    {
      id: "mts-sol-1",
      problemId: "median-two-sorted",
      label: "Solution 1 — Binary Search",
      language: "python",
      code: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1

        m, n = len(nums1), len(nums2)
        lo, hi = 0, m

        while lo <= hi:
            i = (lo + hi) // 2
            j = (m + n + 1) // 2 - i

            left1 = nums1[i - 1] if i > 0 else float('-inf')
            right1 = nums1[i] if i < m else float('inf')
            left2 = nums2[j - 1] if j > 0 else float('-inf')
            right2 = nums2[j] if j < n else float('inf')

            if left1 <= right2 and left2 <= right1:
                if (m + n) % 2 == 0:
                    return (max(left1, left2) + min(right1, right2)) / 2
                return max(left1, left2)
            elif left1 > right2:
                hi = i - 1
            else:
                lo = i + 1

        return 0.0`,
      intuition: `We need to partition both arrays such that all elements on the left side are smaller than all elements on the right side. Binary search on the smaller array finds the correct partition point in O(log min(m,n)).`,
      approach: `1. Ensure nums1 is the smaller array
2. Binary search on partition index i for nums1
3. Compute corresponding partition j for nums2
4. Check if the partition is valid (left elements ≤ right elements)
5. If valid, compute median from the boundary elements`,
      complexity: `**Time Complexity:** O(log min(m, n)) — Binary search on the smaller array.

**Space Complexity:** O(1) — Constant extra space.`,
      authorId: "david-makhija",
    authorName: "David Makhija",
      createdAt: "2026-08-06T20:00:00Z",
    },
  ],
};

export const comments: Comment[] = [
  {
    id: "c1",
    solutionSetId: "ts-sol-1",
    field: "code",
    line: 5,
    content: "Good use of hash map here. Consider adding a comment about why you check complement before inserting.",
    authorId: "ravi-kumar",
    authorName: "Ravi Kumar",
    authorAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=RK&backgroundColor=0a0a0f&textColor=22d3ee",
    createdAt: "2026-08-02T14:00:00Z",
  },
  {
    id: "c2",
    solutionSetId: "ts-sol-1",
    field: "code",
    line: 5,
    content: "Agreed — also worth noting this avoids pairing a number with itself.",
    authorId: "priya-sharma",
    authorName: "Priya Sharma",
    authorAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=PS&backgroundColor=0a0a0f&textColor=22d3ee",
    createdAt: "2026-08-02T15:30:00Z",
  },
  {
    id: "c3-code",
    solutionSetId: "ts-sol-1",
    field: "code",
    line: 8,
    content: "Returning an empty list here should never happen given the problem constraints. Maybe raise an exception instead?",
    authorId: "ravi-kumar",
    authorName: "Ravi Kumar",
    authorAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=RK&backgroundColor=0a0a0f&textColor=22d3ee",
    createdAt: "2026-08-03T10:00:00Z",
  },
  {
    id: "c4-app",
    solutionSetId: "ts-sol-1",
    field: "approach",
    line: 2,
    content: "The step-by-step breakdown is clear. You might want to mention that this approach works because the problem guarantees exactly one solution.",
    authorId: "priya-sharma",
    authorName: "Priya Sharma",
    authorAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=PS&backgroundColor=0a0a0f&textColor=22d3ee",
    createdAt: "2026-08-02T15:30:00Z",
  },
  {
    id: "c3",
    solutionSetId: "mi-sol-1",
    field: "code",
    line: 3,
    content: "Initializing merged with intervals[0] could fail on empty input. Consider adding an edge case check.",
    authorId: "ravi-kumar",
    authorName: "Ravi Kumar",
    authorAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=RK&backgroundColor=0a0a0f&textColor=22d3ee",
    createdAt: "2026-08-06T10:00:00Z",
  },
  {
    id: "c4",
    solutionSetId: "btbs-sol-1",
    field: "intuition",
    line: 1,
    content: "Great explanation! This is essentially Kadane's algorithm applied to the diff array. You could mention that connection for readers familiar with Kadane's.",
    authorId: "priya-sharma",
    authorName: "Priya Sharma",
    authorAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=PS&backgroundColor=0a0a0f&textColor=22d3ee",
    createdAt: "2026-08-03T12:00:00Z",
  },
  {
    id: "c5",
    solutionSetId: "mts-sol-1",
    field: "code",
    line: 8,
    content: "The swap to ensure nums1 is smaller is crucial for the O(log min(m,n)) guarantee. Worth highlighting in the approach.",
    authorId: "ravi-kumar",
    authorName: "Ravi Kumar",
    authorAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=RK&backgroundColor=0a0a0f&textColor=22d3ee",
    createdAt: "2026-08-07T09:00:00Z",
  },
];

export function getProblem(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getSolutionSets(problemId: string): SolutionSet[] {
  return solutionSets[problemId] ?? [];
}

export function getComments(solutionSetId: string): Comment[] {
  return comments.filter((c) => c.solutionSetId === solutionSetId);
}
