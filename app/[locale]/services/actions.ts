"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { serviceSchema } from "@/lib/validation";
import { safeText } from "@/lib/utils";

export async function createServiceAction(formData:FormData){const locale=safeText(formData.get("locale"),2)||"en";const {supabase,user}=await requireUser(locale);const parsed=serviceSchema.safeParse({title:safeText(formData.get("title"),140),description:safeText(formData.get("description"),12000),category:safeText(formData.get("category"),80),basePrice:Number(formData.get("base_price")),currency:safeText(formData.get("currency"),3)||"AED",deliveryDays:Number(formData.get("delivery_days"))});if(!parsed.success)redirect(`/${locale}/services/new?error=${encodeURIComponent(parsed.error.issues[0]?.message||"Invalid input")}`);const {data,error}=await supabase.from("services").insert({seller_id:user.id,title:parsed.data.title,description:parsed.data.description,category:parsed.data.category,base_price:parsed.data.basePrice,currency:parsed.data.currency,delivery_days:parsed.data.deliveryDays,status:"active"}).select("id").single();if(error)redirect(`/${locale}/services/new?error=${encodeURIComponent(error.message)}`);revalidatePath(`/${locale}/services`);redirect(`/${locale}/services/${data.id}`)}
