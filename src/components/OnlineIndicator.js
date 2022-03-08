export default function OnlineIndicator({ online }) {
  return (
    <span className="flex h-3 w-3 absolute top-0 left-0">
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
