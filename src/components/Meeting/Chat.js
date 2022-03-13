import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import Toolbar from './Toolbar';

function App(props) {
  const chat = props.chat
  useEffect(() => {
    if(chat) {
        console.log("1")
    }
    else {
        console.log("2")
    }
  }, [chat])

  return (
    <div>
        <div classNmae="flex flex-row justify-center items-center">
            <p className="text-black text-center">Chat</p>
        </div>
        <div className="text-red-600">
            <input id="chat_message" type="text" placeholder="Type message here..." />
        </div>
    </div>
  );
}

export default App;
