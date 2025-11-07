import { z } from "zod"

export const LoginFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(3, "Password must be at least 6 characters"),
})

export type LoginFormValues = z.infer<typeof LoginFormSchema>