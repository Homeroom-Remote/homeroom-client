import { wait } from "@testing-library/user-event/dist/utils";
import Video from "./Video";
import React, { useState, useEffect } from "react";
import { NextPageArrow, PrevPageArrow } from "../../utils/svgs";





export default function VideoWrapper({startIndex, toggleForward, endIndex, toggleBackward, mainSpeaker, otherParticipants, myStream, chat, myArray})
{
    const peersToShow = otherParticipants.slice(startIndex, endIndex + 1)

    return(
        <div className="row-span-9 dark:bg-dark-700 bg-lt-400 py-6 flex flex-row justify-center relative overflow-hidden gap-y-1">
            <div className="px-4 h-full flex items-center justify-center bg-black">
                <button onClick={toggleBackward}><PrevPageArrow className="w-6 h-6" /></button>
            </div>
            <div className="grid gap-x-2 gap-y-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 grid-flow-row w-full h-full">
                {peersToShow.map((peer, idx) => (<div className=" dark:bg-dark-900 bg-lt-400 w-full h-full font-bold rounded border dark:border-red-600 border-red-600 drop-shadow-lg text-white flex items-center justify-center text-4xl"><Video mediaStream={peer}/></div>))}
            </div>
            <div className="px-4 h-full flex items-center justify-center bg-black">
            <button onClick={toggleForward}><NextPageArrow className="w-6 h-6" /></button>
            </div>
        </div>
    );
}
