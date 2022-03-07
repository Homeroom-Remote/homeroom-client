import Button from "../../Button";
import useMeeting from "../../../stores/meetingStore";

export default function QuickSelection() {
  const { toggleIsInMeeting } = useMeeting();

  function openRoom() {
    toggleIsInMeeting();
  }

  return (
    <div className="flex flex-row items-center h-full gap-x-2 justify-center">
      {/* My Meeting */}
      <div className="dark:bg-dark-800 h-60 w-48 rounded-3xl p-4 dark:shadow shadow-lg flex flex-col justify-between">
        <div className="flex flex-col gap-y-2">
          {/* Header */}
          <div className="flex flex-row justify-between items-center gap-x-2">
            <p className="font-bold leading-4">Your Meeting</p>
            <Button text="Open" onClick={openRoom} />
          </div>
          {/* Description */}
          <p className="text-sm text-text-400 dark:text-text-200">
            Your private meeting room
          </p>
        </div>
        {/* Bottom Bar */}
        <div className="flex flex-row">
          <button className="rounded-full bg-purple-300 bg-opacity-80 p-2 shadow hover:bg-purple-400 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col w-18 h-60 gap-y-2">
        {/* Join Room  */}
        <div className="dark:bg-dark-800 h-full rounded-3xl p-4 dark:shadow shadow-lg flex flex-col justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p>Join Room</p>
        </div>
        <div className="dark:bg-dark-800 h-full rounded-3xl p-4 dark:shadow shadow-lg flex flex-col justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p>Join Room</p>
        </div>
      </div>
    </div>
  );
}
