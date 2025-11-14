import { z } from 'zod';

export const alertHistoryItemSchema = z.object({
  id: z.number(),
  alert_name: z.string(),
  alert_message: z.string(),
  error_count: z.number(),
  fragment_identifier: z.string(),
  alert_type: z.string(),
  notification_level_used: z.number(),
  alert_receivers_email: z.string().nullable().optional(),
  alert_receivers_phone_number: z.string().nullable().optional(),
  is_sent: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  alert_sent_at: z.string().nullable(),
  sent_alert_content: z.string().nullable(),
});

export type AlertHistoryItem = z.infer<typeof alertHistoryItemSchema>;

export const alertHistoryResponseSchema = z.object({
  data: z.array(alertHistoryItemSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type AlertHistoryResponse = z.infer<typeof alertHistoryResponseSchema>;
