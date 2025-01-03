import { useEffect, useState } from "react";

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "system" // Default to system
  );

  // Function to apply the theme
  const applyTheme = (currentTheme) => {
    const root = window.document.documentElement;

    if (currentTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else if (currentTheme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      // System mode: check OS preference
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", isDarkMode);
      root.classList.toggle("light", !isDarkMode);
    }
  };

  // Handle OS theme change
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

  // Apply theme on load and when theme changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme); // Save preference
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Dark Mode / Light Mode Toggle</h1>
      <p className="mb-4">Current Mode: {theme}</p>
      <div className="space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setTheme("light")}
        >
          Light Mode
        </button>
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          onClick={() => setTheme("dark")}
        >
          Dark Mode
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => setTheme("system")}
        >
          Follow System
        </button>
      </div>
    </div>
  );
}
