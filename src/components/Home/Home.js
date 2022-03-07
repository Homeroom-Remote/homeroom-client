import components from "./nav";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-lt-100 text-text-900 \
                      dark:bg-dark-900 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden";
export default function Home() {
  const [MainComponent, setMainComponent] = useState(components[0]);

  const changeMainComponent = (index) => {
    if (index < 0 || index >= components.length) return;

    setMainComponent(components[index]);
  };

  return (
    <div className={globalStyles}>
      <Header />
      <section className="gap-1 grid grid-flow-row grid-cols-10 dark:bg-dark-800 bg-lt-50 grid-rows-1 h-full">
        <Sidebar
          changeMainComponent={changeMainComponent}
          MainComponent={MainComponent}
        />
        <div className="col-span-8 p-4 bg-lt-100 dark:bg-dark-900">
          <MainComponent.Component />
        </div>
      </section>
    </div>
  );
}
