import Theme from "../Theme";
import components from "./nav";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-background-100 text-text-900 \
                      dark:bg-background-800 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden";
export default function Home() {
  const [MainComponent, setMainComponent] = useState(components[0]);

  const changeMainComponent = (index) => {
    if (index < 0 || index >= components.length) return;

    setMainComponent(components[index]);
  };

  return (
    <div className={globalStyles}>
      <header className="w-full first-letter:h-16 dark:bg-background-700 bg-background-200 flex flex-row justify-between p-2">
        <div>Logo</div>
        <div>
          <Theme />
        </div>
      </header>
      <section className="gap-1 grid grid-flow-row grid-cols-10 dark:bg-background-600 bg-background-100 Ggrid-rows-1 h-full">
        <Sidebar
          changeMainComponent={changeMainComponent}
          MainComponent={MainComponent}
        />
        <div className="col-span-8 p-4">
          <MainComponent.Component />
        </div>
      </section>
    </div>
  );
}
