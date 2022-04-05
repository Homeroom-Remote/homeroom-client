import { useEffect, useState } from "react";
import error_svg from "../../utils/error.svg";
import { PrevPageArrow } from "../../utils/svgs";

const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-lt-100 text-text-900 \
                      dark:bg-dark-900 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden flex items-center justify-center relative";

export default function Error({ error, goBack }) {
  const [rightAlign, setRightAlign] = useState("right-0");
  useEffect(() => {
    const rightAlignTimeout = setTimeout(() => {
      setRightAlign("right-2 animate-bounce");
    }, [2000]);

    return () => clearTimeout(rightAlignTimeout);
  }, []);
  return (
    <div className={globalStyles}>
      <button
        onClick={goBack}
        className={
          "absolute top-6 w-10 h-10 cursor-pointer bg-secondary-400 bg-opacity-70 rounded-lg hover:bg-opacity-80 transition-all " +
          rightAlign
        }
      >
        <PrevPageArrow />
      </button>
      <div className="w-1/2 h-1/2 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-medium text-primary-400">
          This is akward
        </h1>
        <h3 className="text-2xl mt-4">
          Seems like we can't connect to that meeting at this moment! Try again
          later.
        </h3>
        <div>
          <object
            type="image/svg+xml"
            data={error_svg}
            width={800}
            height={400}
            className="object-contain"
          >
            svg-animation
          </object>
        </div>
      </div>
    </div>
  );
}
