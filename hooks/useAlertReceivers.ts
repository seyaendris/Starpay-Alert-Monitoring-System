"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertReceiver,
  AlertReceiverListResponse,
  AlertReceiverPayload,
} from "@/types/alertReceiver";
import api from "@/lib/axios";

const BASE_PATH = "api/v1/starpay-alert/user";

interface ListParams {
  page: number;
  limit: number;
}

async function fetchAlertReceivers({
  page,
  limit,
}: ListParams): Promise<AlertReceiverListResponse> {
  const res = await api.get<AlertReceiverListResponse>(BASE_PATH, {
    params: { page, limit },
  });
  return res.data;
}

async function createAlertReceiver(
  payload: AlertReceiverPayload
): Promise<AlertReceiver> {
  const res = await api.post<{ data: AlertReceiver }>(BASE_PATH, payload);
  return res.data.data;
}

async function updateAlertReceiver({
  id,
  payload,
}: {
  id: string;
  payload: AlertReceiverPayload;
}): Promise<AlertReceiver> {
  const res = await api.put<{ data: AlertReceiver }>(
    `${BASE_PATH}/${id}`,
    payload
  );
  return res.data.data;
}

async function deleteAlertReceiver(id: string): Promise<void> {
  await api.delete(`${BASE_PATH}/${id}`);
}

export function useAlertReceivers(params: ListParams) {
  return useQuery({
    queryKey: ["alert-receivers", params],
    queryFn: () => fetchAlertReceivers(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateAlertReceiver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAlertReceiver,
    onSuccess: () => {
      // refetch all pages; simple but effective
      queryClient.invalidateQueries({ queryKey: ["alert-receivers"] });
    },
  });
}

export function useUpdateAlertReceiver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAlertReceiver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-receivers"] });
    },
  });
}

export function useDeleteAlertReceiver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAlertReceiver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-receivers"] });
    },
  });
}
