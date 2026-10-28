"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { jobSchema } from "@/lib/validation";
import { safeText } from "@/lib/utils";

export async function createJobAction(formData: FormData) {
  const locale=safeText(formData.get("locale"),2)||"en"; const {supabase,user}=await requireUser(locale);
  const n=(x:FormDataEntryValue|null)=>{const raw=String(x??"").trim();if(!raw)return undefined;const value=Number(raw);return Number.isFinite(value)&&value>=0?value:Number.NaN};
  const parsed=jobSchema.safeParse({title:safeText(formData.get("title"),140),description:safeText(formData.get("description"),12000),country:safeText(formData.get("country"),2),city:safeText(formData.get("city"),120)||undefined,jobType:safeText(formData.get("job_type"),30),salaryMin:n(formData.get("salary_min")),salaryMax:n(formData.get("salary_max")),currency:safeText(formData.get("currency"),3)||"AED",remote:formData.get("remote")==="on"});
  if(!parsed.success) redirect(`/${locale}/jobs/new?error=${encodeURIComponent(parsed.error.issues[0]?.message||"Invalid input")}`);
  const {data,error}=await supabase.from("jobs").insert({employer_id:user.id,title:parsed.data.title,description:parsed.data.description,country:parsed.data.country,city:parsed.data.city||null,job_type:parsed.data.jobType,salary_min:parsed.data.salaryMin??null,salary_max:parsed.data.salaryMax??null,currency:parsed.data.currency,remote:parsed.data.remote,status:"active"}).select("id").single();
  if(error) redirect(`/${locale}/jobs/new?error=Unable%20to%20create%20job`); revalidatePath(`/${locale}/jobs`); redirect(`/${locale}/jobs/${data.id}`);
}
