import Video from "./Video";
import { useEffect, useState, useRef } from "react";
import { NextPageArrow, PrevPageArrow } from "../../../utils/svgs";
import PaginationHelper from "./PaginationHelper";
import useMeeting from "../../../stores/meetingStore";

const NUM_OF_VIDEOS = 9;
export default function RegularVideoDisplay({ myStream, screenSharer }) {
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

  const getGridStyles = () => {
    const combineStyles = (styleStrings) => styleStrings.join(" ");

    let nItemsInPage = visiblePeers.length;
    if (nItemsInPage < NUM_OF_VIDEOS) nItemsInPage += 1; // add user video

    const baseStyles = "p-2 grid gap-x-2 gap-y-2 w-full h-full";
    console.log(nItemsInPage);
    if (nItemsInPage <= 1) return combineStyles([baseStyles, "px-20"]);

    if (nItemsInPage === 2) return combineStyles([baseStyles, "grid-cols-2"]);

    if (nItemsInPage <= 4)
      return combineStyles([baseStyles, "grid-cols-2 grid-rows-2"]);

    if (nItemsInPage <= 6)
      return combineStyles([baseStyles, "grid-cols-3 grid-rows-2"]);

    if (nItemsInPage <= 9)
      return combineStyles([baseStyles, "grid-cols-3 grid-rows-3"]);

    return [baseStyles];
  };

  const getStream = (peer) => {
    if (!peer) return null;
    const activeStreams = peer.peer._remoteStreams.filter(
      (stream) => stream.active === true
    );
    if (activeStreams.length <= 0) {
      return null;
    } else {
      return activeStreams[activeStreams.length - 1];
    }
  };

  return (
    <div className="h-full w-full dark:bg-dark-900 bg-lt-500 py-6 flex flex-row justify-center relative overflow-hidden gap-y-1">
      {showPagination() && (
        <div className="absolute left-0 top-1/2 ml-2 cursor-pointer z-10 p-3 rounded-lg flex items-center justify-center dark:hover:bg-dark-600 hover:bg-lt-600">
          <button onClick={toggleBackward}>
            <PrevPageArrow className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
      <div className={getGridStyles()}>
        {!pagination.current.hasNext(page) && (
          <Video stream={myStream} name={"Me"} id={"me"} me={true} />
        )}
        {visiblePeers.map((peer, idx) => (
          <div
            key={`peer-stream-${idx}-${peer.name}`}
            className="h-full w-auto"
          >
            <Video
              stream={getStream(peer)}
              name={peer.name}
              id={peer.id}
              me={false}
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
  );
}
