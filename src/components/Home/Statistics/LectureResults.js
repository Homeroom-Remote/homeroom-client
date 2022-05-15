import { Chart } from "react-google-charts";


export default function LectureResults({data, options}) {

  return (
        <div className="h-full px-6 rounded-xl border border-gray-200 bg-white">
            <div className="my-8">
                <h1 className="text-5xl font-bold text-gray-800">Class Performance</h1>
            </div>
            <Chart chartType="LineChart" width="100%" height="400px" data={data} options={options}/>
        </div>
  );
}