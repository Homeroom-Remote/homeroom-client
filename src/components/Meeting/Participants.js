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
  peers,
  cameraState,
  microphoneState,
  isChatOpen,
}) {
  const { owner } = useMeeting();
  const { user } = useUser();
  const isAudioOnline = (stream) =>
    !(
      typeof stream?.getAudioTracks()[0] === "undefined" ||
      stream?.getAudioTracks()[0]?.muted
    );
  const isVideoOnline = (stream) =>
    !(
      typeof stream?.getVideoTracks()[0] === "undefined" ||
      stream?.getVideoTracks()[0]?.muted
    );
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
        {peers.map((peer, index) => (
          <Participant
            key={`participant-${peer.name}-${index}`}
            name={peer.name}
            microphoneState={isAudioOnline(peer.stream)}
            cameraState={isVideoOnline(peer.stream)}
            isOwner={peer.uid === owner}
          />
        ))}
      </div>
    </div>
  );
}
