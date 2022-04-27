import { useEffect } from "react";

export default function PopupOverlay({
  type,
  title,
  body,
  timeout = 4000,
  show = false,
  setShow,
}) {
  useEffect(() => {
    var removePopupInterval = null;
    if (setShow) {
      removePopupInterval = setInterval(() => {
        setShow(false);
      }, [timeout]);
    }

    return () => removePopupInterval && clearInterval(removePopupInterval);
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
    `absolute w-74 h-20 ${getBackgroundColor()} rounded-lg p-2 ${getPosition()} transition-all delay-200`;

  return (
    <div className={getStyles()}>
      <h1 className="font-bold text-white text-2xl">{title}</h1>
      <p className="font-medium text-white text-lg">{body}</p>
    </div>
  );
}
