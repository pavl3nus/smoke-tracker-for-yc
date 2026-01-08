import {
  Card,
  Text,
  Group,
  Badge,
  Stack,
  ActionIcon,
  Loader,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useRandomTip } from "../hooks/useTips";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_CONFIG } from "../consts/catetegories";

export function RandomTipCard() {
  const { tip, isLoading, isFetching, refreshTip } = useRandomTip();

  const handleRefresh = async () => {
    refreshTip();
  };

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card shadow="sm" padding="lg" withBorder radius="md">
          <Group justify="center">
            <Loader size="sm" />
            <Text>Загрузка совета...</Text>
          </Group>
        </Card>
      </motion.div>
    );
  }

  if (!tip) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card shadow="sm" padding="lg" withBorder radius="md">
          <Text>Нет доступных советов</Text>
        </Card>
      </motion.div>
    );
  }

  const category = CATEGORY_CONFIG[tip.category] || CATEGORY_CONFIG.general;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tip.id}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <Card shadow="lg" padding="lg" withBorder radius="md">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Group gap="xs">
                <motion.div
                  key={`badge-${tip.category}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <Badge color={category.color} variant="light" size="lg">
                    {category.label}
                  </Badge>
                </motion.div>
              </Group>

              <motion.div
                animate={{ rotate: isFetching ? 360 : 0 }}
                transition={{
                  duration: 0.5,
                  repeat: isFetching ? Infinity : 0,
                }}
              >
                <ActionIcon
                  variant="light"
                  color="gray"
                  onClick={handleRefresh}
                  loading={isFetching}
                  title="Новый случайный совет"
                >
                  <IconRefresh size="1.2rem" />
                </ActionIcon>
              </motion.div>
            </Group>

            <motion.div
              key={`text-${tip.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Text size="xl" fw={600}>
                {tip.text}
              </Text>
            </motion.div>

            <Group justify="space-between" mt="sm">
              <Text size="sm" c="dimmed">
                Случайный совет • Обновляется по кнопке
              </Text>
            </Group>
          </Stack>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}