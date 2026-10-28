"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { safeText } from "@/lib/utils";
import { uuidSchema } from "@/lib/validation";

export async function deleteCvAction(formData: FormData) {
	const locale = safeText(formData.get("locale"), 2) === "ar" ? "ar" : "en";
	const id = safeText(formData.get("cv_id"), 80);
	if (!uuidSchema.safeParse(id).success) return;
	const { supabase, user } = await requireUser(locale);
	const { data: cv } = await supabase.from("cvs").select("file_path").eq("id", id).eq("user_id", user.id).maybeSingle();
	if (!cv) return;
	const { error: storageError } = await supabase.storage.from("cvs").remove([cv.file_path]);
	if (storageError) redirect(`/${locale}/cv?error=Unable%20to%20delete%20CV`);
	const { error } = await supabase.from("cvs").delete().eq("id", id).eq("user_id", user.id);
	if (error) redirect(`/${locale}/cv?error=Unable%20to%20delete%20CV`);
	revalidatePath(`/${locale}/cv`);
}
