import { Chart } from "react-google-charts";


export default function LectureResults({data, options}) {
  return (
        <div className="h-full px-6 rounded-xl border border-dark-500 dark:bg-dark-800 bg-lt-50 item-center  content-center">
            <div className="my-8">
                <h1 className="text-5xl font-bold dark:text-lt-50 text-gray-800 text-center">Class Performance</h1>
            </div>
            <Chart chartType="LineChart" width="100%" height="90%" data={data} options={options} />
        </div>
  );
}

