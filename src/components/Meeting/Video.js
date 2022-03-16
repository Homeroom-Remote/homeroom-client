function App(props) {
  console.log(props?.mediaStream);
  return (
    <div className="App">
      <div>
        <video
          ref={(e) => {
            if (e) e.srcObject = props?.mediaStream;
          }}
          autoPlay={true}
        />
      </div>
    </div>
  );
}

export default App;
