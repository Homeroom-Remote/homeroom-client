import { useState, useEffect } from "react";
import { get } from "../../../api/meeting";
import useStore from "../../../stores/meetingStore";

import Button from "../../Button";
import TitleBarClose from "../../TitleBarClose";
import OnlineIndicator from "../../OnlineIndicator";

const MEETING_ID_LENGTH = 6;
export default function JoinRoomOverlay({ close }) {
  const [meetingID, setMeetingID] = useState("");
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [meetingIDError, setMeetingIDError] = useState(null);
  const { joinMeeting } = useStore();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleJoinRoom();
    }
  };

  const handleJoinRoom = () => {
    if (
      meetingIDError ||
      !meetingDetails ||
      meetingID.length !== MEETING_ID_LENGTH
    )
      return;
    console.log("trying to join", meetingID);
    joinMeeting(meetingID);
  };

  const showTable = () =>
    !meetingIDError && meetingDetails && meetingID.length === MEETING_ID_LENGTH;

  useEffect(() => {
    if (meetingID.length === MEETING_ID_LENGTH) {
      get(meetingID)
        .then((meeting) => {
          if (meeting) {
            setMeetingIDError(null);
            setMeetingDetails(meeting);
          } else {
            setMeetingIDError("Meeting not found! Link might be broken");
            setMeetingDetails(meeting);
          }
        })
        .catch((error) => {
          setMeetingDetails(null);
          setMeetingIDError(error);
          console.log(error);
        });
    }
  }, [meetingID]);
  return (
    <div className="bg-lt-100 dark:bg-dark-800 border dark:border-dark-800 pb-2 gap-y-2 w-max rounded flex flex-col">
      <TitleBarClose title="Join Room" close={close} />
      <div className="px-2 gap-x-4 flex flex-row justify-between items-end">
        <label className="flex flex-col gap-x-2 items-start gap-y-2 text-md font-medium">
          Enter Meeting ID:
          <input
            onChange={(event) => setMeetingID(event.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            className="rounded px-1 pointer-events-auto border bg-lt-50 text-text-800 dark:bg-dark-600 dark:text-white "
          />
        </label>
        <Button text="Join" onClick={handleJoinRoom} />
      </div>
      {showTable() && (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-lt-200 dark:bg-dark-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 text-left text-sm font-semibold text-text-800 dark:text-text-100 pl-2"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-text-800 dark:text-text-100"
                    >
                      Owner
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-text-800 dark:text-text-100"
                    >
                      Participants
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-lt-100 dark:bg-dark-700">
                  <tr>
                    <td className="whitespace-nowrap py-2 text-sm font-medium relative">
                      <OnlineIndicator
                        online={meetingDetails?.status === "online"}
                        center={true}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-sm text-text-500 dark:text-text-300">
                      {meetingDetails?.owner_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-sm text-text-500 dark:text-text-300">
                      {meetingDetails?.participants?.length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {meetingIDError && (
        <div className="p-2">
          <p className="text-lg border border-red-400 px-2 max-w-max self-center rounded font-medium text-text-600 dark:text-white leading-tight">
            {meetingIDError}
          </p>
        </div>
      )}
    </div>
  );
}
