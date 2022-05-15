import { Chart } from "react-google-charts";
import LectureResults from "./LectureResults";
import LectureGrade from "./LectureGrade";

export default function Statistics() {
    const data = [
        ["Minute", "Concentration", "Participation"],
        ["1", 803, 400],
        ["2", 500, 460],
        ["3", 660, 100],
        ["4", 100, 540],
      ];
      const options = {
        curveType: "function",
        legend: { position: "bottom" },
      };

  return (
    <div className="px-6 pt-6 2xl:container">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <LectureResults data={data} options={options} />
            <LectureGrade />
        </div>
    </div>
  );
}