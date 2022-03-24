function App({ mediaStream }) {
  const shouldDisplayVideoStream = !!mediaStream;

  return (
    <div className="">
      <div>
        {shouldDisplayVideoStream ? (
          <video
            ref={(e) => {
              if (e) e.srcObject = mediaStream;
            }}
            autoPlay={true}
          />
        ) : (
          <div className="bg-black">Shachar with 2 L's</div>
        )}
      </div>
    </div>
  );
}

export default App;
