import { NextRequest, NextResponse } from "next/server";
import { analyzeComputer } from "@/lib/ai";
import type { QuestionnaireData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const data: QuestionnaireData = await req.json();

    // Validate minimal required fields
    if (!data.usages && !data.freeText) {
      return NextResponse.json(
        { error: "Veuillez préciser vos usages." },
        { status: 400 }
      );
    }

    const result = await analyzeComputer(data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[ChoixPC API Error]", err);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'analyse. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
