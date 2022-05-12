function Video({ stream, name, id, me = false }) {
  const shouldDisplayVideoStream =
    stream &&
    stream.active &&
    stream.getVideoTracks().length > 0 &&
    stream.getVideoTracks()[0].enabled;

  const getHandGestureStyles = () => {
    if (!me) return "absolute top-2 right-2 text-3xl";
    return "absolute left-1/2 -translate-x-1/2 text-[80px]";
  };

  return (
    <div className="h-full w-full dark:bg-dark-800 bg-lt-300 place-items-center justify-center flex border p-1 shadow-lg dark:border-dark-600 border-lt-400 rounded-lg relative">
      <p id={`hand-gesture-${id}`} className={getHandGestureStyles()}></p>
      {shouldDisplayVideoStream ? (
        <video
          className="h-full w-full"
          ref={(e) => {
            if (e) e.srcObject = stream;
          }}
          autoPlay={true}
        />
      ) : (
        <h1 className="font-bold text-4xl">{name}</h1>
      )}
    </div>
  );
}

export default Video;
