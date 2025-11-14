export interface Account {
  id: string;
  username: string;
  role: string;
  is_active: boolean;
}

export interface AccountListResponse {
  status: number | string;
  message: string;
  data: Account[];
  page: number;
  limit: number;
  total: number;
}

export interface CreateAccountPayload {
  username: string;
  password: string;
  role: string;
}

export interface UpdateAccountPayload {
  username: string;
  role: string;
  is_active: boolean;
}
