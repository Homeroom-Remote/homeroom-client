import useUser from "../../stores/userStore";
import useMeeting from "../../stores/meetingStore";
import { Mic, MutedMic, Cam, MutedCam, AcademicCap } from "../../utils/svgs";

function Participant({
  name,
  microphoneState,
  cameraState,
  isMe = false,
  isOwner = false,
}) {
  return (
    <div className="flex flex-row items-center justify-between p-2 w-full border-b dark:border-dark-700">
      <div className="flex flex-row justify-between relative">
        <p className={"font-medium text-md " + (isMe && "text-primary-400")}>
          {name}
        </p>
        {isOwner && (
          <AcademicCap className="w-5 h-5 absolute -top-2 -right-4 text-secondary-400" />
        )}
      </div>
      <div className="flex flex-row items-center">
        {microphoneState ? (
          <Mic className="h-5 w-8 mt-1" />
        ) : (
          <MutedMic className="h-5 w-8 mt-1" />
        )}
        {cameraState ? (
          <Cam className="h-5 w-8 mr-5 mt-1" />
        ) : (
          <MutedCam className="h-5 w-8 mr-5 mt-1" />
        )}
      </div>
    </div>
  );
}

export default function Participants({
  cameraState,
  microphoneState,
  isChatOpen,
}) {
  const { owner, getPeers, peers } = useMeeting();
  const { user } = useUser();
  const getActiveStreams = (peer) =>
    peer?.peer?._remoteStreams?.filter((stream) => stream.active === true);
  const isAudioOnline = (peer) => {
    const activeStreams = getActiveStreams(peer);
    console.log(activeStreams);
    if (activeStreams?.length > 0) {
      const audio = activeStreams[activeStreams.length - 1].getAudioTracks();
      console.log(audio);
      if (
        audio &&
        audio[0] !== undefined &&
        audio[0].enabled &&
        !audio[0].muted
      ) {
        console.log("here");
        return true;
      }
    }

    return false;
  };
  const isVideoOnline = (peer) => {
    const activeStreams = getActiveStreams(peer);
    if (activeStreams?.length > 0) {
      const video = activeStreams[activeStreams.length - 1].getVideoTracks();
      if (
        video &&
        video[0] !== undefined &&
        video[0].enabled &&
        !video[0].muted
      )
        return true;
    }

    return false;
  };
  return (
    <div
      className={
        "flex flex-col text-center col-span-3 py-5 dark:bg-dark-900 bg-lt-50 shadow-md dark:shadow-dark-800 shadow-lt-600 border dark:border-dark-600 border-lt-200 rounded-lg m-4 " +
        (isChatOpen ? "h-1/2" : "h-full")
      }
    >
      <div className="font-medium text-2xl">Participants</div>
      <hr className="my-2"></hr>
      <div className="flex flex-col gap-y-2 h-full overflow-auto px-4">
        <Participant
          name={user.displayName}
          microphoneState={microphoneState}
          cameraState={cameraState}
          isMe={true}
          isOwner={user.uid === owner}
        />
        {getPeers().map((peer, index) => (
          <Participant
            key={`participant-${peer.name}-${index}`}
            name={peer.name}
            microphoneState={isAudioOnline(peer)}
            cameraState={isVideoOnline(peer)}
            isOwner={peer.uid === owner}
          />
        ))}
      </div>
    </div>
  );
}
