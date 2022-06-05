import fistIcon from "../../../utils/fist_icon.png";
import likeIcon from "../../../utils/like_icon.png";
import dislikeIcon from "../../../utils/dislike_icon.png";
import raiseHandIcon from "../../../utils/raise_hand_icon.png";

const GeneralFAQ = [
  {
    question: "What kind of Hand Gestures are available on Homeroom?",
    answer: (
      <div className="flex flex-col items-start gap-10 text-lg leading-tight">
        <p> We can recognize 4 hand gestures: </p>
        <div className="flex w-full flex-col items-center">
          <table className="table-auto">
            <thead>
              <tr>
                <th>Description</th>
                <th>Gesture</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Thumbs up (Yes):</th>
                <th>
                  <span className="text-3xl">👍</span>
                </th>
              </tr>
              <tr>
                <th>Thumbs down (No):</th>
                <th>
                  <span className="text-3xl">👎</span>
                </th>
              </tr>
              <tr>
                <th>Raise hand (Question):</th>
                <th>
                  <span className="text-3xl">✋</span>
                </th>
              </tr>
              <tr>
                <th>Fist (Discard Question):</th>
                <th>
                  <span className="text-3xl">✊</span>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    question: "Does Homeroom have Facial Recognition features?",
    answer: (
      <div className="flex flex-row items-center text-lg leading-tight">
        <p>
          Yes! One of the Homeroom's ML enhanced meeting tools is its Facial
          Recognition package. With the Facial Recognition package, Homeroom can
          detect participants
          <span className="font-semibold text-primary-500"> feelings</span> and
          <span className="font-semibold text-primary-500">
            {" "}
            concentration levels
          </span>{" "}
          throughout the meeting. This information is relayed{" "}
          <span className="font-semibold text-primary-500">
            {" "}
            anonymously
          </span>{" "}
          to owner of the meeting in real time, and also through helpful
          statistics after the fact, thus improving his lecture every meeting!
        </p>
      </div>
    ),
  },
  {
    question: `What is the "Question Queue"? How do you use it?`,
    answer: (
      <div className="flex flex-col gap-y-2 items-center text-lg leading-tight">
        <p>
          The question queue is a managing tool available to both the owner and
          the participant. When a user wishes to ask the manager a question, he
          can use{" "}
          <span className="font-semibold text-primary-500"> Raise Hand ✋</span>{" "}
          and he will be added to the question queue. The owner can then address
          participants at a suitable time, without the need to interrupt the
          meeting flow!
        </p>
        <img src="" alt="question queue" className="h-[35px]" />
      </div>
    ),
  },
  {
    question: "How can I discard myself from the Question Queue?",
    answer: (
      <div className="flex flex-row gap-2 items-center text-lg leading-tight">
        <p>
          To leave the Question Queue, users can either manually remove
          themselves from inside the question queue, or just use{" "}
          <span className="font-semibold text-primary-500"> Make Fist ✊</span>{" "}
          which will automatically remove him from the Question Queue.
        </p>
      </div>
    ),
  },
];
const OwnerFAQ = [
  {
    question: "How can I review concentration levels at real time?",
    answer: (
      <div className="flex flex-col gap-2 items-center text-lg leading-tight">
        <p>
          To review concentration levels at real time, simply click the{" "}
          <span className="font-semibold text-primary-500">Concentration</span>{" "}
          button on the bottom Toolbar. Then wait a few seconds for the data to
          start flowing, and adjust your meeting as you see fit!
        </p>
        <img src="" alt="concentration" className="h-[35px]" />
      </div>
    ),
  },
  {
    question: "How can I review participants expressions at real time",
    answer: (
      <div className="flex flex-col gap-2 items-center text-lg leading-tight">
        <p>
          To review expressions at real time, simply click the
          <span className="font-semibold text-primary-500">
            Expressions
          </span>{" "}
          button on the bottom Toolbar. Then wait a few seconds for the data to
          start flowing, and adjust your meeting as you see fit!
        </p>
        <img src="" alt="expressions" className="h-[35px]" />
      </div>
    ),
  },
  {
    question: "What is Homeroom Statistics? How can I use it?",
    answer: (
      <div className="flex flex-col gap-2 items-center text-lg leading-tight">
        <p>
          <span className="font-semibold text-primary-500">
            Homeroom Statistics
          </span>{" "}
          is a ML enhanced meeting analytics tool. It uses data obtained during
          the meeting at real time (such as participation, expressions and
          concentration) to present the owner with rich timestamped information
          that will help him review and improve his meetings.
        </p>
        <img src="" alt="statistics" className="h-[35px]" />
      </div>
    ),
  },
  {
    question: "How is Homeroom Statistics Score determined?",
    answer: (
      <div className="flex flex-col gap-2 items-center text-lg leading-tight">
        <p>
          The score is determined with a weighted average for participation,
          user expressions and concentration levels throughtout the meeting. The
          data is then weighted based on expected levels of performance for each
          category, and summed up. Pay attention to the tips below the score,
          they will help you focus on what's most important for your next
          meeting!
        </p>
        <img src="" alt="tips" className="h-[35px]" />
      </div>
    ),
  },
];

const Questions = { GeneralFAQ, OwnerFAQ };
export default Questions;
