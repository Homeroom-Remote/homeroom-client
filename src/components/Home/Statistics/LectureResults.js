import { Chart } from "react-google-charts";


export default function LectureResults({ data, options, header, isColumn }) {
    if (isColumn)
        return (
            <div className=" px-6 rounded-xl border-2 border-dark-500 dark:bg-dark-800 bg-lt-50 item-center content-center h-fit">
                <div className="my-8">
                    <h1 className="text-4xl font-bold dark:text-lt-50 text-gray-800 text-center">{header}</h1>
                </div>
                <Chart chartType="AreaChart" width="100%" height="90%" data={data} options={options} />
            </div>
        );
    return (
        <div className=" px-6 rounded-xl border-2 border-dark-500 dark:bg-dark-800 bg-lt-50 item-center content-center h-fit">
            <div className="my-8">
                <h1 className="text-4xl font-bold dark:text-lt-50 text-gray-800 text-center">{header}</h1>
            </div>
            <Chart chartType="LineChart" width="100%" height="90%" data={data} options={options} />
        </div>
    );
}

