import { useEffect, useState } from "react";

import Draggable from "react-draggable";

function Header() {
  return (
    <div className="w-auto dark:bg-dark-700 bg-lt-400 rounded-t-md flex flex-row items-center gap-x-2 py-1 px-4">
      <h2 className="dark:text-white font-medium text-lg">Concentration</h2>
    </div>
  );
}

function ChartWrapper({ concentration }) {
  const getBarColor = () => {
    if (concentration > 0.9) return "bg-primary-400";
    if (concentration > 0.8) return "bg-secondary-400";
    if (concentration > 0.75) return "bg-orange-400";
    if (concentration > 0.65) return "bg-yellow-400";
    if (concentration > 0.5) return "bg-red-400";
    return "bg-red-600";
  };
  return (
    <div className="dark:bg-dark-800 bg-lt-500 h-full w-full px-10 relative">
      <p className="absolute top-0 left-0 text-sm">0%</p>
      <p className="absolute bottom-1/2 left-0 text-sm">50%</p>
      <p className="absolute bottom-0 left-0 text-sm">100%</p>
      <div className="border-l border-b py-1 px-4 h-full relative">
        <div
          style={{ height: `${concentration * 100}%` }}
          className={
            `transition-height flex flex-row items-center justify-center duration-500 ease-out w-full ` +
            getBarColor()
          }
        >
          <p className="font-medium text-lg text-white">
            {parseInt(concentration * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConcentrationMeter({ onMount }) {
  const [concentration, setConcentration] = useState(0);

  useEffect(() => {
    onMount([concentration, setConcentration]);
  }, [onMount]);
  return (
    <Draggable
      defaultPosition={{
        x: window.innerWidth / 1.2,
        y: window.innerHeight / 4,
      }}
    >
      <div className="absolute z-10 cursor-move w-[200px] h-[400px] border dark:border-dark-700 shadow-lg rounded-t-lg border-lt-600">
        <Header />
        <ChartWrapper concentration={concentration} />
      </div>
    </Draggable>
  );
}
