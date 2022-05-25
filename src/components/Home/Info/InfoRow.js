import React, { useState } from "react"

export default function InfoRow({ question, answer }) {
    const [active, setActive] = useState(false)
    const btnClickHandler = () => {
        setActive((activeState) => {
            return !activeState
        })
    }
    return (
        <div className="border-2 border-gray-100 rounded-lg dark:border-gray-700 bg-purple-700">
            <button className="flex items-center justify-between w-full p-8" onClick={btnClickHandler}>
                <h1 className="font-semibold text-gray-700 dark:text-white">{question}</h1>
                {active ?
                    <span className="text-gray-400 bg-gray-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
                        </svg>
                    </span>
                    :
                    <span className="text-white bg-blue-500 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </span>
                }
            </button>

            {active && <hr className="border-gray-200 dark:border-gray-800" />}

            <p className={`text-sm pl-8 text-gray-500 dark:text-gray-300 transition-[height,padding] ${active ? "h-auto p-8 visible" : "h-0 p-0 invisible"}`}
            >
                {answer}
            </p>

        </div>
    )
}