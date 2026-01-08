import { Switch, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";

export default function ThemeSwitcher() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const switchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAnimating && switchRef.current) {
      switchRef.current.checked = colorScheme === "dark";
    }
  }, [colorScheme, isAnimating]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;
    setIsAnimating(true);
    setTimeout(() => {
      setColorScheme(isChecked ? "dark" : "light");
      setIsAnimating(false);
    }, 150);
  };

  return (
    <Switch
      size="md"
      color="gray"
      onLabel={<IconSun size={20} stroke={1.5} />}
      offLabel={<IconMoon size={20} stroke={1.5} />}
      onChange={handleChange}
      ref={switchRef}
      defaultChecked={colorScheme === "dark"}
    />
  );
}
