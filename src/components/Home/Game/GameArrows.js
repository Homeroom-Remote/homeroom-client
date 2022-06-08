import { useEffect, useState } from "react";

export default function Game() {
  const [result, setResult] = useState(0);
  const [bestResult, setBestResult] = useState(0);
  const toggleBestResult = (x) => {
    if (x > bestResult) setBestResult(x);
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
      trophy: result,
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
          setResult(gameState.trophy);
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
          gameState.trophy++;
          setResult(gameState.trophy);
          toggleBestResult(gameState.trophy);
        }
      }
    }
    function update() {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      gameState.enemyTimeout -= 1;
      if (gameState.enemyTimeout == 0) {
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
      if (gameState.score % 3 == 0 && gameState.friendAdded == false) {
        gameState.friends.push({
          x: random(canvas.width - 20),
          y: random(canvas.height - 20),
        });
        gameState.friendAdded = true;
      }
      if (gameState.score % 3 == 1 && gameState.friendAdded == true) {
        gameState.friendAdded = false;
      }
      for (let i = 0; i < gameState.friends.length; ++i) {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(gameState.friends[i].x, gameState.friends[i].y, 5, 5);
      }
      if (checkCollision(gameState) == true) {
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
          trophy: result,
        };
      }
    }
    setInterval(update, 20);
    document.addEventListener("keydown", function (event) {
      if (event.code == "ArrowRight") {
        gameState.rectVelocity.x = gameState.playerSpeed;
      }
      if (event.code == "ArrowLeft") {
        gameState.rectVelocity.x = -gameState.playerSpeed;
      }
      if (event.code == "ArrowDown") {
        gameState.rectVelocity.y = gameState.playerSpeed;
      }
      if (event.code == "ArrowUp") {
        gameState.rectVelocity.y = -gameState.playerSpeed;
      }
    });
  }, []);

  return (
    <div className="game center relative flex flex-col items-center justify-center gap-y-4 h-full overflow-auto">
      <header>
        <p className="text-center text-primary-400 text-2xl">
          Play the game while waiting for your meeting to start!
        </p>
        <article className="text-center text-secondary-500 text-lg">
          <p id="score">
            Your score: {result}. Best Score: {bestResult}
          </p>
        </article>
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
  );
}
