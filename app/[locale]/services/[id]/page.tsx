import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeLocale } from "@/lib/i18n";
import { formatMoney } from "@/lib/utils";
import { getAuth } from "@/lib/auth";
import { uuidSchema } from "@/lib/validation";
import { startConversationAction } from "../../messages/actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  if (!uuidSchema.safeParse(id).success) return { title: "Service", robots: { index: false, follow: false } };
  const supabase = await createClient();
  if (!supabase) return { title: "Service" };
  const { data: service } = await supabase.from("services").select("title,description,status").eq("id", id).maybeSingle();
  return {
    title: service?.title || "Service",
    description: service?.description?.slice(0, 155) || "Freelance service in the Gulf region.",
    alternates: { canonical: `/${normalizeLocale(locale)}/services/${id}` },
    robots: { index: service?.status === "active", follow: service?.status === "active" },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  const locale = normalizeLocale(rawLocale);
  const supabase = await createClient();
  if (!supabase) {
    return <section className="mx-auto max-w-4xl px-4 py-12">Configure Supabase first.</section>;
  }

  const { data: service } = await supabase
    .from("services")
    .select("*, profiles!services_seller_id_fkey(display_name,headline,verified,country,city)")
    .eq("id", id)
    .maybeSingle();
  if (!service) notFound();

  const { user } = await getAuth();
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="card">
        <span className="text-xs font-bold uppercase tracking-wider text-violet-300">{service.category}</span>
        <h1 className="mt-3 text-3xl font-black text-white">{service.title}</h1>
        <p className="mt-3 text-slate-400">
          By {service.profiles?.display_name || "Freelancer"} {service.profiles?.verified ? "✓" : ""} · {service.profiles?.city || "Gulf"}
        </p>
        <p className="mt-6 whitespace-pre-wrap leading-7 text-slate-300">{service.description}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-emerald-300">{formatMoney(service.base_price, service.currency, locale)}</p>
            <p className="text-sm text-slate-400">Delivery in {service.delivery_days} days</p>
          </div>
          {user && user.id !== service.seller_id && (
            <form action={startConversationAction}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="other_user_id" value={service.seller_id} />
              <button className="btn-primary">Message freelancer</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
