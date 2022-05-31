import { logout } from "../../api/auth";
import components from "./nav";

function LogoutButton() {
  return (
    <button
      onClick={logout}
      className="mb-12 flex flex-row items-center gap-x-3 dark:text-white text-text-600"
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
      <span className="dark:text-white text-text-600">Log out</span>
    </button>
  );
}

function SidebarColumn({ bottom, changeMainComponent, MainComponent }) {
  const getTextStyles = (index) => {
    const mainComponentIndex = components.findIndex(
      (component) => component?.name === MainComponent?.name
    );

    return mainComponentIndex === index
      ? "dark:text-primary-400 text-primary-700 font-medium"
      : "dark:text-white text-text-600";
  };

  const getIconStyles = (index) => {
    const mainComponentIndex = components.findIndex(
      (component) => component?.name === MainComponent?.name
    );

    return mainComponentIndex === index
      ? "dark:text-primary-400 text-primary-700"
      : "dark:text-white text-text-600";
  };
  return (
    <div className="gap-y-3 flex flex-col">
      {components.map(
        (component, index) =>
          component.bottom === bottom && (
            <button
              className="flex flex-row gap-x-3 items-center"
              onClick={() => changeMainComponent(index)}
              key={`sidebar-link-${index}`}
            >
              <span className={getIconStyles(index)}>{component.icon}</span>
              <span className={getTextStyles(index)}>{component.name}</span>
            </button>
          )
      )}
    </div>
  );
}

export default function Sidebar({ changeMainComponent, MainComponent }) {
  return (
    <nav className="col-span-2 h-full justify-between flex flex-col text-xl p-2">
      <article>
        <SidebarColumn
          bottom={false}
          changeMainComponent={changeMainComponent}
          MainComponent={MainComponent}
        />
      </article>
      <article className="gap-y-3 flex flex-col">
        <SidebarColumn
          bottom={true}
          changeMainComponent={changeMainComponent}
          MainComponent={MainComponent}
        />
        <LogoutButton />
      </article>
    </nav>
  );
}
