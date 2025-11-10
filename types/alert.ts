export type AlertHistoryItem = {
  id: number;
  alert_name: string;
  alert_message: string;
  error_count: number;
  fragment_identifier: string;
  alert_type: 'normal' | 'escalate' | 'escalated' | string;
  notification_level_used: number;
  alert_receivers_email: string | null;
  alert_receivers_phone_number: string | null;
  is_sent: boolean;
  created_at: string;
  updated_at: string;
  alert_sent_at: string | null;
  sent_alert_content: string | null;
};