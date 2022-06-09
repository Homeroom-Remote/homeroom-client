import { useEffect, useRef } from "react";
import * as handpose from "@tensorflow-models/handpose";

export default function Game() {
  const savedHighScore = JSON.parse(localStorage.getItem("high-score-gestures"));
  const result = useRef(0);
  const bestResult = useRef(savedHighScore ? savedHighScore : 0);
  const Prediction = useRef({
    lastReading: null,
    callback: null,
    onDirection(cb) {
      this.callback = cb;
    },
    handleDirection(dir) {
      this.callback && this.callback(dir);
    },
    setLastReading(reading) {
      this.lastReading = reading;
    },
  });

  ///////////////////
  // Hand recognition
  ///////////////////
  const config = {
    video: { width: 640, height: 480, fps: 30 },
  };

  async function initCamera(width, height, fps) {
    const constraints = {
      audio: false,
      video: {
        facingMode: "user",
        width: width,
        height: height,
        frameRate: { max: fps },
      },
    };

    const video = document.querySelector("#pose-video");
    video.width = width;
    video.height = height;

    // get video stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }

  async function main() {
    const video = document.querySelector("#pose-video");
    const videoCanvas = document.querySelector("#pose-canvas");
    const ctx = videoCanvas.getContext("2d");

    const resultLayer = document.querySelector("#pose-result");

    // load handpose model
    const model = await handpose.load();

    // main estimation loop
    const estimateHands = async () => {
      // clear canvas overlay
      ctx.clearRect(0, 0, config.video.width, config.video.height);
      resultLayer.innerText = "";

      // get hand landmarks from video
      // Note: Handpose currently only detects one hand at a time
      // Therefore the maximum number of predictions is 1
      const predictions = await model.estimateHands(video, true);

      if (predictions.length > 0) {
        const br = predictions[0].boundingBox.topLeft;
        if (!Prediction.current.lastReading)
          Prediction.current.setLastReading(br);
        else {
          const lr_x = Prediction.current.lastReading[0];
          const lr_y = Prediction.current.lastReading[1];
          const br_x = br[0];
          const br_y = br[1];

          const y_delta = br_y - lr_y;
          const x_delta = br_x - lr_x;

          var shouldUpdate = false;
          if (Math.abs(y_delta) > 55.0) {
            Prediction.current.handleDirection(y_delta > 0 ? "down" : "up");
            shouldUpdate = true;
          }

          if (Math.abs(x_delta) > 55.0) {
            Prediction.current.handleDirection(x_delta > 0 ? "right" : "left");
            shouldUpdate = true;
          }

          if (shouldUpdate) Prediction.current.setLastReading(br);
        }
      }
      setTimeout(() => {
        estimateHands();
      }, 1000 / config.video.fps);
    };

    estimateHands();
  }

  useEffect(() => {
    initCamera(config.video.width, config.video.height, config.video.fps).then(
      (video) => {
        video.play();
        video.addEventListener("loadeddata", (event) => {
          main();
        });
      },
      []
    );

    const canvas = document.querySelector("#pose-canvas");
    canvas.width = config.video.width;
    canvas.height = config.video.height;
  });

  ///////////////////////
  // Hand recognition End
  ///////////////////////

  const toggleBestResult = (x) => {
    if (x > bestResult.current) {
      bestResult.current = x;
      document.getElementById("best-score").innerText = x;
      localStorage.setItem("high-score-gestures", JSON.stringify(x));
    }
  };

  useEffect(() => {
    let canvas = document.getElementById("canvas-top");
    let ctx = canvas?.getContext("2d");
    let gameState = {
      rectPosX: 10,
      rectPosY: canvas?.height / 2 - 10,
      rectVelocity: { x: 0, y: 0 },
      playerSpeed: 0.5,
      enemyTimeout: 60,
      enemyTimeoutInit: 60,
      enemySpeed: 1,
      enemies: [],
      friends: [],
      friendAdded: false,
      score: 0,
      trophy: result.current,
    };
    function random(n) {
      return Math.floor(Math.random() * n);
    }
    class RectCollider {
      constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }
      isColliding(rectCollider) {
        if (
          this.x < rectCollider.x + rectCollider.width &&
          this.x + this.width > rectCollider.x &&
          this.y < rectCollider.y + rectCollider.height &&
          this.height + this.y > rectCollider.y
        ) {
          return true;
        }
        return false;
      }
    }
    function checkCollision(gameState) {
      let playerCollider = new RectCollider(
        gameState.rectPosX,
        gameState.rectPosY,
        10,
        10
      );
      for (let i = 0; i < gameState.enemies.length; ++i) {
        let enemyCollider = new RectCollider(
          gameState.enemies[i].x,
          gameState.enemies[i].y,
          10,
          10
        );
        if (playerCollider.isColliding(enemyCollider)) {
          gameState.score = 0;
          gameState.trophy = 0;
          result.current = 0;
          document.getElementById("current-score").innerText = 0;
          return true;
        }
      }
      for (let i = 0; i < gameState.friends.length; ++i) {
        let friendCollider = new RectCollider(
          gameState.friends[i].x,
          gameState.friends[i].y,
          5,
          5
        );
        if (playerCollider.isColliding(friendCollider)) {
          gameState.playerSpeed *= 1.05;
          gameState.friends.splice(i, 1);
          gameState.trophy += 1;
          result.current = gameState.trophy;
          document.getElementById("current-score").innerText = result.current;
          toggleBestResult(result.current);
        }
      }
    }
    function update() {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      gameState.enemyTimeout -= 1;
      if (gameState.enemyTimeout === 0) {
        gameState.enemyTimeout = Math.floor(gameState.enemyTimeoutInit);
        gameState.enemies.push({
          x: canvas.width,
          y: random(canvas.height),
          velocity: gameState.enemySpeed,
        });
        gameState.enemySpeed *= 1.001;
        gameState.enemyTimeoutInit = gameState.enemyTimeoutInit * 0.999;
      }
      ctx.fillStyle = "#FF0000";
      gameState.rectPosX += gameState.rectVelocity.x;
      gameState.rectPosY += gameState.rectVelocity.y;
      if (gameState.rectPosX > canvas.width - 10) {
        gameState.rectPosX = canvas.width - 10;
        gameState.rectVelocity.x = 0;
      }
      if (gameState.rectPosX < 0) {
        gameState.rectPosX = 0;
        gameState.rectVelocity.x = 0;
      }
      if (gameState.rectPosY < 0) {
        gameState.rectPosY = 0;
        gameState.rectVelocity.y = 0;
      }
      if (gameState.rectPosY > canvas.height - 10) {
        gameState.rectPosY = canvas.height - 10;
        gameState.rectVelocity.y = 0;
      }
      ctx.fillRect(gameState.rectPosX, gameState.rectPosY, 10, 10);
      ctx.fillStyle = "#0000FF";
      for (let i = 0; i < gameState.enemies.length; ++i) {
        gameState.enemies[i].x -= gameState.enemies[i].velocity;
        ctx.fillRect(gameState.enemies[i].x, gameState.enemies[i].y, 10, 10);
      }
      for (let i = 0; i < gameState.enemies.length; ++i) {
        if (gameState.enemies[i].x < -10) {
          gameState.enemies.splice(i, 1);
          gameState.score++;
        }
      }
      //   document.getElementById("score").innerHTML = "score: " + gameState.trophy;
      if (gameState.score % 3 === 0 && gameState.friendAdded === false) {
        gameState.friends.push({
          x: random(canvas.width - 20),
          y: random(canvas.height - 20),
        });
        gameState.friendAdded = true;
      }
      if (gameState.score % 3 === 1 && gameState.friendAdded === true) {
        gameState.friendAdded = false;
      }
      for (let i = 0; i < gameState.friends.length; ++i) {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(gameState.friends[i].x, gameState.friends[i].y, 5, 5);
      }
      if (checkCollision(gameState) === true) {
        gameState = {
          rectPosX: 10,
          rectPosY: canvas.height / 2 - 10,
          rectVelocity: { x: 0, y: 0 },
          playerSpeed: 0.5,
          enemyTimeout: 60,
          enemyTimeoutInit: 60,
          enemySpeed: 1,
          enemies: [],
          friends: [],
          friendAdded: false,
          score: 0,
          trophy: result.current,
        };
      }
    }
    setInterval(update, 20);
    document.addEventListener("keydown", function (event) {
      if (event.code === "ArrowRight") {
        gameState.rectVelocity.x = gameState.playerSpeed;
      }
      if (event.code === "ArrowLeft") {
        gameState.rectVelocity.x = -gameState.playerSpeed;
      }
      if (event.code === "ArrowDown") {
        gameState.rectVelocity.y = gameState.playerSpeed;
      }
      if (event.code === "ArrowUp") {
        gameState.rectVelocity.y = -gameState.playerSpeed;
      }
    });

    Prediction.current.onDirection((direction) => {
      if (direction === "right") {
        gameState.rectVelocity.x = gameState.playerSpeed;
      }
      if (direction === "left") {
        gameState.rectVelocity.x = -gameState.playerSpeed;
      }
      if (direction === "down") {
        gameState.rectVelocity.y = gameState.playerSpeed;
      }
      if (direction === "up") {
        gameState.rectVelocity.y = -gameState.playerSpeed;
      }
    });
  }, []);

  return (
    <div className="game center relative flex flex-col items-center justify-start gap-y-4 h-full overflow-none">
      <div className="video absolute w-64 h-64 left-10 bottom-0">
        <div id="video-container border ">
          <video
            id="pose-video"
            style={{ transform: "rotateY(180deg)" }}
            className="layer"
            playsInline
          ></video>
          <canvas id="pose-canvas" className="layer"></canvas>
          <div id="pose-result" className="layer"></div>
        </div>
      </div>
      <header>
        <p className=" text-center text-primary-400 text-2xl">
          Play the game while waiting for your meeting to start!
        </p>
        <article className="text-center text-secondary-500 text-lg">
          <p id="score">
            Your score: <span id="current-score">{result.current}</span>. Best
            Score: <span id="best-score">{bestResult.current}</span>
          </p>
        </article>
      </header>

      <article className="w-full flex flex-col items-center">
        <div className="canvas-wrapper border-4 border-primary-400 w-11/12">
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
  );
}
