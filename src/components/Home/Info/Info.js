
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
                    <p>Like: </p><img src={likeIcon} style={{ height: 35 }} />
                    <p>Dislike: </p><img src={dislikeIcon} style={{ height: 35 }} />
                    <p>Raise Hand: </p><img src={raiseHandIcon} style={{ height: 35 }} />
                    <p>Fist: </p><img src={fistIcon} style={{ height: 35 }} />
                </div>
            </div>

        },
        {
            question: "What we can do with our Face Recognition feature?",
            answer: <div className="flex flex-row items-center">
                <p>Homeroom can learn the participants feelings about the meeting,
                    and reflect the meeting manager the listening and concentration level
                    and know whether they understand the content of the lesson or not</p>
            </div>

        },
        {
            question: "What is our questions queue ?",
            answer: <div className="flex flex-row items-center">
                <p>The questions queue belongs to the meeting manager, questions added
                    to the questions queue by students that raising hand and removed by fist gesture.</p>
                <p>QUEUE IMAGE WILL BE HERE</p>
            </div>

        },
        {
            question: "How can I ask question ?",
            answer: <div className="flex flex-row items-center">
                <p>Just raise your hand </p><img src={raiseHandIcon} style={{ height: 35 }} />
            </div>

        },
        {
            question: "How can I delete my question ?",
            answer: <div className="flex flex-row gap-4 items-center">
                <p>Make fist gesture with one hand up </p><img src={fistIcon} style={{ height: 35 }} />
            </div>
        },
    ]
    const rowsManager = [
        {
            question: "How can I check how much students concentrated in the meeting ?",
            answer: <div className="flex flex-row gap-4 items-center">
                <p>ask OWEN </p><img src={fistIcon} style={{ height: 35 }} />
            </div>
        },
        {
            question: "How can I see my participants feelings about the meeting ?",
            answer: <div className="flex flex-row gap-4 items-center">
                <p>ask OWEN he know</p><img src={fistIcon} style={{ height: 35 }} />
            </div>
        },
        {
            question: "What is Homeroom satistics tab ?",
            answer: <div className="flex flex-row gap-4 items-center">
                <p>It's feature that based on participants feelings, for each meeting we calculate
                    score for the meeting manager. </p><img src={fistIcon} style={{ height: 35 }} />
            </div>
        },
        {
            question: "How Homeroom calculate the manager meeting score ?",
            answer: <div className="flex flex-row gap-4 items-center">
                <p>ask OWEN </p>
            </div>
        },
        {
            question: "How can I see my meetings scores ?",
            answer: <div className="flex flex-row gap-4 items-center">
                <p>In satistics tab. </p>
            </div>
        },
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