import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/",disallow:["/en/admin","/ar/admin","/en/dashboard","/ar/dashboard","/en/messages","/ar/messages"]},sitemap:`${siteUrl()}/sitemap.xml`}}
