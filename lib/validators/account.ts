import { z } from "zod";
export const createAccountSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.string().min(1, "Role is required"),
});

export const updateAccountSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  role: z.string().min(1, "Role is required"),
  is_active: z.boolean(),
});
