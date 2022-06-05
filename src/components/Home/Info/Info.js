import React from "react";
import InfoRow from "./InfoRow";
import Questions from "./questions";

export default function Info() {
  return (
    <div className="overflow-auto h-full relative ">
      <section className="absolute">
        <div className="container w-full px-6 py-10 mx-auto">
          <h1 className="text-4xl font-semibold text-center text-gray-800 dark:text-white ">
            Frequently asked questions
          </h1>
          <br />
          <br />
          <h2 className="text-2xl font-semibold text-left text-gray-800 dark:text-white">
            {" "}
            General{" "}
          </h2>
          <div className="mt-12 space-y-8">
            {Questions.GeneralFAQ.map(({ question, answer }) => {
              return (
                <InfoRow question={question} answer={answer} key={question} />
              );
            })}
          </div>
          <br />
          <br />

          <h2 className="text-2xl font-semibold text-left text-gray-800 dark:text-white">
            For Meeting Manager
          </h2>
          <div className="mt-12 space-y-8">
            {Questions.OwnerFAQ.map(({ question, answer }) => {
              return (
                <InfoRow question={question} answer={answer} key={question} />
              );
            })}
          </div>
        </div>
        <br />
      </section>
    </div>
  );
}
