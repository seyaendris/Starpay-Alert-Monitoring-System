import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

const phoneSchema = z
  .string()
  .min(5, "Phone number is too short")
  .max(20, "Phone number is too long");

const levelSchema = z
  .number({ message: "Level must be a number" })
  .int("Level must be an integer")
  .min(1, { message: "Level must be at least 1" });

export const createAlertReceiverSchema = z.object({
  email: emailSchema,
  phone_number: phoneSchema,
  level: levelSchema,
});

export const updateAlertReceiverSchema = z.object({
  email: emailSchema,
  phone_number: phoneSchema,
  level: levelSchema,
});
