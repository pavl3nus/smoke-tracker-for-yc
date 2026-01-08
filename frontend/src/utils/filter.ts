import type { SmokeLog } from "../types/smoke";
import { SortSmokelogsByCount } from "./sort";

export function getTopFiveLogsByCount(logs: SmokeLog[]): SmokeLog[] {
  if (!logs || logs.length === 0) return [];
  return SortSmokelogsByCount(logs, "asc").slice(-5).reverse();
}

export function filterLogsByCount(logs: SmokeLog[], min: number, max: number): SmokeLog[] {
  if (!logs || logs.length === 0) return [];
  return logs.filter((log) => min <= log.count && log.count <= max)
}
