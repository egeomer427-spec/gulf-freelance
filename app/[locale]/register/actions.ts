"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "@/lib/validation";
import { safeText, siteUrl } from "@/lib/utils";

export async function registerAction(formData: FormData) {
  const locale = safeText(formData.get("locale"), 2) || "en";
  const parsed = signupSchema.safeParse({ email: safeText(formData.get("email"), 200), password: safeText(formData.get("password"), 100), displayName: safeText(formData.get("displayName"), 80), role: safeText(formData.get("role"), 30) });
  if (!parsed.success) redirect(`/${locale}/register?error=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid input")}`);
  const supabase = await createClient();
  if (!supabase) redirect(`/${locale}/register?error=Supabase%20is%20not%20configured`);
  const { error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { emailRedirectTo: `${siteUrl()}/auth/callback?next=/${locale}/dashboard`, data: { display_name: parsed.data.displayName, role: parsed.data.role } } });
  if (error) redirect(`/${locale}/register?error=${encodeURIComponent(error.message)}`);
  redirect(`/${locale}/login?message=${encodeURIComponent("Check your email to verify your account.")}`);
}
