import { useState } from "react";
import Draggable from "react-draggable";

import { Send } from "../../utils/svgs";

function DetailedQuestionQueue({ questions }) {
  return (
    <ol className="list-decimal list-inside dark:bg-dark-800 bg-lt-400 p-2 border-t-1 divide-y dark:divide-dark-600 divide-lt-200">
      {questions.map((questionObject, idx) => (
        <li
          key={`question-${idx}-${questionObject.id}`}
          className="flex flex-row justify-between items-center px-1 w-full"
        >
          <p className="font-medium">{questionObject.displayName}</p>
          <span
            id="remove_question"
            data-id={questionObject.id}
            className="font-medium text-red-400 cursor-pointer p-1"
          >
            &#10006;
          </span>
        </li>
      ))}
    </ol>
  );
}
function QuestionQueueHeader({ length, minimzed }) {
  return (
    <div className="w-auto dark:bg-dark-600 bg-lt-400 rounded-t-md flex flex-row items-center gap-x-2 py-1 px-4">
      <h2 className="dark:text-white font-medium text-lg">Question Queue</h2>
      <span className="rounded-full w-6 h-6 flex items-center justify-center dark:bg-dark-700 bg-lt-300  bg-opacity-60">
        {length}
      </span>
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

export default function QuestionQueue({ questions, removeQuestionByID }) {
  const [minimzed, setMinimzed] = useState(false);
  const toggleMinimzed = () => setMinimzed((oldValue) => !oldValue);

  const handleMouseDown = (e) => {
    if (e.target.id === "toggle_minimized") toggleMinimzed();
    else if (e.target.id === "remove_question")
      removeQuestionByID(e.target.getAttribute("data-id"));
  };
  // No questions
  if (!questions || questions.length === 0) return "";

  return (
    <Draggable defaultPosition={{ x: 50, y: 50 }} onMouseDown={handleMouseDown}>
      <div className="absolute z-10 cursor-move">
        <QuestionQueueHeader length={questions.length} minimzed={minimzed} />
        {!minimzed && <DetailedQuestionQueue questions={questions} />}
      </div>
    </Draggable>
  );
}
