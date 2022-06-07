import { useEffect, useState } from "react";
import React from "react";
import useTheme from "../../stores/themeStore";

import { Chart } from "react-google-charts";
import Draggable from "react-draggable";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

function Header() {
  return (
    <div className="w-auto dark:bg-dark-700 bg-lt-400 rounded-t-md flex flex-row items-center gap-x-2 py-1 px-4">
      <h2 className="dark:text-white font-medium text-lg">Survey</h2>
    </div>
  );
}

export default function Survey({ setSurvey, sendMessageFromSurvey, onMount }) {
  const [questionText, setQuestionText] = useState("");
  const [windowTimer, setWindowTimer] = useState(true);
  const totalTime = 5;
  const [countdown, setCountdown] = useState(totalTime);
  const [timer, setTimer] = useState();
  const [answers, setAnswers] = useState([]);
  const [resultWindow, setResultWindow] = useState(false);
  const { getBgFromTheme, getTextFromTheme } = useTheme();
  useEffect(() => {
    onMount([answers, setAnswers]);
  }, [onMount]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setResultWindow(!resultWindow);
    if (questionText) {
      if (questionText !== "") {
        sendMessageFromSurvey(questionText, countdown);
      }
    }
  };

  function handleStopSurvey() {
    clearInterval(timer);
    setSurvey(false);
    setWindowTimer(false);
  }

  const data = [
    ["Element", "Votes", { role: "style" }],
    [
      "Yes",
      answers.reduce((prev, cur) => (cur ? (prev += 1) : prev), 0),
      "#b87333",
    ], // RGB value
    [
      "No",
      answers.reduce((prev, cur) => (!cur ? (prev += 1) : prev), 0),
      "silver",
    ], // English color name
  ];

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer">Too lale...</div>;
    }

    return (
      <div className="timer text-base text-violet-500">
        <div className="value">{remainingTime}</div>
      </div>
    );
  };

  if (!resultWindow) {
    return (
      <Draggable
        defaultPosition={{
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        }}
      >
        <div className="absolute z-10 cursor-move w-[350px]  border dark:border-dark-700 rounded-t-lg bg-lt-600 dark:bg-dark-800">
          <Header />
          <form
            className="p-4 w-full flex flex-col gap-y-1 h-full"
            onSubmit={handleSubmit}
          >
            <label>
              Time to answer the survey: <br />
              <input
                className="w-10 px-2 h-10 font-semibold flex items-center justify-center bg-lt-200 dark:bg-dark-700 text-text-900 dark:text-white rounded"
                type="number"
                value={countdown}
                onChange={(e) => setCountdown(e.target.value)}
              />
            </label>
            <br />
            <label>
              Survey question: <br />
              <textarea
                className="w-full h-32 bg-lt-200 dark:bg-dark-700 text-text-900 dark:text-white rounded px-1 text-xl"
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </label>
            <br />
            <input
              className="border text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer hover:bg-primary-600 transition duration-100 ease-out"
              type="submit"
              value="Send Survey"
            />
          </form>
        </div>
      </Draggable>
    );
  } else {
    return (
      windowTimer && (
        <Draggable
          defaultPosition={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          }}
        >
          <div className="absolute z-10 cursor-move w-[350px] border dark:border-dark-700 rounded-t-lg bg-lt-600 dark:bg-dark-800">
            <Header />
            <div className="p-4 gap-y-2 flex flex-col">
              <div className="timer-wrappe">
                <CountdownCircleTimer
                  isPlaying
                  trailColor={getBgFromTheme()}
                  duration={parseInt(countdown) + 100000}
                  size={70}
                  colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                  colorsTime={[10, 6, 3, 0]}
                  onComplete={() => handleStopSurvey()}
                >
                  {renderTime}
                </CountdownCircleTimer>
              </div>
              <Chart
                chartType="ColumnChart"
                options={{
                  legend: { position: "none" },
                  colors: ["rgb(192, 132, 252)", "rgb(74, 222, 128)"],
                  hAxis: {
                    title: "time",
                    textStyle: { color: getTextFromTheme() },
                  },
                  vAxis: {
                    title: "Score",
                    textStyle: { color: getTextFromTheme() },
                  },

                  backgroundColor: getBgFromTheme(),
                }}
                width="100%"
                height="400px"
                data={data}
              />
            </div>
          </div>
        </Draggable>
      )
    );
  }
}
