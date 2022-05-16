import components from "./nav";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import useSettings from "../../stores/settingsStore"
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
  const { defaultVideo, defaultAudio, toggleVideo, toggleAudio } = useVideoSettings();
  const { askBeforeVideo, askBeforeAudio, autoCopyLink, showConnectionTime, toggleAskBeforeVideo, toggleAskBeforeAudio, toggleAutoCopyLink, toggleShowConnectionTime } = useSettings()

  

    useEffect(() => {
      console.log(localStorage)
      var inputs = JSON.parse(localStorage.getItem('inputs'));
      inputs?.forEach(function(input) {
        if(input.id === "defaultVideoID" && input.checked !== defaultVideo) {
          toggleVideo()
          return
        }
        if(input.id === "option2" && input.checked !== defaultAudio) {
          toggleAudio()
          return
        }
        if(input.id === "option3" && input.checked !== askBeforeVideo) {
          toggleAskBeforeVideo()
          return
        }
        if(input.id === "option4" && input.checked !== askBeforeAudio) {
          toggleAskBeforeAudio()
          return
        }
        if(input.id === "option5" && input.checked !== autoCopyLink) {
          toggleAutoCopyLink()
          return
        }
        if(input.id === "option6" && input.checked !== showConnectionTime) {
          toggleShowConnectionTime()
          return
        }
      });
    }, []);
  ////////////////////////////////////////////


  return (
    <div className={globalStyles}>
      <Header />
      <section className="gap-1 grid grid-flow-row grid-cols-10 dark:bg-dark-800 bg-lt-50 grid-rows-1 h-full">
        <Sidebar
          changeMainComponent={changeMainComponent}
          MainComponent={MainComponent}
        />
        <div className="col-span-8 bg-lt-100 dark:bg-dark-900">
          <MainComponent.Component changeMainComponent={changeMainComponent}/>
        </div>
      </section>
    </div>
  );
}
