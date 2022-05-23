
import React, { useEffect, useState } from "react";
import InfoRow from "./InfoRow";

export default function Info() {
    const rows = [
        { question: "whatsUpp", answer: "everythingallwrite" },
        { question: "tzahi hello", answer: "blah blah blah " }
    ]
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="container max-w-4xl px-6 py-10 mx-auto">
                <h1 className="text-4xl font-semibold text-center text-gray-800 dark:text-white">Frequently asked questions</h1>

                <div className="mt-12 space-y-8">
                    {rows.map(({ question, answer }) => {
                        return <InfoRow question={question} answer={answer} key={question} />
                    })}
                </div>
            </div>
        </section>
    );
}