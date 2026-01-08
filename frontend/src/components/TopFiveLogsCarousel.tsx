import { Text, Badge, Group, Card, Center } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { IconClock, IconSmoking } from "@tabler/icons-react";
import type { SmokeLog } from "../types/smoke";
import { REASONS } from "../consts/reasons";
import { getTopFiveLogsByCount } from "../utils/filter";
import { formatDate } from "../utils/dateFormatter";
import { useRef } from "react";

interface CompactLogsCarouselProps {
  logs: SmokeLog[];
}

export function LogsCarousel({ logs }: CompactLogsCarouselProps) {
  const recentLogs = getTopFiveLogsByCount(logs);
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  if (recentLogs.length === 0) {
    return null;
  }

  return (
    <Carousel
      height={90}
      orientation="vertical"
      slideGap={0}
      withControls={false}
      withIndicators
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={() => autoplay.current.play()}
      styles={{
        indicator:{
          backgroundColor: 'grey'
        }
      }}
    >
      {recentLogs.map((log) => {
        const reason = REASONS.find((r) => r.value === log.reason);
        const date = formatDate(log.date);

        return (
          <Carousel.Slide key={log.id}>
            <Card
              withBorder
              w={340}
              h={90}
              radius={10}
              style={{ userSelect: "none" }}
            >
              <Group justify="space-between" h="100%" p="sm">
                <Group gap="xs">
                  <IconClock
                    size={16}
                    style={{ color: "var(--mantine-color-gray-6)" }}
                  />
                  <Text size="sm">{date}</Text>
                </Group>

                <Badge size="sm" variant="dot" color={reason?.color}>
                  {reason?.label}
                </Badge>

                <Group gap={4}>
                  <IconSmoking
                    size={16}
                    style={{ color: "var(--mantine-color-gray-6)" }}
                  />
                  <Text fw={700} size="sm">
                    {log.count}
                  </Text>
                </Group>
              </Group>
              <Center>
                <Text size="md" c="dimmed">
                  {log.notes}
                </Text>
              </Center>
            </Card>
          </Carousel.Slide>
        );
      })}
    </Carousel>
  );
}
