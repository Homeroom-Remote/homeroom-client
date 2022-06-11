import { useEffect, useState } from "react";
import useUser from "../../../stores/userStore";
import Video from "./Video";
import ScreenShare from "./ScreenShare";

import { NextPageArrow, PrevPageArrow } from "../../../utils/svgs";

const NUM_OF_VIDEOS = 9;

export default function ScreenShareVideoDisplay({
  otherParticipants,
  myStream,
  screenSharer,
  myScreenShare,
}) {
  const { user } = useUser();
  const NUM_OF_VIDEOS_IN_PAGE = (startIndex) => {
    if (startIndex === 0) return NUM_OF_VIDEOS - 1;
    return NUM_OF_VIDEOS;
  };
  const [forInitialize, setForInitialize] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(
    Math.min(NUM_OF_VIDEOS_IN_PAGE(startIndex), otherParticipants.length)
  );
  const [forwardClick, setForwardClick] = useState(false);
  const [backwardClick, setBackwardClick] = useState(false);
  const [peersToShow, setPeersToShow] = useState([]);
  const showPagination = () => otherParticipants.length >= NUM_OF_VIDEOS;

  const toggleForward = () => {
    if (!otherParticipants) return;
    setForInitialize(true);
    setForwardClick(true);
    setEndIndex(Math.min(endIndex + NUM_OF_VIDEOS, otherParticipants.length));
  };

  const toggleBackward = () => {
    setForInitialize(true);
    if (startIndex === NUM_OF_VIDEOS - 1) {
      setBackwardClick(true);
      setEndIndex(Math.min(NUM_OF_VIDEOS - 1, otherParticipants.length));
    } else if (startIndex >= NUM_OF_VIDEOS_IN_PAGE(startIndex)) {
      setBackwardClick(true);
      setEndIndex(-1);
    }
  };

  useEffect(() => {
    if (!forInitialize) return;
    if (endIndex === -1) {
      setEndIndex(Math.min(startIndex, otherParticipants.length));
      return;
    } else if (backwardClick) {
      setBackwardClick(false);
      if (startIndex === NUM_OF_VIDEOS - 1) {
        setStartIndex(0);
      } else if (startIndex > NUM_OF_VIDEOS - 1) {
        setStartIndex(
          Math.min(startIndex - NUM_OF_VIDEOS, otherParticipants.length)
        );
      }
    } else if (forwardClick) {
      setForwardClick(false);
      setStartIndex(startIndex + NUM_OF_VIDEOS_IN_PAGE(startIndex));
    }
  }, [endIndex]);

  useEffect(() => {
    if (!forInitialize) return;
    setPeersToShow(otherParticipants.slice(startIndex, endIndex));
  }, [startIndex]);

  useEffect(() => {
    if (startIndex > otherParticipants.length) toggleBackward();
    else if (endIndex > otherParticipants.length)
      // Someone on this page left
      setEndIndex(otherParticipants.length - 1);
    else if (
      endIndex < otherParticipants.length - 1 &&
      otherParticipants.length - endIndex < NUM_OF_VIDEOS_IN_PAGE(startIndex) // New participant in this page
    )
      setEndIndex(otherParticipants.length - 1);
    setEndIndex(
      Math.min(NUM_OF_VIDEOS_IN_PAGE(startIndex), otherParticipants.length)
    );
    setPeersToShow(otherParticipants.slice(startIndex, endIndex));
  }, [otherParticipants]);

  const getStream = (peer) => {
    if (!peer || !screenSharer) return null;
    const activeStreams = peer.peer._remoteStreams.filter(
      (stream) => stream.active === true
    );
    if (activeStreams.length <= 0) {
      return null;
    } else if (screenSharer?.user === peer.uid) {
      // return regular webcam video if has one
      return activeStreams.find(
        (stream) => stream.id !== screenSharer.streamId
      );
    } else {
      const activeWithoutShare = activeStreams.filter(
        (stream) => stream.id !== screenSharer.streamId
      );
      if (activeWithoutShare.length <= 0) return 0;
      return activeWithoutShare[activeWithoutShare.length - 1];
    }
  };

  const isSharerMe = () => screenSharer?.user === user.uid;

  const getSharerStream = () => {
    if (isSharerMe()) {
      return myScreenShare;
    } else {
      const peer = otherParticipants?.find(
        (peer) => peer.uid === screenSharer?.user
      );
      return peer?.peer._remoteStreams.find(
        (stream) => stream.id === screenSharer?.streamId
      );
    }
  };

  return (
    <article className="grid grid-rows-12 grid-flow-row h-full">
      <div className="row-span-2 dark:bg-dark-800 dark:bg-opacity-50 bg-lt-500 py-2 flex flex-row justify-center relative overflow-hidden gap-y-1">
        {showPagination() && (
          <div className="absolute left-0 top-1/2 ml-2 cursor-pointer z-10 p-3 rounded-lg flex items-center justify-center dark:hover:bg-dark-600 hover:bg-lt-600">
            <button onClick={toggleBackward}>
              <PrevPageArrow className="w-6 h-6 text-white" />
            </button>
          </div>
        )}
        <div className="flex flex-row around gap-x-2 p-2 w-full">
          {NUM_OF_VIDEOS_IN_PAGE(startIndex) === NUM_OF_VIDEOS - 1 && (
            <Video
              stream={myStream}
              name={"Me"}
              id={"me"}
              me={true}
              small={true}
            />
          )}

          {peersToShow.map((peer, idx) => (
            <div key={`peer-stream-${idx}-${peer.name}`} className="">
              <Video
                stream={getStream(peer)}
                name={peer.name}
                id={peer.id}
                me={false}
                small={true}
              />
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
      <div className="px-2 row-span-10 dark:bg-dark-900 bg-lt-500 py-6 flex flex-row justify-center relative overflow-hidden gap-y-1">
        <ScreenShare stream={getSharerStream()} me={isSharerMe()} />
      </div>
    </article>
  );
}
