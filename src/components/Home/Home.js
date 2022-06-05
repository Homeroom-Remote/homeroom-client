import components from "./nav";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import useSettings from "../../stores/settingsStore";
import useVideoSettings from "../../stores/videoSettingsStore";
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

  /////////////////////////////////////////////
  // load settings
  /////////////////////////////////////////////
  const { defaultVideo, defaultAudio, toggleVideo, toggleAudio } =
    useVideoSettings();
  const {
    askBeforeVideo,
    askBeforeAudio,
    autoCopyLink,
    showConnectionTime,
    toggleAskBeforeVideo,
    toggleAskBeforeAudio,
    toggleAutoCopyLink,
    toggleShowConnectionTime,
  } = useSettings();

  useEffect(() => {
    const inputs = JSON.parse(localStorage.getItem("inputs"));
    Object?.entries(inputs)?.forEach(([k, v]) => {
      if (k === "askBeforeAudio" && askBeforeAudio !== v)
        toggleAskBeforeAudio();
      else if (k === "askBeforeVideo" && askBeforeVideo !== v)
        toggleAskBeforeVideo();
      else if (k === "autoCopyLink" && autoCopyLink !== v) toggleAutoCopyLink();
      else if (k === "showConnectionTime" && showConnectionTime !== v)
        toggleShowConnectionTime();
      else if (k === "defaultVideo" && defaultVideo !== v) toggleVideo();
      else if (k === "defaultAudio" && defaultAudio !== v) toggleAudio();
    });
  }, []);
  ////////////////////////////////////////////

  return (
    <div className={globalStyles}>
      <Header />
      <section className="grid grid-flow-row grid-cols-10 dark:bg-dark-800 bg-lt-300 grid-rows-1 h-full mt-[.5px]">
        <Sidebar
          changeMainComponent={changeMainComponent}
          MainComponent={MainComponent}
        />
        <div className="col-span-8 bg-lt-200 dark:bg-dark-900">
          <MainComponent.Component changeMainComponent={changeMainComponent} />
        </div>
      </section>
    </div>
  );
}
