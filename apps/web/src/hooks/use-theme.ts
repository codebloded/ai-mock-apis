import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "lavender";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "light",
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "lavender");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
