"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeText, siteUrl } from "@/lib/utils";

export async function loginAction(formData: FormData) {
  const locale = safeText(formData.get("locale"), 2) || "en";
  const email = safeText(formData.get("email"), 200);
  const password = safeText(formData.get("password"), 100);
  const next = safeText(formData.get("next"), 500);
  const supabase = await createClient();
  if (!supabase) redirect(`/${locale}/login?error=Supabase%20is%20not%20configured`);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/${locale}/login?error=${encodeURIComponent(error.message)}`);
  redirect(next.startsWith(`/${locale}/`) ? next : `/${locale}/dashboard`);
}

export async function logoutAction(formData: FormData) {
  const locale = safeText(formData.get("locale"), 2) || "en";
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect(`/${locale}`);
}

export async function forgotPasswordAction(formData: FormData) {
  const locale = safeText(formData.get("locale"), 2) || "en";
  const email = safeText(formData.get("email"), 200);
  const supabase = await createClient();
  if (!supabase) redirect(`/${locale}/forgot-password?error=Supabase%20is%20not%20configured`);
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl()}/auth/callback?next=/${locale}/update-password` });
  if (error) redirect(`/${locale}/forgot-password?error=${encodeURIComponent(error.message)}`);
  redirect(`/${locale}/forgot-password?sent=1`);
}

export async function updatePasswordAction(formData: FormData) {
  const locale = safeText(formData.get("locale"), 2) || "en";
  const password = safeText(formData.get("password"), 100);
  if (password.length < 8) redirect(`/${locale}/update-password?error=Password%20must%20be%20at%20least%208%20characters`);
  const supabase = await createClient();
  if (!supabase) redirect(`/${locale}/update-password?error=Supabase%20is%20not%20configured`);
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect(`/${locale}/update-password?error=${encodeURIComponent(error.message)}`);
  redirect(`/${locale}/dashboard`);
}
