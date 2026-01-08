import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSmokeLogs } from "../hooks/useSmokeLogs";
import { Card, Text, Loader, Center } from "@mantine/core";
import { formatDate } from "../utils/dateFormatter";

export default function GraphicsPage() {
  const { data: smokeLogs, isLoading, error } = useSmokeLogs();

  const chartData = useMemo(() => {
    if (!smokeLogs || smokeLogs.length === 0) return [];

    return smokeLogs.map((log) => ({
      name: formatDate(log.date),
      count: log.count,
      date: log.date,
    }));
  }, [smokeLogs]);

  if (isLoading) {
    return (
      <Card>
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Center h={400}>
          <Text c="red">Ошибка загрузки: {error.message}</Text>
        </Center>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <Center h={400}>
          <Text c="dimmed">Нет данных для графика</Text>
        </Center>
      </Card>
    );
  }

  return (
    <Card w={1000} m="xl">
      <Text size="xl" fw={500} mb="md">
        График курения по дням
      </Text>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <Text size="sm" c="dimmed" mt="md" ta="center">
        Всего записей: {chartData.length}
      </Text>
    </Card>
  );
}
