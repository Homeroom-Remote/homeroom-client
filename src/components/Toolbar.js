import { Mic, MutedMic, Cam, MutedCam } from "../utils/svgs";
import { useState } from "react"


function ToolbarButton(props) {
  const theState = props.state
  const toggle = props.toggle
  const LogoOn = props.logoOn
  const LogoOff = props.logoOff
  const textOn = props.textOn
  const textOff = props.textOff
  return(
    <button onClick={toggle}>
      {theState === true ? (
        <div>
        <LogoOn className="h-7 w-7 text-primary-600 hover:text-primary-900 transition-all" />
        <span>{textOn}</span>
        </div>
      ) : (
        <div>
        <LogoOff className="h-7 w-7 text-primary-600 hover:text-primary-900 transition-all" />
        <span>{textOff}</span>
        </div>
      )}
      </button>
  );
}

export default function Toolbar(props) {
  const [camera, setCamera] = useState(false)
  const toggleCamera = () => { setCamera(!camera) }
  const [microphone, setMicrophone] = useState(false)
  const toggleMicrophone = () => { setMicrophone(!microphone) }
  return (
    <div className="flex flex-row gap-x-4 bg-red-600 w-full">
      <ToolbarButton state={camera} toggle={toggleCamera} logoOn={Cam} logoOff={MutedCam} textOn={"Stop"} textOff={"Play"} />
      <ToolbarButton state={microphone} toggle={toggleMicrophone} logoOn={Mic} logoOff={MutedMic} textOn={"Mute"} textOff={"Unmute"} />
     </div>
  );
}

