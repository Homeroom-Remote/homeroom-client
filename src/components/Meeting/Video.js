import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import Toolbar from './Toolbar';

function App(props) {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const camera = props.camera
  const microphone = props.microphone
  const peer = new Peer();

  useEffect(() => {
    if(microphone || camera) {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
           getUserMedia({ video: camera, audio: microphone }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
      });
    }
    else {
      currentUserVideoRef.current.srcObject = null;
    }

    peerInstance.current = peer;
  }, [camera, microphone])

  // const call = (remotePeerId) => {
  //   var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  //   getUserMedia({ video: true, audio: false }, (mediaStream) => {

  //     currentUserVideoRef.current.srcObject = mediaStream;
  //     currentUserVideoRef.current.play();

  //     const call = peerInstance.current.call(remotePeerId, mediaStream)

  //     call.on('stream', (remoteStream) => {
  //       remoteVideoRef.current.srcObject = remoteStream
  //       remoteVideoRef.current.play();
  //     });
    // });
  // }

  return (
    <div className="App">
      {/* <h1>{peerId}</h1> */}
      {/* <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} /> */}
      {/* <br></br> */}
      {/* <button onClick={() => call(remotePeerIdValue)}>Call</button> */}
      <div>
        <video ref={currentUserVideoRef} /> {/*our video*/}
      </div>
      {/* <div> */}
        {/* <video ref={remoteVideoRef} /> their video */}
      {/* </div> */}
    </div>
  );
}

export default App;