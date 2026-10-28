"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { safeText } from "@/lib/utils";
export async function deleteCvAction(formData:FormData){const locale=safeText(formData.get("locale"),2)||"en";const id=safeText(formData.get("cv_id"),80);const {supabase,user}=await requireUser(locale);const {data}=await supabase.from("cvs").select("file_path").eq("id",id).eq("user_id",user.id).maybeSingle();if(data?.file_path)await supabase.storage.from("cvs").remove([data.file_path]);await supabase.from("cvs").delete().eq("id",id).eq("user_id",user.id);revalidatePath(`/${locale}/cv`)}
