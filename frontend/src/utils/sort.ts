import type { SmokeLog } from "../types/smoke";

export function SortSmokelogsByDate(
  logs: SmokeLog[],
  order: "asc" | "desc" = "desc"
): SmokeLog[] {
  if (!logs || logs.length == 0) return [];

  return [...logs].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return order == "desc" ? dateB - dateA : dateA - dateB;
  });
}

export function SortSmokelogsByCount(
  logs: SmokeLog[],
  order: "asc" | "desc" = "desc"
): SmokeLog[] {
  if (!logs || logs.length == 0) return [];

  return [...logs].sort((a, b) => {
    const countA = a.count;
    const countB = b.count;

    return order == "desc" ? countB - countA : countA - countB;
  });
}

export function sortSmokeLogsByReason(
  logs: SmokeLog[],
  order: "asc" | "desc" = "asc"
): SmokeLog[] {
  if (!logs || logs.length === 0) return [];

  return [...logs].sort((a, b) => {
    const reasonA = a.reason.toLowerCase();
    const reasonB = b.reason.toLowerCase();

    return order === "asc"
      ? reasonA.localeCompare(reasonB)
      : reasonB.localeCompare(reasonA);
  });
}
