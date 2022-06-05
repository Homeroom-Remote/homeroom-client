import { useEffect } from "react";
import useVideoSettings from "../../../stores/videoSettingsStore";
import useSettings from "../../../stores/settingsStore";
import Toggle from "../../Toggle";

export default function Settings() {
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
    var inputs = {
      defaultVideo,
      defaultAudio,
      askBeforeVideo,
      askBeforeAudio,
      autoCopyLink,
      showConnectionTime,
    };
    localStorage.setItem("inputs", JSON.stringify(inputs));
  }, [
    defaultVideo,
    defaultAudio,
    askBeforeVideo,
    askBeforeAudio,
    autoCopyLink,
    showConnectionTime,
  ]);

  return (
    <article className="w-full h-full p-4 flex flex-col overflow-hidden gap-y-5">
      <h1 className="font-bold text-3xl flex justify-center">Settings</h1>
      <div className="w-full h-full flex flex-col gap-y-5 relative overflow-hidden">
        <Toggle
          text={"Turn on my video when joining a meeting."}
          checked={defaultVideo}
          onChange={toggleVideo}
          id={"default-video-toggle"}
        />
        <Toggle
          text={"Unmute my microphone when joining a meeting."}
          checked={defaultAudio}
          onChange={toggleAudio}
          id={"default-audio-toggle"}
        />
        <Toggle
          text={"Always ask me before turning on my video."}
          checked={askBeforeVideo}
          onChange={toggleAskBeforeVideo}
          id={"ask-video-toggle"}
        />
        <Toggle
          text={"Always ask me before unmuting my microphone."}
          checked={askBeforeAudio}
          onChange={toggleAskBeforeAudio}
          id={"ask-audio-toggle"}
        />
        <Toggle
          text={"Automatically copy invite link once the meeting starts."}
          checked={autoCopyLink}
          onChange={toggleAutoCopyLink}
          id={"copy-link-toggle"}
        />
        <Toggle
          text={"Show my connented time."}
          checked={showConnectionTime}
          onChange={toggleShowConnectionTime}
          id={"show-time-toggle"}
        />
      </div>
    </article>
  );
}
