function App({ mediaStream }) {
  const shouldDisplayVideoStream = !!mediaStream;

  return (
    <div className="h-80 w-80">
      <div>
        {shouldDisplayVideoStream ? (
          <video
            ref={(e) => {
              if (e) e.srcObject = mediaStream;
            }}
            autoPlay={true}
          />
        ) : (
          <div className="bg-black">Can't display video</div>
        )}
      </div>
    </div>
  );
}

export default App;
