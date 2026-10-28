"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { safeText } from "@/lib/utils";
import { uuidSchema } from "@/lib/validation";

const actionLocale = (value: FormDataEntryValue | null) => safeText(value, 2) === "ar" ? "ar" : "en";

export async function applyJobAction(formData: FormData) {
	const locale = actionLocale(formData.get("locale"));
	const jobId = safeText(formData.get("job_id"), 80);
	if (!uuidSchema.safeParse(jobId).success) redirect(`/${locale}/jobs?error=Invalid%20job`);
	const { supabase, user } = await requireUser(locale);
	const { data: job } = await supabase.from("jobs").select("employer_id").eq("id", jobId).eq("status", "active").maybeSingle();
	if (!job || job.employer_id === user.id) redirect(`/${locale}/jobs/${jobId}?error=Unable%20to%20apply%20to%20this%20job`);

	const rawCvId = safeText(formData.get("cv_id"), 80);
	let cvId: string | null = null;
	if (rawCvId) {
		if (!uuidSchema.safeParse(rawCvId).success) redirect(`/${locale}/jobs/${jobId}?error=Choose%20a%20valid%20CV`);
		const { data: cv } = await supabase.from("cvs").select("id").eq("id", rawCvId).eq("user_id", user.id).maybeSingle();
		if (!cv) redirect(`/${locale}/jobs/${jobId}?error=Choose%20one%20of%20your%20CVs`);
		cvId = cv.id;
	}

	const { error } = await supabase.from("job_applications").insert({
		job_id: jobId,
		applicant_id: user.id,
		cv_id: cvId,
		cover_letter: safeText(formData.get("cover_letter"), 5000),
		status: "submitted",
	});
	if (error) redirect(`/${locale}/jobs/${jobId}?error=Unable%20to%20submit%20application`);
	revalidatePath(`/${locale}/jobs/${jobId}`);
	redirect(`/${locale}/jobs/${jobId}?applied=1`);
}

export async function saveJobAction(formData: FormData) {
	const locale = actionLocale(formData.get("locale"));
	const jobId = safeText(formData.get("job_id"), 80);
	if (!uuidSchema.safeParse(jobId).success) return;
	const { supabase, user } = await requireUser(locale);
	const { error } = await supabase.from("saved_jobs").upsert({ user_id: user.id, job_id: jobId }, { onConflict: "user_id,job_id" });
	if (error) redirect(`/${locale}/jobs/${jobId}?error=Unable%20to%20save%20job`);
	revalidatePath(`/${locale}/jobs/${jobId}`);
}

export async function unsaveJobAction(formData: FormData) {
	const locale = actionLocale(formData.get("locale"));
	const jobId = safeText(formData.get("job_id"), 80);
	if (!uuidSchema.safeParse(jobId).success) return;
	const { supabase, user } = await requireUser(locale);
	const { error } = await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", jobId);
	if (error) redirect(`/${locale}/jobs/${jobId}?error=Unable%20to%20update%20saved%20jobs`);
	revalidatePath(`/${locale}/jobs/${jobId}`);
}

export async function updateApplicationStatusAction(formData: FormData) {
	const locale = actionLocale(formData.get("locale"));
	const jobId = safeText(formData.get("job_id"), 80);
	const applicationId = safeText(formData.get("application_id"), 80);
	const status = safeText(formData.get("status"), 30);
	const allowed = ["submitted", "reviewing", "shortlisted", "rejected", "hired"];
	if (!uuidSchema.safeParse(jobId).success || !uuidSchema.safeParse(applicationId).success || !allowed.includes(status)) return;
	const { supabase } = await requireUser(locale);
	const { error } = await supabase.from("job_applications").update({ status, updated_at: new Date().toISOString() }).eq("id", applicationId).eq("job_id", jobId);
	if (error) redirect(`/${locale}/jobs/${jobId}?error=Unable%20to%20update%20application`);
	revalidatePath(`/${locale}/jobs/${jobId}`);
}
