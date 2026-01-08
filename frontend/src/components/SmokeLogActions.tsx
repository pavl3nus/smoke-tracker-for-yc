import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import type { SmokeLog } from "../types/smoke";
import { DeleteSmokeLogPopover } from "./DeleteSmokeLogPopover";
import { EditSmokeLogPopover } from "./EditSmokeLogPopover";

interface SmokeLogActionsProps {
  smokeLog: SmokeLog;
}

export function SmokeLogActions({ smokeLog }: SmokeLogActionsProps) {
  return (
    <Group gap="xs" wrap="nowrap">
      <EditSmokeLogPopover smokeLog={smokeLog}>
        {({ open }) => (
          <Tooltip label="Редактировать" position="top" withArrow>
            <ActionIcon variant="light" color="blue" onClick={open}>
              <IconEdit size="1rem" />
            </ActionIcon>
          </Tooltip>
        )}
      </EditSmokeLogPopover>

      <DeleteSmokeLogPopover smokeLog={smokeLog}>
        {({ open }) => (
          <Tooltip label="Удалить" position="top" withArrow>
            <ActionIcon variant="light" color="red" onClick={open}>
              <IconTrash size="1rem" />
            </ActionIcon>
          </Tooltip>
        )}
      </DeleteSmokeLogPopover>
    </Group>
  );
}
