export const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql";

export interface LeetCodeProblemBase {
  difficulty: string;
  frontendQuestionId: string;
  paidOnly: boolean;
  title: string;
  titleSlug: string;
  topicTags: { name: string; slug: string }[];
}

export interface LeetCodeProblemDetails {
  questionId: string;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  content: string;
  difficulty: string;
  topicTags: { name: string; slug: string }[];
}

export async function fetchAllLeetCodeProblems(limit = 5000): Promise<LeetCodeProblemBase[]> {
  const query = `
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
      ) {
        total: totalNum
        questions: data {
          difficulty
          frontendQuestionId: questionFrontendId
          paidOnly: isPaidOnly
          title
          titleSlug
          topicTags {
            name
            slug
          }
        }
      }
    }
  `;

  const response = await fetch(LEETCODE_API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        categorySlug: "",
        skip: 0,
        limit,
        filters: {}
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch LeetCode problems: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data?.problemsetQuestionList?.questions || [];
}

export async function fetchLeetCodeProblemDetails(titleSlug: string): Promise<LeetCodeProblemDetails | null> {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        title
        titleSlug
        content
        difficulty
        topicTags {
          name
          slug
        }
      }
    }
  `;

  const response = await fetch(LEETCODE_API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { titleSlug }
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch LeetCode problem details for ${titleSlug}: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data?.question || null;
}
