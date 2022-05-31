import { useEffect, useState } from "react";

import Draggable from "react-draggable";

function Header() {
    return (
        <div className="w-auto dark:bg-dark-700 bg-lt-400 rounded-t-md flex flex-row items-center gap-x-2 py-1 px-4">
            <h2 className="dark:text-white font-medium text-lg">Survey</h2>
        </div>
    );
}

export default function Survey() {
    const [questionText, setQuestionText] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(questionText)
    }

    const handleTypeQuestion = (event) => {
        setQuestionText(event.target.value)
    }

    return (
        <Draggable defaultPosition={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}>
            <div className="absolute z-10 cursor-move w-[350px] h-[300px] border dark:border-dark-700 shadow-lg rounded-t-lg border-lt-600">
                <Header />
                <form onSubmit={handleSubmit}>
                    <label>Enter your question: <br />
                        <input
                            className="h-40"
                            type="text"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                        />
                    </label><br />
                    <input className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" />

                </form>
                {/* {expressions && Object.keys(expressions).length > 0 && (
                    <ChartWrapper expressions={expressions} />
                )} */}
            </div>
        </Draggable>
    );
}