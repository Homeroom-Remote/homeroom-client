import useTheme from "../stores/themeStore";
import { Sun, Moon } from "../utils/svgs";

export default function Theme(props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === "dark" ? (
        <Moon className="h-7 w-7 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-600 transition-all" />
      ) : (
        <Sun className="h-7 w-7 text-primary-400 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-600 transition-all" />
      )}
    </button>
  );
}

<svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-6 w-6"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
  />
</svg>;
