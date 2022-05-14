import { useEffect, useState } from "react";
import useVideoSettings from "../../../stores/videoSettingsStore";
import Dashboard from "../Dashboard/Dashboard";
import useSettings from "../../../stores/settingsStore"



export default function Settings( {changeMainComponent} ) {

    const { defaultVideo, defaultAudio, toggleVideo, toggleAudio } = useVideoSettings();
    const { askBeforeVideo, askBeforeAudio, autoCopyLink, showConnectionTime, toggleAskBeforeVideo, toggleAskBeforeAudio, toggleAutoCopyLink, toggleShowConnectionTime } = useSettings()
    
    
    useEffect(() => {
        var inputs = JSON.parse(localStorage.getItem('inputs'));
        inputs?.forEach(function(input) {
          document.getElementById(input.id).checked = input.checked;
        });
    }, []);

    const saveChanges = () => {
        var inputs = document.querySelectorAll('input[type="checkbox"]')
        var arrData = [];
        inputs?.forEach(function(input){
            arrData.push({ id: input.id, checked: input.checked });
            if(input.id === "defaultVideoID" && input.checked === defaultVideo) {
                toggleVideo()
                return
            }
            if(input.id === "option2" && input.checked === defaultAudio) {
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
        localStorage.setItem('inputs', JSON.stringify(arrData));
        changeMainComponent(0)
    };


  return (
    <div className="w-full h-full flex flex-col gap-y-5 relative overflow-hidden" id="checkBoxArray">
        <h1 className="font-bold text-3xl flex justify-center">Settings</h1>
        <div className="flex flex-row ml-3 gap-x-8"><div><input className="cb" type="checkbox" id="defaultVideoID" /></div><div className="font-bold">Turn off my video when joining meeting</div></div>
        <div className="flex flex-row ml-3 gap-x-8"><div><input className="cb" type="checkbox" id="option2" /></div><div className="font-bold">Mute my microphone when joining meeting</div></div>
        <div className="flex flex-row ml-3 gap-x-8"><div><input className="cb" type="checkbox" id="option3"  /></div><div className="font-bold">Always ask me before turning on my video</div></div>
        <div className="flex flex-row ml-3 gap-x-8"><div><input className="cb" type="checkbox" id="option4"  /></div><div className="font-bold">Always ask me before unmuting my microphone</div></div>
        <div className="flex flex-row ml-3 gap-x-8"><div><input className="cb" type="checkbox" id="option5"  /></div><div className="font-bold">Automatically copy invite link once the meeting starts</div></div>
        <div className="flex flex-row ml-3 gap-x-8"><div><input className="cb" type="checkbox" id="option6"  /></div><div className="font-bold">Show my connented time</div></div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 border border-blue-700 m-10 rounded self-center" onClick={saveChanges}>Save</button>
    </div>
  );
}
