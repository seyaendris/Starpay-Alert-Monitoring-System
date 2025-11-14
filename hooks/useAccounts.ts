"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AccountListResponse,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/types/account";
import api from "@/lib/axios";

const BASE_PATH = "api/v1/starpay-alert/account";

interface ListParams {
  page: number;
  limit: number;
}

async function fetchAccounts(params: ListParams): Promise<AccountListResponse> {
  const res = await api.get<AccountListResponse>(BASE_PATH, {
    params,
  });
  return res.data;
}

async function createAccount(payload: CreateAccountPayload): Promise<void> {
  await api.post(BASE_PATH, payload);
}

async function updateAccount({
  id,
  payload,
}: {
  id: string;
  payload: UpdateAccountPayload;
}): Promise<void> {
  await api.put(`${BASE_PATH}/${id}`, payload);
}

async function deleteAccount(id: string): Promise<void> {
  await api.delete(`${BASE_PATH}/${id}`);
}

export function useAccounts(params: ListParams) {
  return useQuery<AccountListResponse, unknown>({
    queryKey: ["accounts", params],
    queryFn: () => fetchAccounts(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, CreateAccountPayload>({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, { id: string; payload: UpdateAccountPayload }>(
    {
      mutationFn: updateAccount,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
      },
    }
  );
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
