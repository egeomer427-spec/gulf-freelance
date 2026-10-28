"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { serviceSchema } from "@/lib/validation";
import { safeText } from "@/lib/utils";

export async function createServiceAction(formData:FormData){const locale=safeText(formData.get("locale"),2)==="ar"?"ar":"en";const {supabase,user}=await requireUser(locale);const parsed=serviceSchema.safeParse({title:safeText(formData.get("title"),140),description:safeText(formData.get("description"),12000),category:safeText(formData.get("category"),80),basePrice:Number(formData.get("base_price")),currency:safeText(formData.get("currency"),3)||"AED",deliveryDays:Number(formData.get("delivery_days"))});if(!parsed.success)redirect(`/${locale}/services/new?error=Please%20check%20the%20service%20details`);const {data,error}=await supabase.from("services").insert({seller_id:user.id,title:parsed.data.title,description:parsed.data.description,category:parsed.data.category,base_price:parsed.data.basePrice,currency:parsed.data.currency,delivery_days:parsed.data.deliveryDays,status:"active"}).select("id").single();if(error||!data)redirect(`/${locale}/services/new?error=Unable%20to%20create%20service`);revalidatePath(`/${locale}/services`);redirect(`/${locale}/services/${data.id}`)}
