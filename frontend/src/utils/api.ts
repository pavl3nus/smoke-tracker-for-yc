import axios from "axios";
import type { CreateSmokeLog, SmokeLog, UpdateSmokeLog } from "../types/smoke";
import type { Tip } from "../types/tip";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE,
});


export const smokeLogsApi = {
  getAll: () => api.get<SmokeLog[]>("/smokeLogs"),
  getById: (id: string) => api.get<SmokeLog>(`/smokeLogs/${id}`),
  create: (data: CreateSmokeLog) => api.post<SmokeLog>("/smokeLogs", data),
  update: (id: string, data: UpdateSmokeLog) => {
    return api.put<SmokeLog>(`/smokeLogs/${id}`, data);
  },
  delete: (id: string) => api.delete(`/smokeLogs/${id}`),
};

export const tipsApi = {
  getAll: () => api.get<Tip[]>("/tips"),
};
