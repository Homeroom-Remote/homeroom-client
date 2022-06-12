import { useEffect, useState, useRef } from "react";
import useUser from "../../../stores/userStore";
import Video from "./Video";
import ScreenShare from "./ScreenShare";
import useMeeting from "../../../stores/meetingStore";
import PaginationHelper from "./PaginationHelper";

import { NextPageArrow, PrevPageArrow } from "../../../utils/svgs";

const NUM_OF_VIDEOS = 9;

export default function ScreenShareVideoDisplay({
  myStream,
  screenSharer,
  myScreenShare,
}) {
  const { user } = useUser();
  const { peers, getPeers } = useMeeting();
  const [page, setPage] = useState(1);
  const [visiblePeers, setVisiblePeers] = useState([]);
  let pagination = useRef(new PaginationHelper(peers, NUM_OF_VIDEOS));

  const showPagination = () => pagination.current.pageCount > 1;
  const toggleForward = () =>
    setPage((currPage) =>
      pagination.current.hasNext(currPage) ? currPage + 1 : currPage
    );
  const toggleBackward = () =>
    setPage((currPage) => (currPage > 1 ? currPage - 1 : currPage));
  useEffect(() => {
    var paginationHelper = new PaginationHelper(getPeers(), NUM_OF_VIDEOS);
    setVisiblePeers(paginationHelper.pageItems(page));
    pagination.current.current = paginationHelper;
  }, [peers]);

  const getStream = (peer) => {
    if (!peer || !screenSharer) return null;
    const activeStreams = peer.peer._remoteStreams.filter(
      (stream) => stream.active === true
    );
    if (activeStreams.length <= 0) {
      return null;
    } else if (screenSharer?.user === peer.uid) {
      // return regular webcam video if has one
      const activeWithoutShare = activeStreams.filter(
        (stream) => stream.id !== screenSharer.streamId
      );
      if (activeWithoutShare.length <= 0) return null;
      return activeWithoutShare[activeWithoutShare.length - 1];
    } else {
      return activeStreams[activeStreams.length - 1];
    }
  };

  const isSharerMe = () => screenSharer?.user === user.uid;

  const getSharerStream = () => {
    if (isSharerMe()) {
      return myScreenShare;
    } else {
      const peer = peers?.find((peer) => peer.uid === screenSharer?.user);
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
          {!pagination.current.hasNext(page) && (
            <Video
              stream={myStream}
              name={"Me"}
              id={"me"}
              me={true}
              small={true}
            />
          )}

          {visiblePeers.map((peer, idx) => (
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
