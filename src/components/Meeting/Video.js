function App({ stream, height, width, name }) {
  const shouldDisplayVideoStream = !!stream;
  return (
    <div className="h-full w-full place-items-center justify-center flex border p-1 shadow-lg dark:border-dark-200 border-lt-400 rounded-lg">
      {shouldDisplayVideoStream ? (
        <video
          className="object-fill h-full w-full"
          ref={(e) => {
            if (e) e.srcObject = stream;
          }}
          autoPlay={true}
        />
      ) : (
        <div>{name}</div>
      )}
    </div>
  );
}

export default App;
