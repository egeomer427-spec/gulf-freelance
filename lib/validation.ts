import { z } from "zod";

export const gccCountryCodes = ["AE", "SA", "QA", "KW", "BH", "OM"] as const;
export const currencyCodes = ["AED", "SAR", "QAR", "KWD", "BHD", "OMR", "USD"] as const;
export const uuidSchema = z.string().uuid();
export const countryCodeSchema = z.string().trim().toUpperCase().pipe(z.enum(gccCountryCodes));

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  displayName: z.string().min(2).max(80),
  role: z.enum(["job_seeker", "freelancer", "employer", "client"]),
});

export const jobSchema = z.object({
  title: z.string().min(4).max(140),
  description: z.string().min(20).max(12000),
  country: countryCodeSchema,
  city: z.string().max(120).optional(),
  jobType: z.enum(["full_time", "part_time", "contract", "temporary", "internship"]),
  salaryMin: z.number().finite().nonnegative().optional(),
  salaryMax: z.number().finite().nonnegative().optional(),
  currency: z.string().trim().toUpperCase().pipe(z.enum(currencyCodes)),
  remote: z.boolean(),
}).refine(
  ({ salaryMin, salaryMax }) => salaryMin === undefined || salaryMax === undefined || salaryMax >= salaryMin,
  { message: "Maximum salary must be at least the minimum salary", path: ["salaryMax"] },
);

export const serviceSchema = z.object({
  title: z.string().min(4).max(140),
  description: z.string().min(20).max(12000),
  category: z.string().min(2).max(80),
  basePrice: z.number().finite().nonnegative(),
  currency: z.string().trim().toUpperCase().pipe(z.enum(currencyCodes)),
  deliveryDays: z.number().int().min(1).max(90),
});
