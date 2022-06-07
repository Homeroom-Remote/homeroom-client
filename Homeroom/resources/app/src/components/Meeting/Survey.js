import { useEffect, useState } from "react";
import React from "react";
import { Chart } from "react-google-charts";
import Draggable from "react-draggable";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

function Header() {
    return (
        <div className="w-auto dark:bg-dark-700 bg-lt-400 rounded-t-md flex flex-row items-center gap-x-2 py-1 px-4">
            <h2 className="dark:text-white font-medium text-lg">Yes/No Survey </h2>
        </div>
    );
}

export default function Survey({ setSurvey, sendMessageFromSurvey, onMount }) {
    const [questionText, setQuestionText] = useState("");
    const [windowTimer, setWindowTimer] = useState(true);
    const totalTime = 5
    const [countdown, setCountdown] = useState(totalTime);
    const [timer, setTimer] = useState();
    const [answers, setAnswers] = useState([]);
    const [resultWindow, setResultWindow] = useState(false);


    useEffect(() => {
        onMount([answers, setAnswers]);
    }, [onMount]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setResultWindow(!resultWindow)
        if (questionText) {
            if (questionText !== "") {
                sendMessageFromSurvey(questionText, countdown)
            }
        }
    }

    function handleStopSurvey() {
        clearInterval(timer);
        setSurvey(false)
        setWindowTimer(false)
    }

    const data = [
        ["Element", "Votes", { role: "style" }],
        ["Yes", answers.reduce((prev, cur) => cur ? prev += 1 : prev, 0), "#b87333"], // RGB value
        ["No", answers.reduce((prev, cur) => !cur ? prev += 1 : prev, 0), "silver"], // English color name
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
            <Draggable defaultPosition={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}>
                <div className="absolute z-10 cursor-move w-[350px] h-[300px] border dark:border-dark-700 rounded-t-lg">
                    <Header />
                    <form className="text-center " onSubmit={handleSubmit}>
                        <label>Time to answer the survey <br />
                            <input
                                className="h-10 w-1/6 text-center text-black "
                                type="number"
                                name="someid"
                                value={countdown}
                                onChange={(e) => setCountdown(e.target.value)}
                            />
                        </label><br />
                        <label>Enter your question <br />
                            <input
                                className="h-40 w-full text-black"
                                type="text"
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                            />
                        </label><br />
                        <input className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                            value="SEND SURVEY" />
                    </form>
                </div>
            </Draggable>
        );
    } else {
        return (
            windowTimer && <Draggable defaultPosition={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}>
                <div className="absolute z-10 cursor-move w-[350px] h-[300px] border dark:border-dark-700 shadow-lg rounded-t-lg border-lt-600">
                    <div className="flex flex-row gap-9 items-center text-xl">
                        <Header />
                        <div className="timer-wrapper">
                            <CountdownCircleTimer
                                isPlaying
                                duration={parseInt(countdown) + 10}
                                size={70}
                                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                                colorsTime={[10, 6, 3, 0]}
                                onComplete={() => handleStopSurvey()}
                            >
                                {renderTime}
                            </CountdownCircleTimer>
                        </div>
                    </div>
                    <Chart chartType="ColumnChart" width="100%" height="400px" data={data} />
                </div>
            </Draggable>
        );
    }
}