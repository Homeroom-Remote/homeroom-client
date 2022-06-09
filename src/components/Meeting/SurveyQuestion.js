import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import useTheme from "../../stores/themeStore";

export default function SurveyQuestion({
  surveyQuestion,
  sendSurveyAnswer,
  surveyTime,
  setSurveyAnswerWindow,
}) {
  const [answer, setAnswer] = useState(true);
  const { getBgFromTheme } = useTheme();

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer">Too late...</div>;
    }

    return (
      <div className="timer text-base text-primary-500">
        <div className="value">{remainingTime}</div>
      </div>
    );
  };

  function handleStopSurvey() {
    setSurveyAnswerWindow(false);
  }

  return (
    <>
      <div className="absolute z-10 w-auto left-1/2 translate-x-1/2 bottom-1/2 border dark:border-dark-700 translate-y-1/2 rounded-t-lg bg-lt-600 dark:bg-dark-800">
        {/*content*/}
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none p-4">
          {/*header*/}
          <div className="flex flex-row gap-4 items-center justify-between p-5 border-b border-solid border-dark-200 rounded-t">
            <h3 className="text-3xl font-bold">Survey</h3>
            <div className="timer-wrapper">
              <CountdownCircleTimer
                isPlaying
                duration={parseInt(surveyTime)}
                trailColor={getBgFromTheme()}
                size={70}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                colorsTime={[10, 6, 3, 0]}
                onComplete={() => handleStopSurvey()}
              >
                {renderTime}
              </CountdownCircleTimer>
            </div>
          </div>
          {/*body*/}
          <div className="relative p-6 flex-auto">
            <p className="my-4 text-text-500 dark:text-white text-lg leading-relaxed">
              {surveyQuestion}
            </p>
            <div className="flex justify-center">
              <div>
                <div className="form-check">
                  <input
                    className="form-check-input appearance-none rounded-full h-4 w-4 border border-dark-300 bg-white checked:bg-primary-500 checked:border-primary-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    checked={answer}
                    onChange={(event) => setAnswer(true)}
                  />
                  <label
                    className="form-check-label inline-block text-text-500 dark:text-white"
                    for="flexRadioDefault1"
                  >
                    Yes
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-primary-500 checked:border-primary-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    onChange={(event) => setAnswer(false)}
                  />
                  <label
                    className="form-check-label inline-block text-text-500 dark:text-white"
                    for="flexRadioDefault2"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
          <button
            className="border text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer hover:bg-primary-600 transition duration-100 ease-out"
            type="button"
            onClick={() => sendSurveyAnswer(answer)}
          >
            Send answer
          </button>
        </div>
      </div>
    </>
  );
}
