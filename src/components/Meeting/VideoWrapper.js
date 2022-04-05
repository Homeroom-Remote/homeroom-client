import Video from "./Video";
import { useEffect, useState } from "react";
import { NextPageArrow, PrevPageArrow } from "../../utils/svgs";

const NUM_OF_VIDEOS_IN_PAGE = 8;

export default function VideoWrapper({ otherParticipants, myStream }) {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(
    Math.min(NUM_OF_VIDEOS_IN_PAGE - 1, otherParticipants.length - 1)
  );

  // const peersToShow = otherParticipants.slice(startIndex, endIndex + 1);

  const toggleForward = () => {
    if (!otherParticipants) return;
    if (startIndex + NUM_OF_VIDEOS_IN_PAGE < otherParticipants.length - 1) {
      setStartIndex(Math.min(startIndex + NUM_OF_VIDEOS_IN_PAGE));
      setEndIndex(
        Math.min(endIndex + NUM_OF_VIDEOS_IN_PAGE, otherParticipants.length - 1)
      );
    }
  };

  const toggleBackward = () => {
    if (startIndex >= NUM_OF_VIDEOS_IN_PAGE) {
      setEndIndex(Math.min(startIndex - 1, otherParticipants.length - 1));
      setStartIndex(startIndex - NUM_OF_VIDEOS_IN_PAGE);
    }
  };

  return (
    <div className="row-span-9 dark:bg-dark-700 bg-lt-400 py-6 flex flex-row justify-center relative overflow-hidden gap-y-1">
      <div className="px-4 h-full flex items-center justify-center bg-black">
        <button onClick={toggleBackward}>
          <PrevPageArrow className="w-6 h-6" />
        </button>
      </div>
      <div className="grid gap-x-2 gap-y-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 grid-flow-row w-full h-full">
        <Video stream={myStream} name={"Me"} />
        {otherParticipants.map((peer, idx) => (
          <div
            key={`peer-stream-${idx}-${peer.name}`}
            className=" dark:bg-dark-900 bg-lt-400 w-full h-full font-bold rounded border border-red-400 drop-shadow-lg text-white flex items-center justify-center text-4xl"
          >
            <Video stream={peer.stream} name={peer.name} />
          </div>
        ))}
      </div>
      <div className="px-4 h-full flex items-center justify-center bg-black">
        <button onClick={toggleForward}>
          <NextPageArrow className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
