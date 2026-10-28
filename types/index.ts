export type Locale = "en" | "ar";

export type Profile = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  country: string | null;
  city: string | null;
  role: "job_seeker" | "freelancer" | "employer" | "client" | "admin";
  headline: string | null;
  skills: string[] | null;
  verified: boolean;
  is_suspended: boolean;
};
