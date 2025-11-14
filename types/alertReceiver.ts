export interface AlertReceiver {
  id: string;
  email: string;
  phone_number: string;
  level: number;
  created_at: string; // timestamp string from API (ms)
  updated_at: string; // timestamp string from API (ms)
}

export interface AlertReceiverListResponse {
  status: string;
  message: string;
  data: AlertReceiver[];
  page: number;
  limit: number;
  total: number;
}

export interface AlertReceiverPayload {
  email: string;
  phone_number: string;
  level: number;
}
