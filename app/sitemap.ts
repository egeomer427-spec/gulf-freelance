import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";
export default function sitemap(): MetadataRoute.Sitemap { const base=siteUrl(); return ["en","ar"].flatMap(locale=>["", "/jobs", "/services", "/freelancers"].map(path=>({url:`${base}/${locale}${path}`,lastModified:new Date(),changeFrequency:"daily" as const,priority:path?0.8:1}))); }
