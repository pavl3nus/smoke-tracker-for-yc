import {
  Title,
  Text,
  Card,
  Group,
  RingProgress,
  Grid,
  Container,
} from "@mantine/core";
import { useSmokeLogs } from "../hooks/useSmokeLogs";
import { RandomTipCard } from "../components/RandomTipCard";
import { LogsCarousel } from "../components/TopFiveLogsCarousel";

export default function HomePage() {
  const { data: smokeLogs } = useSmokeLogs();

  const today = new Date().toLocaleDateString("ru-RU");
  const todayLogs =
    smokeLogs?.filter((log) => {
      return new Date(log.date).toLocaleDateString("ru-RU") == today;
    }) || [];

  const todayCount = todayLogs.reduce((sum, log) => sum + log.count, 0);
  const dailyLimit = 1;
  const progress = Math.min((todayCount / dailyLimit) * 100, 100);

  return (
    <Container size="lg" ml="xl">
      <Title order={1} mb="md">
        Дневник курильщика
      </Title>
      <Grid justify="space-between" columns={8}>
        <Grid.Col span={2.6}>
          <Card shadow="sm" p="lg" withBorder>
            <Group>
              <div>
                <Text size="lg" fw={500}>
                  Сегодня
                </Text>
                <Text size="xl" fw={700}>
                  {todayCount} сигарет
                </Text>
                <Text mt="4px">Цель: не более {dailyLimit} в день</Text>
              </div>
              <RingProgress
                size={80}
                thickness={8}
                sections={[
                  {
                    value: progress,
                    color: todayCount > dailyLimit ? "red" : "blue",
                  },
                ]}
                label={
                  <Text size="xs" ta="center">
                    {todayCount}/{dailyLimit}
                  </Text>
                }
              />
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={5.4}>
          <Card shadow="sm" p="lg" withBorder>
            <Grid columns={5} justify="space-between">
              <Grid.Col span={2}>
                <Text size="lg" fw={500}>
                  Топ 5 по количеству:
                </Text>
                <Text mt="sm">Всего записей: {smokeLogs?.length || 0}</Text>
                <Text>
                  Всего сигарет:{" "}
                  {smokeLogs?.reduce((sum, log) => sum + log.count, 0) || 0}
                </Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <LogsCarousel logs={smokeLogs!} />
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
        <Grid.Col span={8}>
          <RandomTipCard />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
