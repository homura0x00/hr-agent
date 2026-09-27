// src/components/theme-switcher.tsx
import {Button, useTheme} from "@heroui/react";

export function ThemeSwitcher() {
  const {resolvedTheme, setTheme, theme} = useTheme("system");

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={resolvedTheme === "light" ? "primary" : "secondary"}
        onPress={() => setTheme("light")}
      >
        Light
      </Button>
      <Button
        variant={resolvedTheme === "dark" ? "primary" : "secondary"}
        onPress={() => setTheme("dark")}
      >
        Dark
      </Button>
      <Button variant={theme === "system" ? "primary" : "secondary"} onPress={() => setTheme("system")}>
        System
      </Button>
    </div>
  );
}