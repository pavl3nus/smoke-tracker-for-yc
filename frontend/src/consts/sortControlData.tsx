import { Center } from "@mantine/core";

export const SORT_CONTROL_DATA = [
  {
    value: "date",
    label: (
      <Center>
        <span>По дате</span>
      </Center>
    ),
  },
  {
    value: "reason",
    label: (
      <Center>
        <span>По причине</span>
      </Center>
    ),
  },
  {
    value: "count",
    label: (
      <Center>
        <span>По количеству</span>
      </Center>
    ),
  },
];
