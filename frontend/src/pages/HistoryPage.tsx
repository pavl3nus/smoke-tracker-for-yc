import {
  Title,
  Table,
  Text,
  Card,
  Group,
  SegmentedControl,
  Switch,
  RangeSlider,
  Container,
} from "@mantine/core";
import { SmokeLogActions } from "../components/SmokeLogActions";
import { REASONS } from "../consts/reasons";
import { SORT_CONTROL_DATA } from "../consts/sortControlData";
import { formatDate, formatTime } from "../utils/dateFormatter";
import { IconArrowDown, IconArrowUp, IconCalendar, IconClock, IconNotes, IconQuestionMark, IconSettings, IconSmoking } from "@tabler/icons-react";
import { useSmokeLogsSorting } from "../hooks/useSort";
import { useState } from "react";
import { filterLogsByCount } from "../utils/filter";
import { AnimatePresence, motion } from "framer-motion";

export default function HistoryPage() {
  
  const {
    sortedLogs,
    sortField,
    sortOrder,
    handleSortFieldChange,
    handleSortOrderChange,
    isLoading,
    error
  } = useSmokeLogsSorting();
  const [countRange, setCountRange] = useState<[number, number]>([0, 20]);

  if (isLoading) return <Text>Загрузка...</Text>;
  if (error) return <Text>Ошибка загрузки данных</Text>;

  const filteredLogs = filterLogsByCount(
    sortedLogs || [],
    countRange[0],
    countRange[1]
  );

  return (
    <Container size="lg" ml="xl">
      <Title order={1} mb="md">
        История записей
      </Title>
      <Group justify="space-between" mb="sm">
        <Title order={4}>Количество сигарет:</Title>
        <RangeSlider
          w={200}
          value={countRange}
          onChange={setCountRange}
          minRange={2}
          min={0}
          max={20}
          color="gray"
          marks={[
            { value: 0, label: "0" },
            { value: 10, label: "10" },
            { value: 20, label: "20" },
          ]}
        />
        <SegmentedControl
          data={SORT_CONTROL_DATA}
          value={sortField}
          onChange={handleSortFieldChange}
        />
        <Switch
          size="md"
          color="gray"
          checked={sortOrder === "asc"}
          onChange={(event) =>
            handleSortOrderChange(event.currentTarget.checked)
          }
          onLabel={<IconArrowUp size={16} stroke={2.5} />}
          offLabel={<IconArrowDown size={16} stroke={2.5} />}
        />
      </Group>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${filteredLogs.length}${sortField}-${sortOrder}-${countRange[0]}-${countRange[1]}`}
          initial={{
            maxHeight: 0,
            opacity: 0,
            filter: "blur(15px)",
          }}
          animate={{
            maxHeight: 1000,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
              duration: 0.4,
              filter: { duration: 0.35 },
            },
          }}
          exit={{
            maxHeight: 0,
            opacity: 0,
            filter: "blur(20px)",
            transition: {
              duration: 0.35,
              filter: { duration: 0.3 },
            },
          }}
          style={{ overflow: "hidden" }}
          whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
        >
          <Card shadow="sm" p="lg" withBorder w={870}>
            {filteredLogs.length ? (
              <Table striped highlightOnHover ta="center">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w={90} ta="center">
                      <IconCalendar />
                    </Table.Th>
                    <Table.Th w={60} ta="center">
                      <IconClock />
                    </Table.Th>
                    <Table.Th w={60} ta="center">
                      <IconSmoking />
                    </Table.Th>
                    <Table.Th w={120} ta="center">
                      <IconQuestionMark />
                    </Table.Th>
                    <Table.Th w={340} ta="center">
                      <IconNotes />
                    </Table.Th>
                    <Table.Th w={60} ta="center">
                      <IconSettings />
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredLogs.map((smokeLog) => (
                    <Table.Tr key={smokeLog.id}>
                      <Table.Td>{formatDate(smokeLog.date)}</Table.Td>
                      <Table.Td>{formatTime(smokeLog.date)}</Table.Td>
                      <Table.Td ta="center" fw={"700"}>
                        {smokeLog.count}
                      </Table.Td>
                      <Table.Td>
                        <Text
                          c={
                            REASONS.find((r) => r.value === smokeLog.reason)
                              ?.color || "gray"
                          }
                          fw={500}
                        >
                          {REASONS.find((r) => r.value === smokeLog.reason)
                            ?.label || smokeLog.reason}
                        </Text>
                      </Table.Td>
                      <Table.Td>{smokeLog.notes || ""}</Table.Td>
                      <Table.Td>
                        <SmokeLogActions smokeLog={smokeLog} />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text ta="center" c="dimmed" py="md">
                Нет записей
              </Text>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
