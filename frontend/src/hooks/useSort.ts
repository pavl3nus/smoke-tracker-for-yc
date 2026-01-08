import { useState, useMemo } from "react";
import {
  SortSmokelogsByDate,
  SortSmokelogsByCount,
  sortSmokeLogsByReason,
} from "../utils/sort";
import { useSmokeLogs } from "./useSmokeLogs";

type SortField = "date" | "reason" | "count";
type SortOrder = "asc" | "desc";

export function useSmokeLogsSorting() {
  const { data: smokeLogs, isLoading, error } = useSmokeLogs();
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSortFieldChange = (value: string) => {
    setSortField(value as SortField);
  };

  const handleSortOrderChange = (checked: boolean) => {
    setSortOrder(checked ? "asc" : "desc");
  };

  const sortedLogs = useMemo(() => {
    if (!smokeLogs || smokeLogs.length === 0) return [];

    switch (sortField) {
      case "date":
        return SortSmokelogsByDate(smokeLogs, sortOrder);

      case "count":
        return SortSmokelogsByCount(smokeLogs, sortOrder);

      case "reason":
        return sortSmokeLogsByReason(smokeLogs, sortOrder);

      default:
        return SortSmokelogsByDate(smokeLogs, "desc");
    }
  }, [smokeLogs, sortField, sortOrder]);

  return {
    sortedLogs,
    sortField,
    sortOrder,
    handleSortFieldChange,
    handleSortOrderChange,
    isLoading,
    error
  };
}
