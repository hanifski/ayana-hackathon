import { z } from "zod";

export const signUpSchema = z.object({
    full_name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export type loginInputs = z.infer<typeof loginSchema>;
export type signUpInputs = z.infer<typeof signUpSchema>;
