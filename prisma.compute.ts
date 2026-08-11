import { defineComputeConfig } from "@prisma/compute-sdk/config";

export default defineComputeConfig({
  app: {
    name: "leetcode_solution_editor",
    framework: "nextjs",
    httpPort: 3000,
  },
});
