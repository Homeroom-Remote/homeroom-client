import { useEffect, useState } from "react";
import loading_svg from "../../utils/loading.svg";
import { PrevPageArrow } from "../../utils/svgs";

const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-lt-100 text-text-900 \
                      dark:bg-dark-900 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden flex items-center justify-center relative";

export default function MeetingLoading() {
  const [loadingText, setLoadingText] = useState("Loading");
  useEffect(() => {
    const loadingTextInterval = setInterval(() => {
      setLoadingText((text) => (text.length < 10 ? text + "." : "Loading"));
    }, 500);

    return () => setInterval(loadingTextInterval);
  }, []);
  return (
    <div className={globalStyles}>
      <div className="w-1/2 h-1/2 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-medium text-primary-400">{loadingText}</h1>
        <h3 className="text-2xl mt-4">Connecting to meeting.</h3>
        <div>
          <object
            type="image/svg+xml"
            data={loading_svg}
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
