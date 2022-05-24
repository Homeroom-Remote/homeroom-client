
import React, { useEffect, useState } from "react";
import InfoRow from "./InfoRow";
import fistIcon from "../../../utils/fist_icon.png"
import likeIcon from "../../../utils/like_icon.png"
import dislikeIcon from "../../../utils/dislike_icon.png"
import raiseHandIcon from "../../../utils/raise_hand_icon.png"

export default function Info() {
    const rowsGenaral = [
        {
            question: "What we can do with our Hand Recognition feature?",
            answer: <div className="flex flex-row items-center gap-10">
                <div>
                    <p> We can recognize 4 hand gestures: </p>
                </div>
                <div className="flex flex-row items-center">
                    <p>Like: </p><img src={raiseHandIcon} style={{ height: 35 }} />
                    <p>Dislike: </p><img src={raiseHandIcon} style={{ height: 35 }} />
                    <p>Raise Hand: </p><img src={raiseHandIcon} style={{ height: 35 }} />
                    <p>Fist: </p><img src={raiseHandIcon} style={{ height: 35 }} />
                </div>
            </div>

        },
        {
            question: "How can I ask question ?",
            answer: <div className="flex flex-row items-center">
                <p>Raise Hand: </p><img src={raiseHandIcon} style={{ height: 35 }} />
            </div>

        },
        {
            question: "How can I ask question ?",
            answer: <div className="flex flex-row items-center">
                <p>Raise Hand: </p><img src={raiseHandIcon} style={{ height: 35 }} />
            </div>

        },
        {
            question: "How can I ask question ?",
            answer: <div className="flex flex-row items-center">
                <p>Raise Hand: </p><img src={raiseHandIcon} style={{ height: 35 }} />
            </div>
        },
    ]
    const rowsManager = [
        { question: "MANAGER whatsUpp", answer: "everythingallwrite" },
        { question: "MANAGER tzahi hello", answer: "blah blah blah " }
    ]
    return (
        <div className="overflow-auto h-full relative ">
            <section className="absolute">
                <div className="container max-w-4xl px-6 py-10 mx-auto w-full">
                    <h1 className="text-4xl font-semibold text-center text-gray-800 dark:text-white ">Frequently asked questions</h1><br /><br />
                    <h2 className="text-2xl font-semibold text-left text-gray-800 dark:text-white"> General </h2>
                    <div className="mt-12 space-y-8">
                        {rowsGenaral.map(({ question, answer }) => {
                            return <InfoRow question={question} answer={answer} key={question} />
                        })}
                    </div><br /><br />

                    <h2 className="text-2xl font-semibold text-left text-gray-800 dark:text-white"> For Meeting Manager </h2>
                    <div className="mt-12 space-y-8">
                        {rowsManager.map(({ question, answer }) => {
                            return <InfoRow question={question} answer={answer} key={question} />
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}