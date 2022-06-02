import { useState } from "react";
import Draggable from "react-draggable";

import useMeeting from "../../stores/meetingStore";
import useUser from "../../stores/userStore";

import { Send } from "../../utils/svgs";



function DetailedQuestionQueue({ questions, isOwner, uid }) {
  const getListItemStyle = (id) => {
    const baseStyles =
      "flex flex-row justify-between items-center mb-1 p-2 w-full rounded-md shadow-lg border dark:border-dark-600 border-lt-600";

    if (uid === id)
      return `${baseStyles} bg-gradient-to-r from-primary-500 to-primary-600`;
    else return `${baseStyles} dark:bg-dark-800 bg-lt-400`;
  };
  return (
    <ol className="list-decimal list-inside my-1">
      {questions.map((questionObject, idx) => (
        <li
          key={`question-${idx}-${questionObject.id}`}
          className={getListItemStyle(questionObject.uid)}
        >
          <p className="font-medium">
            {uid === questionObject.uid ? "Me" : questionObject.displayName}
          </p>
          {(isOwner || uid === questionObject.uid) && (
            <span
              id="remove_question"
              data-id={questionObject.id}
              className="font-medium text-red-400 cursor-pointer p-1"
            >
              &#10006;
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
function QuestionQueueHeader({ length, minimzed, ManuallyRegisterToMessageQueue, inQueue, isOwner }) {

  function handleClick() {
    ManuallyRegisterToMessageQueue()
  }

  return (
    <div className="w-auto dark:bg-dark-700 bg-lt-400 rounded-t-md flex flex-row items-center gap-x-2 py-1 px-4">
      <h2 className="dark:text-white font-medium text-lg">Question Queue</h2>
      <span className="rounded-full w-6 h-6 flex items-center justify-center dark:bg-dark-800 bg-lt-300  bg-opacity-60">
        {length}
      </span>
      {!isOwner && !inQueue && <button onClick={handleClick} className="rounded-full w-6 h-6 flex items-center justify-center dark:bg-dark-800 bg-lt-300 bg-opacity-60 text-3xl">+</button>}
      <Send
        id="toggle_minimized"
        className={
          "w-5 h-5 transform cursor-pointer z-40 " +
          (minimzed ? "-rotate-90" : "rotate-90")
        }
      />
    </div>
  );
}

export default function QuestionQueue({ questions, removeQuestionByID, ManuallyRegisterToMessageQueue, inQueue }) {
  const [minimzed, setMinimzed] = useState(false);

  const { owner } = useMeeting();
  const { user } = useUser();



  const isOwner = owner === user.uid;
  const toggleMinimzed = () => setMinimzed((oldValue) => !oldValue);

  const handleMouseDown = (e) => {
    if (e.target.id === "toggle_minimized") toggleMinimzed();
    else if (e.target.id === "remove_question") {
      removeQuestionByID(e.target.getAttribute("data-id"));
    }
  };

  return (
    <Draggable defaultPosition={{ x: 50, y: 50 }} onMouseDown={handleMouseDown}>
      <div className="absolute z-10 cursor-move">
        <QuestionQueueHeader length={questions.length} minimzed={minimzed} ManuallyRegisterToMessageQueue={ManuallyRegisterToMessageQueue} inQueue={inQueue} isOwner={isOwner} />
        {!minimzed && (
          <DetailedQuestionQueue
            questions={questions}
            isOwner={isOwner}
            uid={user.uid}
          />
        )}
      </div>

    </Draggable>
  );
}
