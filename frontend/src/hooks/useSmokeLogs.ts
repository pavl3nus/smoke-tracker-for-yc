import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { smokeLogsApi } from "../utils/api";
import type { CreateSmokeLog, UpdateSmokeLog } from "../types/smoke";
import { SortSmokelogsByDate } from "../utils/sort";

export function useSmokeLogs() {
  return useQuery({
    queryKey: ["smokeLogs"],
    queryFn: async () => {
      const response = await smokeLogsApi.getAll();
      return SortSmokelogsByDate(response.data);
    },
  });
}

export function useCreateSmokeLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSmokeLog) => smokeLogsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smokeLogs"] });
    },
  });
}

export function useDeleteSmokeLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => smokeLogsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smokeLogs"] });
    },
  });
}

export function useUpdateSmokeLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSmokeLog }) =>
      smokeLogsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smokeLogs"] });
    },
  });
}
