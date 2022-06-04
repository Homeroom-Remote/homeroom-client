import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";


export default function SurveyQuestion({ surveyQuestion, sendSurveyAnswer, surveyTime, setSurveyAnswerWindow }) {
    const [answer, setAnswer] = useState(true);

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

    function handleStopSurvey() {
        setSurveyAnswerWindow(false)
    }

    return (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex flex-row gap-4 items-center items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-3xl font-bold text-violet-500">
                                Survey
                            </h3>
                            <div className="timer-wrapper">
                                <CountdownCircleTimer
                                    isPlaying
                                    duration={surveyTime}
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
                            <p className="my-4 text-slate-500 text-lg leading-relaxed">
                                {surveyQuestion}
                            </p>
                            <div className="flex justify-center">
                                <div>
                                    <div className="form-check">
                                        <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-violet-500 checked:border-violet-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="flexRadioDefault1"
                                            checked={answer}
                                            onChange={(event) => setAnswer(true)} />
                                        <label className="form-check-label inline-block text-gray-800" for="flexRadioDefault1">
                                            Yes
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-violet-500 checked:border-violet-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="flexRadioDefault2"
                                            onChange={(event) => setAnswer(false)}
                                        />
                                        <label className="form-check-label inline-block text-gray-800" for="flexRadioDefault2">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                                className="bg-violet-600 text-white active:bg-violet-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => sendSurveyAnswer(answer)}
                            >
                                Send answer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
}