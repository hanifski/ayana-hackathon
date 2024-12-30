import * as z from "zod";


// Personal info Schema
export const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().nonempty("I am a product designer"),
  country: z.enum([
    "USA", 
    "Canada", 
    "UK", 
    "Australia", 
    "Other"
  ], {
    required_error: "Country is required",
  }),
  timeZone: z.enum([
    "UTC",
    "GMT",
    "EST",
    "CST",
    "MST",
    "PST",
    "CET",
    "IST",
    "JST",
    "AEST",
    "Other"
  ], {
    required_error: "Time zone is required",
  }),
  bio: z.string().max(257, "max 257 characters"),
});


export type profileInput = z.infer<typeof profileSchema>;
