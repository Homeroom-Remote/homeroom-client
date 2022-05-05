import Video from "./Video";
import { useEffect, useState } from "react";
import { NextPageArrow, PrevPageArrow } from "../../utils/svgs";

const NUM_OF_VIDEOS = 9;


export default function VideoWrapper({ otherParticipants, myStream }) {

  const NUM_OF_VIDEOS_IN_PAGE = (startIndex) => {
    if (startIndex === 0) return NUM_OF_VIDEOS - 1
    return NUM_OF_VIDEOS
  }
  const [forInitialize, setForInitialize] = useState(false)
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(Math.min(NUM_OF_VIDEOS_IN_PAGE(startIndex), otherParticipants.length));
  const [forwardClick, setForwardClick] = useState(false)
  const [backwardClick, setBackwardClick] = useState(false)
  const [peersToShow, setPeersToShow] = useState([]);
  const showPagination = () => otherParticipants.length >= NUM_OF_VIDEOS;

  const toggleForward = () => {
    if (!otherParticipants) return;
    setForInitialize(true)
    setForwardClick(true)
    setEndIndex(Math.min(endIndex + NUM_OF_VIDEOS, otherParticipants.length))
  };

  const toggleBackward = () => {
    setForInitialize(true)
    if (startIndex === NUM_OF_VIDEOS - 1) {
      setBackwardClick(true)
      setEndIndex(Math.min(NUM_OF_VIDEOS - 1, otherParticipants.length))
    }
    else if (startIndex >= NUM_OF_VIDEOS_IN_PAGE(startIndex)) {
      setBackwardClick(true)
      setEndIndex(-1)
    }
  };


  useEffect(() => {
    if (!forInitialize) return
    if (endIndex === -1) {
      setEndIndex(Math.min(startIndex, otherParticipants.length));
      return
    }
    else if (backwardClick) {
      setBackwardClick(false)
      if (startIndex === NUM_OF_VIDEOS - 1) {
        setStartIndex(0)
      }
      else if (startIndex > NUM_OF_VIDEOS - 1) {
        setStartIndex(Math.min(startIndex - NUM_OF_VIDEOS, otherParticipants.length))
      }
    }
    else if (forwardClick) {
      setForwardClick(false)
      setStartIndex(startIndex + NUM_OF_VIDEOS_IN_PAGE(startIndex));
    }
  }, [endIndex]);


  useEffect(() => {
    if (!forInitialize) return
    setPeersToShow(otherParticipants.slice(startIndex, endIndex));
  }, [startIndex]);


  useEffect(() => {
    if (startIndex > otherParticipants.length) toggleBackward();
    else if (endIndex > otherParticipants.length) // Someone on this page left
      setEndIndex(otherParticipants.length - 1);
    else if (
      endIndex < otherParticipants.length - 1 &&
      otherParticipants.length - endIndex < NUM_OF_VIDEOS_IN_PAGE(startIndex) // New participant in this page
    )
      setEndIndex(otherParticipants.length - 1);
    setEndIndex(Math.min(NUM_OF_VIDEOS_IN_PAGE(startIndex), otherParticipants.length))
    setPeersToShow(otherParticipants.slice(startIndex, endIndex));
  }, [otherParticipants]);

  const getGridStyles = () => {
    const combineStyles = (styleStrings) => styleStrings.join(" ");
    const numParticipantsInThisPage = () => {
      if (startIndex === 0) return 1 + peersToShow.length
      return peersToShow.length
    }
    //const numParticipantsInThisPage = 1 + peersToShow.length; // My video + peers in this page
    const baseStyles = "p-2 grid gap-x-2 gap-y-2 w-full h-full";

    if (numParticipantsInThisPage() === 1)
      return combineStyles([baseStyles, "grid-cols-3"]);

    if (numParticipantsInThisPage() === 2)
      return combineStyles([baseStyles, "grid-cols-2"]);

    if (numParticipantsInThisPage() === 3)
      return combineStyles([baseStyles, "grid-cols-3"]);

    if (numParticipantsInThisPage() === 4)
      return combineStyles([baseStyles, "grid-cols-2 grid-rows-2"]);

    if (numParticipantsInThisPage() <= 6)
      return combineStyles([baseStyles, "grid-cols-3 grid-rows-2"]);

    if (numParticipantsInThisPage() <= 9)
      return combineStyles([baseStyles, "grid-cols-3 grid-rows-3"]);

    return [baseStyles];
  };

  return (
    <div className="row-span-9 dark:bg-dark-800 bg-lt-500 py-6 flex flex-row justify-center relative overflow-hidden gap-y-1">
      {showPagination() && (
        <div className="absolute left-0 top-1/2 ml-2 cursor-pointer z-10 p-3 rounded-lg flex items-center justify-center dark:hover:bg-dark-600 hover:bg-lt-600">
          <button onClick={toggleBackward}>
            <PrevPageArrow className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
      <div className={getGridStyles()}>
        {(peersToShow.length === 0 || (startIndex > 0 && peersToShow.length === 1)) && (<div></div>)}
        {NUM_OF_VIDEOS_IN_PAGE(startIndex) === NUM_OF_VIDEOS - 1 && (
          <div className="">
            <Video stream={myStream} name={"Me"} attachedId={true} />
          </div>
        )}
        {peersToShow.map((peer, idx) => (
          <div key={`peer-stream-${idx}-${peer.name}`} className="">
            <Video stream={peer.stream} name={peer.name} />
          </div>
        ))}
      </div>
      {showPagination() && (
        <div className="absolute right-0 top-1/2 mr-2 cursor-pointer z-10 p-3 rounded-lg flex items-center justify-center dark:hover:bg-dark-600 hover:bg-lt-600">
          <button onClick={toggleForward}>
            <NextPageArrow className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

