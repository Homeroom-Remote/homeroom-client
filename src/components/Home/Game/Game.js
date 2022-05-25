import { useEffect, useState } from 'react';
import GameArrows from './GameArrows'
import GameGestures from './GameGestures'
import Swal from "sweetalert2";





export default function Game() {

const [arrowGame, setArrowGame] = useState(false)
const [gestureaGame, setGesturesGame] = useState(false)


useEffect(() => {
  Swal.fire({
    // width: "20%",
    title: "Choose game mode:",
    color: "rgb(74, 222, 128)",
    background: "rgb(126, 34, 206)",
    showCancelButton: true,
    confirmButtonColor: "rgb(34, 197, 94)",
    confirmButtonText: "Play with hand gestures",
    cancelButtonColor: "rgb(34, 197, 94)",
    cancelButtonText: "Play with Up, Down, Right and Left arrows",
    icon: "question",
    // backdrop: 'rgba(0,0,123,0.4)'
  }).then((result) => {
    if (result.isConfirmed) {
      setGesturesGame(true)
      return
    }
    else {
      setArrowGame(true)
      return
    }
  });
}, [])
 

  
    return (
(!arrowGame && !gestureaGame) ?
<div className="game center relative">
    <div className=''>
        <p className=' text-center text-primary-400 text-2xl'>Play the game while waiting for your meeting to start!</p>
        </div>
    <div className='text-center text-secondary-500 text-lg'>
        <p id="score">Your score: 0. Best Score: 0</p>
        </div>
  <div className="canvas-wrapper  border-8 border-primary-400 ">
    <canvas id="canvas-top" className='w-full' ></canvas>
  </div>
  <div className=''>
        <p className=' text-center text-secondary-500 text-md'>
            Collect the red squares and watch out from the blue squares.
        </p>
        <p className=' text-center text-secondary-500 text-md'>
            Move with the right, left, up and down arrows.
        </p>
  </div>
</div>
: gestureaGame ? <GameGestures/> : <GameArrows />
    );
  }



  