import {
  Popover,
  TextInput,
  NumberInput,
  Chip,
  Button,
  Stack,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUpdateSmokeLog } from "../hooks/useSmokeLogs";
import type { SmokeLog, UpdateSmokeLog } from "../types/smoke";
import { useState } from "react";
import { REASONS } from "../consts/reasons";
import { notify } from "../utils/Notification";
import {
  IconExclamationCircleFilled,
  IconProgressCheck,
} from "@tabler/icons-react";

interface EditSmokeLogPopoverProps {
  smokeLog: SmokeLog;
  children: (props: { open: () => void }) => React.ReactNode;
}

interface EditFormValues {
  count: number;
  reason: string;
  notes: string;
}

export function EditSmokeLogPopover({
  smokeLog,
  children,
}: EditSmokeLogPopoverProps) {
  const [opened, setOpened] = useState(false);
  const updateMutation = useUpdateSmokeLog();

  const form = useForm<EditFormValues>({
    initialValues: {
      count: smokeLog.count,
      reason: smokeLog.reason,
      notes: smokeLog.notes || "",
    },
  });

  const handleSubmit = (values: EditFormValues) => {
    const updateData: UpdateSmokeLog = {
      id: smokeLog.id,
      date: smokeLog.date,
      count: values.count,
      reason: values.reason,
      notes: values.notes.trim() || undefined,
      createdAt: smokeLog.createdAt,
    };

    updateMutation.mutate(
      { id: smokeLog.id, data: updateData },
      {
        onSuccess: () => {
          notify("green", "Успех!", "Данные обновлены.", <IconProgressCheck />);
          setOpened(false);
        },
        onError: (error) => {
          notify(
            "red",
            "Ошибка",
            error.message,
            <IconExclamationCircleFilled />
          );
        },
      }
    );
  };

  const handleClose = () => {
    setOpened(false);
    form.reset();
  };

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom"
      withArrow
      shadow="md"
      width={350}
      closeOnClickOutside={true}
      closeOnEscape={true}
    >
      <Popover.Target>
        {children({ open: () => setOpened(true) })}
      </Popover.Target>

      <Popover.Dropdown>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <NumberInput
              label="Количество сигарет"
              min={1}
              max={20}
              {...form.getInputProps("count")}
              size="xs"
            />

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--mantine-font-size-xs)",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                Причина
              </label>
              <Chip.Group
                value={form.values.reason}
                onChange={(value) =>
                  form.setFieldValue("reason", value.toString())
                }
              >
                <Group gap="xs" wrap="wrap">
                  {REASONS.map((reason) => (
                    <Chip
                      key={reason.value}
                      value={reason.value}
                      color={reason.color}
                      size="xs"
                      variant="filled"
                    >
                      {reason.label}
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            </div>

            <TextInput
              label="Заметки"
              placeholder="Дополнительные заметки..."
              {...form.getInputProps("notes")}
              size="xs"
            />

            <Group justify="flex-end" gap="xs">
              <Button
                variant="subtle"
                size="xs"
                type="button"
                onClick={handleClose}
                disabled={updateMutation.isPending}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                size="xs"
                loading={updateMutation.isPending}
              >
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
}
