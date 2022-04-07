import Video from "./Video";
import { useEffect, useState } from "react";
import { NextPageArrow, PrevPageArrow } from "../../utils/svgs";

const NUM_OF_VIDEOS_IN_PAGE = 8;

export default function VideoWrapper({ otherParticipants, myStream }) {
  const [page, setPage] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(
    Math.min(NUM_OF_VIDEOS_IN_PAGE - 1, otherParticipants.length - 1)
  );
  const [peersToShow, setPeersToShow] = useState([]);

  const showPagination = () => peersToShow.length > NUM_OF_VIDEOS_IN_PAGE + 1;

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

  useEffect(() => {
    if (startIndex > otherParticipants.length) toggleBackward();
    else if (endIndex > otherParticipants.length)
      // Someone on this page left
      setEndIndex(otherParticipants.length - 1);
    else if (
      endIndex < otherParticipants.length - 1 &&
      otherParticipants.length - endIndex < NUM_OF_VIDEOS_IN_PAGE // New participant in this page
    )
      setEndIndex(otherParticipants.length - 1);

    setPeersToShow(otherParticipants.slice(startIndex, endIndex + 1));
  }, [otherParticipants]);

  const getGridStyles = () => {
    const combineStyles = (styleStrings) => styleStrings.join(" ");
    const numParticipantsInThisPage = 1 + peersToShow.length; // My video + peers in this page
    const baseStyles = "p-2 grid gap-x-2 gap-y-2 w-full h-full";

    if (numParticipantsInThisPage === 1) return combineStyles([baseStyles]);

    if (numParticipantsInThisPage === 2)
      return combineStyles([baseStyles, "grid-cols-2"]);

    if (numParticipantsInThisPage <= 4)
      return combineStyles([baseStyles, "grid-cols-2 grid-rows-2"]);

    if (numParticipantsInThisPage <= 6)
      return combineStyles([baseStyles, "grid-cols-3 grid-rows-2"]);

    if (numParticipantsInThisPage <= 9)
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
        <div className="">
          <Video stream={myStream} name={"Me"} />
        </div>
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
