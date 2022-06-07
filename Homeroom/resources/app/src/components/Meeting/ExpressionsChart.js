import { useEffect, useState } from "react";

import Draggable from "react-draggable";
import { Chart } from "react-google-charts";
import useTheme from "../../stores/themeStore";

function ChartWrapper({ expressions }) {
  const [data, setData] = useState([]);
  const { getBgFromTheme } = useTheme();

  const options = {
    legend: { position: "none" },
    is3D: true,
    width: "100%",
    height: "100%",
    pieSliceText: "label",
    backgroundColor: getBgFromTheme(),
    animation: {
      duration: 1000,
      easing: "out",
      startup: true,
    },
    tooltip: { showColorCode: true },
    fontName: "Roboto",
    fontSize: 20,
    colors: [
      "#f43f5e",
      "#14b8a6",
      "#d946ef",
      "#3b82f6",
      "#94a3b8",
      "#fdba74",
      "#1f2937",
    ],
  };

  useEffect(() => {
    setData([["Emotion", "Representation"], ...Object.entries(expressions)]);
  }, [expressions]);
  return <Chart chartType="PieChart" data={data} options={options} />;
}
function Header() {
  return (
    <div className="w-auto dark:bg-dark-700 bg-lt-400 rounded-t-md flex flex-row items-center gap-x-2 py-1 px-4">
      <h2 className="dark:text-white font-medium text-lg">Expressions</h2>
    </div>
  );
}

export default function ExpressionsChart({ onMount }) {
  const [expressions, setExpressions] = useState({});

  useEffect(() => {
    onMount([expressions, setExpressions]);
  }, [onMount]);

  return (
    <Draggable defaultPosition={{ x: 50, y: window.innerHeight / 2 }}>
      <div className="absolute z-10 cursor-move w-[350px] h-[300px] border dark:border-dark-700 shadow-lg rounded-t-lg border-lt-600">
        <Header />
        {expressions && Object.keys(expressions).length > 0 && (
          <ChartWrapper expressions={expressions} />
        )}
      </div>
    </Draggable>
  );
}
