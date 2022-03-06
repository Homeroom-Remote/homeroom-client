import { logout } from "../../api/auth";
import components from "./nav";

export default function Sidebar({ changeMainComponent, MainComponent }) {
  const getTextStyles = (index) => {
    const mainComponentIndex = components.findIndex(
      (component) => component?.name === MainComponent?.name
    );

    return mainComponentIndex === index
      ? "dark:text-primary-300 text-primary-600 font-medium"
      : "dark:text-white";
  };

  const getIconStyles = (index) => {
    const mainComponentIndex = components.findIndex(
      (component) => component?.name === MainComponent?.name
    );

    return mainComponentIndex === index
      ? "dark:text-primary-300 text-primary-600"
      : "dark:text-white";
  };
  return (
    <nav className="col-span-2 h-full justify-between flex flex-col text-xl p-2 border-r-2 dark:border-primary-400 border-primary-600">
      <div className="gap-y-3 flex flex-col">
        {components.map((component, index) => (
          <button
            className="flex flex-row gap-x-3 items-center"
            onClick={() => changeMainComponent(index)}
            key={`sidebar-link-${index}`}
          >
            <span className={getIconStyles(index)}>{component.icon}</span>
            <span className={getTextStyles(index)}>{component.name}</span>
          </button>
        ))}
      </div>
      <button
        onClick={logout}
        className="mb-12 flex flex-row items-center gap-x-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Log out</span>
      </button>
    </nav>
  );
}
