import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/",disallow:["/en/admin","/ar/admin","/en/dashboard","/ar/dashboard","/en/messages","/ar/messages","/en/cv","/ar/cv","/en/profile","/ar/profile","/en/saved-jobs","/ar/saved-jobs","/en/login","/ar/login","/en/register","/ar/register","/en/forgot-password","/ar/forgot-password","/en/update-password","/ar/update-password","/en/jobs/new","/ar/jobs/new","/en/services/new","/ar/services/new"]},sitemap:`${siteUrl()}/sitemap.xml`}}
