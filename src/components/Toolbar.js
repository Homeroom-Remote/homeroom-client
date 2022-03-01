import { Mic, MutedMic, Cam, MutedCam, Security, Participants, Chat, ShareScreen, Record, Reactions } from "../utils/svgs";
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
        <div className="flex flex-col items-center hover:bg-blue-700">
        <LogoOn className="h-7 w-7"/>
        <span className="text-green-600">{textOn}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center hover:bg-blue-700">
        <LogoOff className="h-7 w-7"/>
        <span className="text-green-600">{textOff}</span>
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
  const [security, setSecurity] = useState(false)
  const toggleSecurity = () => { setSecurity(!security) }
  const [participants, setParticipants] = useState(false)
  const toggleParticipants = () => { setParticipants(!participants) }
  const [chat, setChat] = useState(false)
  const toggleChat = () => { setChat(!chat) }
  const [shareScreen, setShareScreen] = useState(false)
  const toggleShareScreen = () => { setShareScreen(!shareScreen) }
  const [record, setRecord] = useState(false)
  const toggleRecord = () => { setRecord(!record) }
  const [reactions, setReactions] = useState(false)
  const toggleReactions = () => { setReactions(!reactions) }
  return (
    <div className="flex justify-between bg-black w-full absolute bottom-0 left-0">
    <div className="flex flex-row gap-x-4">
      <ToolbarButton state={camera} toggle={toggleCamera} logoOn={Cam} logoOff={MutedCam} textOn={"Stop"} textOff={"Play"} />
      <ToolbarButton state={microphone} toggle={toggleMicrophone} logoOn={Mic} logoOff={MutedMic} textOn={"Mute"} textOff={"Unmute"} />
      </div>
      <div className="flex flex-row gap-x-6">
      <ToolbarButton className="hover:text-primary-900" state={security} toggle={toggleSecurity} logoOn={Security} logoOff={Security} textOn={"Security"} textOff={"Security"} />
      <ToolbarButton state={participants} toggle={toggleParticipants} logoOn={Participants} logoOff={Participants} textOn={"Participants"} textOff={"Participants"} />
      <ToolbarButton state={chat} toggle={toggleChat} logoOn={Chat} logoOff={Chat} textOn={"Chat"} textOff={"Chat"} />
      <ToolbarButton state={shareScreen} toggle={toggleShareScreen} logoOn={ShareScreen} logoOff={ShareScreen} textOn={"Share Screen"} textOff={"Share Screen"} />
      <ToolbarButton state={record} toggle={toggleRecord} logoOn={Record} logoOff={Record} textOn={"Record"} textOff={"Record"} />
      <ToolbarButton state={reactions} toggle={toggleReactions} logoOn={Reactions} logoOff={Reactions} textOn={"Reactions"} textOff={"Reactions"} />
     </div>
     <div>
       <button className="hover:bg-blue-500">
       <span class="text-red-600">Quit</span>
       </button>
     </div>
     </div>
  );
}

