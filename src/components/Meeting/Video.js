function App({ stream, height, width, name }) {
  const shouldDisplayVideoStream = !!stream;
  return (
    <div className="h-full w-full place-items-center justify-center flex">
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
