import { useEffect, useState } from "react";
import GameArrows from "./GameArrows";
import GameGestures from "./GameGestures";
import Swal from "sweetalert2";

export default function Game() {
  const [arrowGame, setArrowGame] = useState(false);
  const [gestureaGame, setGesturesGame] = useState(false);

  useEffect(() => {
    Swal.fire({
      title: "Choose game mode:",
      color: "rgb(74, 222, 128)",
      background: "rgb(126, 34, 206)",
      showCancelButton: true,
      confirmButtonColor: "rgb(34, 197, 94)",
      confirmButtonText: "Play with Up, Down, Right and Left arrows",
      cancelButtonColor: "rgb(34, 197, 94)",
      cancelButtonText: "Play with hand gestures",
      icon: "question",
    }).then((result) => {
      if (result.isConfirmed) {
        setArrowGame(true);
        return;
      } else {
        setGesturesGame(true);
        return;
      }
    });
  }, []);

  return !arrowGame && !gestureaGame ? (
    <div className="game center relative flex flex-col items-center justify-center gap-y-4 h-full">
      <header>
        <p className="text-center text-primary-400 text-2xl">
          Play the game while waiting for your meeting to start!
        </p>
      </header>

      <article className="w-full flex flex-col items-center">
        <div className="canvas-wrapper border-8 border-primary-400 w-11/12">
          <canvas id="canvas-top" className="w-full"></canvas>
        </div>
        <div className="">
          <p className=" text-center text-secondary-500 text-md">
            Collect the red squares and watch out from the blue squares.
          </p>
          <p className=" text-center text-secondary-500 text-md">
            Move with the right, left, up and down arrows.
          </p>
        </div>
      </article>
    </div>
  ) : gestureaGame ? (
    <GameGestures />
  ) : (
    <GameArrows />
  );
}
