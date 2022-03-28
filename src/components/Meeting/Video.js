function App({ mediaStream, height, width }) {
  const shouldDisplayVideoStream = !!mediaStream
  return (
    <div className="h-full w-full place-items-center justify-center flex">
        {shouldDisplayVideoStream ? (
          <video className="object-fill h-full w-full"
            ref={(e) => {
              if (e) e.srcObject = mediaStream;
            }}
            autoPlay={true}
          />
        ) : (
          <div>User Name</div>
        )}
      </div>
  );
}

export default App;
