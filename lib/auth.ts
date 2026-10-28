import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getAuth() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null, profile: null };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null };
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return { supabase, user, profile };
}

export async function requireUser(locale = "en") {
  const auth = await getAuth();
  if (!auth.user || !auth.supabase) redirect(`/${locale}/login?next=/${locale}/dashboard`);
  if (auth.profile?.is_suspended) redirect(`/${locale}/login?error=Account%20suspended`);
  return auth as { supabase: NonNullable<typeof auth.supabase>; user: NonNullable<typeof auth.user>; profile: any };
}

export async function requireAdmin(locale = "en") {
  const auth = await requireUser(locale);
  if (auth.profile?.role !== "admin") redirect(`/${locale}/dashboard`);
  return auth;
}
