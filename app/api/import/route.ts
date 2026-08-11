import { NextRequest, NextResponse } from "next/server";
import { ensureProblemStatement } from "@/app/actions/problems";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Or specific extension ID if needed
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { titleSlug } = await req.json();

    if (!titleSlug) {
      return NextResponse.json(
        { error: "Missing titleSlug in request body" },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await ensureProblemStatement(titleSlug);

    if (result.success) {
      return NextResponse.json(
        { success: true, problem: result.problem },
        { status: 200, headers: corsHeaders }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to ensure problem statement" },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error: any) {
    console.error("Import API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
