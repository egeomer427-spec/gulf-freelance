"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { safeText } from "@/lib/utils";

export async function updateProfileAction(formData: FormData) {
  const locale = safeText(formData.get("locale"), 2) || "en";
  const { supabase, user } = await requireUser(locale);
  const skills = safeText(formData.get("skills"), 500).split(",").map(x => x.trim()).filter(Boolean).slice(0, 20);
  const { error } = await supabase.from("profiles").update({
    display_name: safeText(formData.get("display_name"), 80),
    username: safeText(formData.get("username"), 50).toLowerCase().replace(/[^a-z0-9_-]/g, "") || null,
    headline: safeText(formData.get("headline"), 140) || null,
    bio: safeText(formData.get("bio"), 2000) || null,
    country: safeText(formData.get("country"), 2) || null,
    city: safeText(formData.get("city"), 120) || null,
    skills,
    preferred_language: locale,
    updated_at: new Date().toISOString(),
  }).eq("id", user.id);
  if (error) redirect(`/${locale}/profile?error=${encodeURIComponent(error.message)}`);
  revalidatePath(`/${locale}/profile`);
  redirect(`/${locale}/profile?saved=1`);
}
