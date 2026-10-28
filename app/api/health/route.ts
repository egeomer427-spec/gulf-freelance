import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { status: "ok", supabaseConfigured: isSupabaseConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
