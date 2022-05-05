function Video({ stream, name, attachedId }) {
  const shouldDisplayVideoStream = stream && stream.active;
  return (
    <div className="h-full w-full dark:bg-dark-900 bg-lt-300 place-items-center justify-center flex border p-1 shadow-lg dark:border-dark-200 border-lt-400 rounded-lg">
      {shouldDisplayVideoStream ? (
        <video
          className="h-full w-full"
          id={attachedId ? "myVideoEl" : ""}
          ref={(e) => {
            if (e) e.srcObject = stream;
          }}
          autoPlay={true}
        />
      ) : shouldDisplayAudioStream ? (
        <div><video
          className="h-full w-full"
          ref={(e) => {
            if (e)
              e.srcObject = stream;
          }}
          autoPlay={true} /><h1 className="font-bold text-4xl mb-40 mt-2.5 text-center">{name}</h1></div>
      ) : (
        <h1 className="font-bold text-4xl">{name}</h1>
      )}
    </div>
  );
}

export default Video;