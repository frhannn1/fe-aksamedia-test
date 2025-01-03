import React, { createContext, useEffect, useState } from "react";

// Create Context
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "system"
  );

  // Function to apply theme
  const applyTheme = (currentTheme) => {
    const root = window.document.documentElement;

    if (currentTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else if (currentTheme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", isDarkMode);
      root.classList.toggle("light", !isDarkMode);
    }
  };

  // Apply theme on load and save preference
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Handle OS theme changes
  useEffect(() => {
    const systemThemeChangeHandler = (e) => {
      if (theme === "system") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", systemThemeChangeHandler);

    return () => {
      mediaQuery.removeEventListener("change", systemThemeChangeHandler);
    };
  }, [theme]);

  return (
    
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
