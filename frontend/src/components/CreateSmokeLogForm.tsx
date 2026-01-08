import { useForm } from "@mantine/form";
import {
  Button,
  Stack,
  NumberInput,
  Textarea,
  Chip,
  Group,
  Text,
  Box,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { REASONS } from "../consts/reasons";
import { useCreateSmokeLog } from "../hooks/useSmokeLogs";
import type { CreateSmokeLog, SmokeLogFormData } from "../types/smoke";
import { notify } from "../utils/Notification";
import { formatDate } from "../utils/dateFormatter";
import { IconExclamationCircleFilled } from "@tabler/icons-react";

export function CreateSmokeLogForm() {
  const createMutation = useCreateSmokeLog();

  const form = useForm<SmokeLogFormData>({
    initialValues: {
      date: "",
      count: 1,
      reason: "",
      notes: "",
    },

    validate: {
      date: (value) => {
        console.log(new Date(value));
        if (!value) return "Укажите дату и время";
        return null;
      },
      count: (value) => {
        if (!value) return "Укажите количество";
        if (value < 1) return "Минимум 1 сигарета";
        if (value > 20) return "Не более 20 сигарет за раз";
        return null;
      },
      reason: (value) => (!value ? "Выберите причину" : null),
    },
  });

  const handleSubmit = (values: SmokeLogFormData) => {
    const createData: CreateSmokeLog = {
      date: values.date.toString(),
      count: values.count,
      reason: values.reason,
      notes: values.notes?.trim() || undefined,
    };

    createMutation.mutate(createData, {
      onSuccess: () => {
        notify(
          "green",
          "Успех!",
          `Запись от ${formatDate(form.values.date.toString())} создана.`
        );
        form.reset();
      },

      onError: () =>
        notify(
          "red",
          "Ошибка отправки",
          form.errors.toString(),
          <IconExclamationCircleFilled />
        ),
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        <Box>
          <Text size="sm" fw={500} mb="xs">
            Дата и время
          </Text>
          <DateTimePicker
            valueFormat="DD.MM.YYYY HH:mm"
            placeholder="Выберите дату и время"
            maxDate={new Date()}
            error={form.errors.date}
            {...form.getInputProps("date")}
          />
        </Box>

        <NumberInput
          label="Количество сигарет"
          description="От 1 до 20"
          min={1}
          max={20}
          error={form.errors.count}
          {...form.getInputProps("count")}
        />

        <Box>
          <Text size="sm" fw={500} mb="xs">
            Причина
          </Text>
          <Chip.Group
            value={form.values.reason}
            onChange={(value) => form.setFieldValue("reason", value.toString())}
          >
            <Group gap="xs" wrap="wrap">
              {REASONS.map((reason) => (
                <Chip
                  key={reason.value}
                  value={reason.value}
                  color={reason.color}
                  variant="filled"
                  size="md"
                >
                  {reason.label}
                </Chip>
              ))}
            </Group>
          </Chip.Group>
          {form.errors.reason && (
            <Text size="xs" c="red" mt={4}>
              {form.errors.reason}
            </Text>
          )}
        </Box>

        <Textarea
          label="Заметки"
          placeholder="Дополнительные заметки, мысли, обстоятельства..."
          description="Необязательное поле"
          autosize
          minRows={3}
          {...form.getInputProps("notes")}
        />

        <Button
          type="submit"
          size="md"
          loading={createMutation.isPending}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Сохранение..." : "Сохранить запись"}
        </Button>
      </Stack>
    </form>
  );
}
