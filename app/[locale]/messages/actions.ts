"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { safeText } from "@/lib/utils";
import { uuidSchema } from "@/lib/validation";

const actionLocale = (value: FormDataEntryValue | null) => safeText(value, 2) === "ar" ? "ar" : "en";

export async function startConversationAction(formData: FormData) {
	const locale = actionLocale(formData.get("locale"));
	const other = safeText(formData.get("other_user_id"), 80);
	if (!uuidSchema.safeParse(other).success) redirect(`/${locale}/messages?error=Invalid%20recipient`);
	const { supabase, user } = await requireUser(locale);
	if (other === user.id) redirect(`/${locale}/messages`);
	const [userOne, userTwo] = [user.id, other].sort();
	let { data } = await supabase.from("conversations").select("id").eq("user_one", userOne).eq("user_two", userTwo).maybeSingle();
	if (!data) {
		const created = await supabase.from("conversations").insert({ user_one: userOne, user_two: userTwo }).select("id").single();
		data = created.data;
		if (created.error || !data) redirect(`/${locale}/messages?error=Unable%20to%20start%20conversation`);
	}
	redirect(`/${locale}/messages?conversation=${data.id}`);
}

export async function sendMessageAction(formData: FormData) {
	const locale = actionLocale(formData.get("locale"));
	const conversationId = safeText(formData.get("conversation_id"), 80);
	const body = safeText(formData.get("body"), 4000);
	if (!uuidSchema.safeParse(conversationId).success || !body) return;
	const { supabase, user } = await requireUser(locale);
	const { error } = await supabase.from("messages").insert({ conversation_id: conversationId, sender_id: user.id, body, is_read: false });
	if (error) redirect(`/${locale}/messages?conversation=${conversationId}&error=Unable%20to%20send%20message`);
	await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
	revalidatePath(`/${locale}/messages`);
}

export async function markConversationReadAction(formData: FormData) {
	const locale = actionLocale(formData.get("locale"));
	const conversationId = safeText(formData.get("conversation_id"), 80);
	if (!uuidSchema.safeParse(conversationId).success) return;
	const { supabase, user } = await requireUser(locale);
	await supabase.from("messages").update({ is_read: true, read_at: new Date().toISOString() }).eq("conversation_id", conversationId).neq("sender_id", user.id).eq("is_read", false);
	revalidatePath(`/${locale}/messages`);
}
