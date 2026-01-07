import { NextRequest, NextResponse } from "next/server";
import { loadSettings, updateSettings } from "@/lib/settings-store";

export const runtime = "nodejs";

export async function GET() {
  const settings = await loadSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if ("forsakenCovenant" in body && typeof body.forsakenCovenant !== "boolean") {
    return NextResponse.json(
      { error: "forsakenCovenant must be a boolean" },
      { status: 400 },
    );
  }

  const next = await updateSettings({
    forsakenCovenant:
      "forsakenCovenant" in body ? (body.forsakenCovenant as boolean) : undefined,
  });
  return NextResponse.json(next);
}

