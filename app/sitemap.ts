import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const base = siteUrl();
	const indexPages = ["en", "ar"].flatMap((locale) =>
		["", "/jobs", "/services", "/freelancers"].map((path) => ({
			url: `${base}/${locale}${path}`,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: path ? 0.8 : 1,
		})),
	);

	if (!isSupabaseConfigured()) return indexPages;
	const supabase = await createClient();
	if (!supabase) return indexPages;

	const [jobs, services] = await Promise.all([
		supabase.from("jobs").select("id,updated_at").eq("status", "active").limit(5000),
		supabase.from("services").select("id,updated_at").eq("status", "active").limit(5000),
	]);
	const listingPages = [
		...(jobs.data || []).map((job) => ({ path: `/jobs/${job.id}`, updatedAt: job.updated_at })),
		...(services.data || []).map((service) => ({ path: `/services/${service.id}`, updatedAt: service.updated_at })),
	];

	return [
		...indexPages,
		...["en", "ar"].flatMap((locale) =>
			listingPages.map(({ path, updatedAt }) => ({
				url: `${base}/${locale}${path}`,
				lastModified: updatedAt ? new Date(updatedAt) : new Date(),
				changeFrequency: "weekly" as const,
				priority: 0.7,
			})),
		),
	];
}
