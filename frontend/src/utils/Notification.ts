import { notifications } from "@mantine/notifications";
import type { ReactNode } from "react";

export function notify(
  color: string,
  title: string,
  text: string,
  icon?: ReactNode
) {
  notifications.show({
    icon: icon!,
    withBorder: true,
    radius: "lg",
    autoClose: 2000,
    title: title,
    message: text,
    color: color,
  });
}
