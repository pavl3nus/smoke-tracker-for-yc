import { useQuery, useQueryClient } from "@tanstack/react-query";
import { tipsApi } from "../utils/api";

export function useRandomTip() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["randomTip"],
    queryFn: async () => {
      const response = await tipsApi.getAll();
      const tips = response.data;

      if (!tips || tips.length === 0) {
        return null;
      }

      const randomIndex = Math.floor(Math.random() * tips.length);
      const randomTip = tips[randomIndex];

      return randomTip;
    }, staleTime: 1000 * 60 * 60 * 24
  });

  const refreshTip = () => {
    queryClient.invalidateQueries({ queryKey: ["randomTip"] });
  };

  return {
    tip: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refreshTip,
  };
}
