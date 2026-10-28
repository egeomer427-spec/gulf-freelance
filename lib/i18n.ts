import type { Locale } from "@/types";

export const locales: Locale[] = ["en", "ar"];
export const defaultLocale: Locale = "en";

export function normalizeLocale(value: string): Locale {
  return value === "ar" ? "ar" : "en";
}

export const messages = {
  en: {
    brand: "GulfFreelance",
    jobs: "Jobs",
    services: "Freelance",
    freelancers: "Freelancers",
    messages: "Messages",
    dashboard: "Dashboard",
    profile: "Profile",
    cv: "CV",
    saved: "Saved jobs",
    login: "Log in",
    register: "Create account",
    logout: "Log out",
    menu: "Menu",
    adminJobs: "Jobs",
    adminServices: "Services",
    active: "Active",
    paused: "Paused",
    removed: "Removed",
    update: "Update",
    noListings: "No listings found.",
    statusLabel: "Listing status",
    heroTitle: "Work, hire and grow across the Gulf",
    heroBody: "A bilingual Gulf-focused platform for jobs and freelance services.",
    findWork: "Find work",
    sellSkills: "Sell your skills",
    hireTalent: "Hire talent",
    browseJobs: "Browse jobs",
    browseServices: "Browse services",
    postJob: "Post a job",
    createService: "Create a service",
    setupRequired: "Supabase is not configured yet. Add the values from .env.example to .env.local.",
  },
  ar: {
    brand: "GulfFreelance",
    jobs: "الوظائف",
    services: "الخدمات",
    freelancers: "المستقلون",
    messages: "الرسائل",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    cv: "السيرة الذاتية",
    saved: "الوظائف المحفوظة",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    menu: "القائمة",
    adminJobs: "الوظائف",
    adminServices: "الخدمات",
    active: "نشط",
    paused: "متوقف مؤقتاً",
    removed: "محذوف",
    update: "تحديث",
    noListings: "لا توجد إعلانات.",
    statusLabel: "حالة الإعلان",
    heroTitle: "اعمل ووظّف وانمُ في الخليج",
    heroBody: "منصة ثنائية اللغة مخصصة للوظائف والخدمات المستقلة في الخليج.",
    findWork: "ابحث عن عمل",
    sellSkills: "بع مهاراتك",
    hireTalent: "وظّف المواهب",
    browseJobs: "تصفح الوظائف",
    browseServices: "تصفح الخدمات",
    postJob: "أضف وظيفة",
    createService: "أضف خدمة",
    setupRequired: "لم يتم إعداد Supabase بعد. أضف القيم من .env.example إلى .env.local.",
  },
} as const;

export function t(locale: Locale) {
  return messages[locale];
}
