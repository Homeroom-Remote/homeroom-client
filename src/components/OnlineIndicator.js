export default function OnlineIndicator({ online, center = false }) {
  const getPosition = () => {
    if (center) {
      return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
    }

    return "top-0 left-0";
  };
  return (
    <span className={"flex h-3 w-3 absolute " + getPosition()}>
      {online ? (
        <>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-500"></span>
        </>
      ) : (
        <>
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </>
      )}
    </span>
  );
}
