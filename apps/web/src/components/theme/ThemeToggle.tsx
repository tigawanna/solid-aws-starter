import { Button } from "@/components/ui/button";
import { FiMoon, FiSun } from "solid-icons/fi";
import { useThemeContext } from "./theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useThemeContext();
  const isDark = () => resolvedTheme() === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={isDark() ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark() ? "light" : "dark")}
    >
      {isDark() ? <FiMoon class="size-4" /> : <FiSun class="size-4" />}
    </Button>
  );
}
