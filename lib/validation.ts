import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  displayName: z.string().min(2).max(80),
  role: z.enum(["job_seeker", "freelancer", "employer", "client"]),
});

export const jobSchema = z.object({
  title: z.string().min(4).max(140),
  description: z.string().min(20).max(12000),
  country: z.string().min(2).max(2),
  city: z.string().max(120).optional(),
  jobType: z.enum(["full_time", "part_time", "contract", "temporary", "internship"]),
  salaryMin: z.number().nonnegative().optional(),
  salaryMax: z.number().nonnegative().optional(),
  currency: z.string().min(3).max(3),
  remote: z.boolean(),
});

export const serviceSchema = z.object({
  title: z.string().min(4).max(140),
  description: z.string().min(20).max(12000),
  category: z.string().min(2).max(80),
  basePrice: z.number().nonnegative(),
  currency: z.string().min(3).max(3),
  deliveryDays: z.number().int().min(1).max(90),
});
