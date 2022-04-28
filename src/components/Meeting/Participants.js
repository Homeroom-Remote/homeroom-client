import { useState, useEffect, useRef } from "react";
import useUser from "../../stores/userStore";
import {
    Mic,
    MutedMic,
    Cam,
    MutedCam,
  } from "../../utils/svgs";



export default function Participants({peers, cameraState, microphoneState, isChatOpen}) {

    function buttonClicked(idx) {
        console.log(idx)
    };

    const MicLogoOn = Mic;
    const MicLogoOff = MutedMic;
    const CamLogoOn = Cam;
    const CamLogoOff = MutedCam;

    const { user } = useUser()

  

    useEffect(() => {
        peers.map((peer, idx) => {
            console.log(peer)
        })
    }, [cameraState]);

      useEffect(() => {
        peers.map((peer, idx) => {
            console.log(peer)
        })
    }, [microphoneState]);

    return (
        <div className={"flex flex-col text-center dark:bg-dark-900 bg-lt-50 col-span-3 gap-y-10 " + (isChatOpen ? "h-1/2" : "h-full")}>
            <div className="font-extrabold">
                Participants
            </div>
            <div className=" flex flex-col gap-y-4 h-full overflow-auto">
                <div className="flex flex-row justify-between items-center">
                    <div>
                    <p className="font-bold text-primary-600">{user.displayName}</p>
                    </div>
                    <div className="flex flex-row gap-x-1 justify-center items-center mr-4">
                    {microphoneState ? <MicLogoOn className="h-5 w-8 mt-1" /> : <MicLogoOff className="h-5 w-8 mt-1" />}
                    {cameraState ? <CamLogoOn className="h-5 w-8 mr-5 mt-1" /> : <CamLogoOff className="h-5 w-8 mr-5 mt-1" />}
                    <button className="font-bold" onClick={() => buttonClicked(-1)}>press</button>
                    </div>
                </div>
                {peers.map((peer, idx) => (
                <div className="flex flex-row justify-between mr-4">
                    <div>
                    <p className="font-bold text-primary-600">{peer.name}</p>
                    </div>
                    <div className="flex flex-row gap-x-1">
                    {((typeof peer.stream?.getAudioTracks()[0] === 'undefined') || (peer.stream?.getAudioTracks()[0]?.muted)) ? <MicLogoOff className="h-5 w-8 mt-1" /> : <MicLogoOn className="h-5 w-8 mt-1" />}
                    {((typeof peer.stream?.getVideoTracks()[0] === 'undefined') || (!peer.stream?.getVideoTracks()[0]?.enabled)) ? <CamLogoOff className="h-5 w-8 mr-5 mt-1" /> : <CamLogoOn className="h-5 w-8 mr-5 mt-1" />}
                    <button className="font-bold" onClick={() => buttonClicked(idx)}>press</button>
                    </div>
                </div>
                ))}
            </div>
        </div>
      );
  }