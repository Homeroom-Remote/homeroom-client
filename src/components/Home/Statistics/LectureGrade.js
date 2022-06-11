import GraeCircle from "./GradeCircle";
import "./LectureGrade.css";
export default function LectureGrade({ grade, tips }) {
  return (
    <div className="h-full py-8 px-6 rounded-xl border-2 border-dark-500 dark:bg-dark-800 bg-lt-50 justify-center">
      <div className="flex">
        <div className="flex flex-row gap-3">
          <GraeCircle grade={grade} />
          <div className="">
            {tips.map((tip, index) => (
              <div key={`meeting-tip-${index}`}>
                <p className="text-text-600 dark:text-white">{tip}</p>
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
