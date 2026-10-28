import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/en/dashboard";
  if (code) {
    const supabase = await createClient();
    if (supabase) await supabase.auth.exchangeCodeForSession(code);
  }
  const site = new URL(siteUrl());
  let destination: URL;
  try {
    destination = new URL(next, site);
  } catch {
    destination = new URL("/en/dashboard", site);
  }
  if (destination.origin !== site.origin || destination.username || destination.password) {
    destination = new URL("/en/dashboard", site);
  }
  return NextResponse.redirect(destination);
}
