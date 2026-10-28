"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { safeText } from "@/lib/utils";
import { uuidSchema } from "@/lib/validation";

const actionLocale = (value: FormDataEntryValue | null) => safeText(value, 2) === "ar" ? "ar" : "en";

export async function updateReportAction(formData: FormData) {
	const locale = actionLocale(formData.get("locale"));
	const id = safeText(formData.get("id"), 80);
	const status = safeText(formData.get("status"), 30);
	if (!uuidSchema.safeParse(id).success || !["open", "reviewing", "resolved", "dismissed"].includes(status)) return;
	const { supabase } = await requireAdmin(locale);
	await supabase.from("reports").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
	revalidatePath(`/${locale}/admin`);
}

export async function updateVerificationAction(formData: FormData) {
	const locale = actionLocale(formData.get("locale"));
	const id = safeText(formData.get("id"), 80);
	const status = safeText(formData.get("status"), 30);
	if (!uuidSchema.safeParse(id).success || !["pending", "approved", "rejected"].includes(status)) return;
	const { supabase } = await requireAdmin(locale);
	const { data: request, error: lookupError } = await supabase.from("verification_requests").select("user_id").eq("id", id).maybeSingle();
	if (lookupError || !request) return;
	const { error } = await supabase.from("verification_requests").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
	if (error) return;
	if (status === "approved") await supabase.from("profiles").update({ verified: true }).eq("id", request.user_id);
	if (status === "rejected") await supabase.from("profiles").update({ verified: false }).eq("id", request.user_id);
	revalidatePath(`/${locale}/admin`);
}

export async function toggleSuspensionAction(formData: FormData) {
	const locale = actionLocale(formData.get("locale"));
	const userId = safeText(formData.get("user_id"), 80);
	if (!uuidSchema.safeParse(userId).success) return;
	const value = safeText(formData.get("value"), 5) === "true";
	const { supabase, user } = await requireAdmin(locale);
	if (userId !== user.id) await supabase.from("profiles").update({ is_suspended: value }).eq("id", userId);
	revalidatePath(`/${locale}/admin`);
}

export async function moderateListingAction(formData: FormData) {
	const locale = actionLocale(formData.get("locale"));
	const kind = safeText(formData.get("kind"), 10);
	const id = safeText(formData.get("id"), 80);
	const status = safeText(formData.get("status"), 20);
	if (!uuidSchema.safeParse(id).success || !["active", "paused", "removed"].includes(status)) return;
	const { supabase } = await requireAdmin(locale);
	if (kind === "job") await supabase.from("jobs").update({ status }).eq("id", id);
	if (kind === "service") await supabase.from("services").update({ status }).eq("id", id);
	revalidatePath(`/${locale}/admin`);
}
