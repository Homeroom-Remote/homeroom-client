import { useEffect } from "react";
import usePopup from "../stores/popupStore";

export default function PopupOverlay() {
  const { opts, show, setShow } = usePopup();
  const type = opts?.type;
  const title = opts?.title;
  const body = opts?.body;
  const timeout = opts?.timeout || 4000;
  useEffect(() => {
    var removePopupTimeout = null;
    removePopupTimeout = setTimeout(() => {
      setShow(false);
    }, timeout);

    return () => {
      setShow(false);
      removePopupTimeout && clearTimeout(removePopupTimeout);
    };
  }, [timeout, setShow]);

  const getBackgroundColor = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-400";
      case "success":
        return "bg-green-400";
      case "error":
        return "bg-red-500";
      default:
        return "bg-white";
    }
  };
  const getPosition = () => {
    if (show) return "top-4 left-4";
    return "top-4 -left-1/2";
  };

  const getStyles = () =>
    `absolute w-74 h-20 ${getBackgroundColor()} rounded-lg p-2 ${getPosition()} transition-all delay-200 z-50`;

  return (
    <div className={getStyles()}>
      <h1 className="font-bold text-white text-2xl">{title}</h1>
      <p className="font-medium text-white text-lg">{body}</p>
    </div>
  );
}
