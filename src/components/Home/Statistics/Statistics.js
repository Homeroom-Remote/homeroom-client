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
        colors: ['rgb(192, 132, 252)', 'rgb(74, 222, 128)'],
        backgroundColor: 'white',
        lineWidth: 4,

      };
      const grade = 81;

  return (
    <div className="px-6 pt-6 py-16 2xl:container h-full">
        <div className="grid gap-6 grid-cols-2 h-full ">
            <LectureResults data={data} options={options} />
            <LectureGrade grade={grade}/>
        </div>
    </div>
  );
}