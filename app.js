const WIDTH = 500;
const HEIGHT = 500;

const SIZE = 50;
const INITIAL_LENGTH = 5;

const FOOD_COLOR = "#0000ff";
const SPEED = 10;
const SNAKE_COLOR = "#00ff00";
const canvas = document.querySelector("canvas");
const display = document.querySelector(".display");
const ctx = canvas.getContext("2d");
const GRID = new Array(10).fill(new Array(10).fill(0));
let isOver = false;

let score = 0;
const GRID_POINTS = GRID.map((row, i) => {
  return row.map((_col, j) => {
    return [i * SIZE, j * SIZE];
  });
}).flat();




let updteCount = 0;
class Snake {
  constructor() {
    this.body = [
      GRID_POINTS[0],
      GRID_POINTS[10],
      GRID_POINTS[20],
    ].map(([x,y], i) => {
      return {
        x,
        y,
        w: SIZE,
        h: SIZE,
      };
    }).reverse();
    this.coordinates = this.body.map((b) => [b.x, b.y]);
    this.color = SNAKE_COLOR;
    this.head_color = "#ff0000";
    this.direction = "right";
  }
  draw() {
    ctx.save();

    ctx.beginPath();

    for (let i = 0; i < this.body.length; i++) {
      const square = this.body[i];
      ctx.fillStyle = i === 0 ? this.head_color : this.color;
      ctx.fillRect(square.x, square.y, square.w, square.h);
      ctx.strokeRect(square.x, square.y, square.w, square.h);
    }

    ctx.restore();
  }

  move(food) {
    const [x, y] = this.coordinates[0];

    if (this.direction === "right") {
      const newHead = { x: x + SIZE, y, w: SIZE, h: SIZE };
      this.coordinates.unshift([newHead.x, newHead.y]);
      this.body.unshift(newHead);
    } else if (this.direction === "down") {
      const newHead = { x, y: y + SIZE, w: SIZE, h: SIZE };
      this.coordinates.unshift([newHead.x, newHead.y]);
      this.body.unshift(newHead);
    } else if (this.direction === "up") {
      const newHead = { x, y: y - SIZE, w: SIZE, h: SIZE };
      this.coordinates.unshift([newHead.x, newHead.y]);
      this.body.unshift(newHead);
    } else if (this.direction === "left") {
      const newHead = { x: x - SIZE, y, w: SIZE, h: SIZE };
      this.coordinates.unshift([newHead.x, newHead.y]);
      this.body.unshift(newHead);
    }

    if (!collide(this, food)) {
      this.coordinates.pop();
      const { x: dx, y: dy, h: dh, w: dw } = this.body.pop();
      ctx.clearRect(dx, dy, dw, dh);
    } else {
      score++;
    }
  }
}

class Food {
  constructor() {
    let randomPoint =
      GRID_POINTS[Math.floor(Math.random() * GRID_POINTS.length)];
    this.x = randomPoint[0];
    this.y = randomPoint[1];
  }

  draw() {
    ctx.save();

    ctx.beginPath();
    ctx.fillStyle = FOOD_COLOR;

    ctx.arc(this.x+SIZE/2, this.y +SIZE/2, SIZE/2,0,2 * Math.PI );
    ctx.fill()

    ctx.restore();
  }
  resetFood() {
    let randomPoint =
      GRID_POINTS[Math.floor(Math.random() * GRID_POINTS.length)];
    this.x = randomPoint[0];
    this.y = randomPoint[1];
  }
}

function collide(snake, food) {
  const [x, y] = snake.coordinates[0];

  if (x === food.x && y === food.y) {
    return true;
  }
}
function handleGameOver(snake) {
  let [x, y] = snake.coordinates[0];
 
  if (x > WIDTH || x < 0 || y < 0 || y > HEIGHT) {
    gameOver();
  }
  for (let i = 1; i < snake.coordinates.length; i++) {
    if (
      snake.coordinates[i][0] === x &&
      snake.coordinates[i][1] === y 
    ) {
      gameOver();

      
    }
  }
}

function gameOver() {
  canvas.style.display = "none";

  const h1 = document.createElement("h1");
  const button = document.createElement("button");
  
  display.appendChild(h1);
  display.appendChild(button);
  h1.innerHTML = `GAME OVER <br> Your Score is ${score}`;
button.textContent ="Reset"
  h1.style.color = "#ff0000";
button.style.padding ="1rem"
button.style.fontSize ="2rem"
button.style.cursor ="pointer"
button.addEventListener("click",()=>{
  location.reload()
})
  isOver = true;
}

window.addEventListener("DOMContentLoaded" || "resize", () => {
  canvas.height = HEIGHT;
  canvas.width = WIDTH;

  const snake = new Snake();
  const food = new Food();
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" && snake.direction !== "up") {
      snake.direction = "down";
    } else if (e.key === "ArrowUp" && snake.direction !== "down") {
      snake.direction = "up";
    } else if (e.key === "ArrowRight" && snake.direction !== "left") {
      snake.direction = "right";
    } else if (e.key === "ArrowLeft" && snake.direction !== "right") {
      snake.direction = "left";
    }
  });
 
  function animate() {
    if (updteCount % SPEED === 0) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      handleGameOver(snake);
      snake.move(food);
      snake.draw();

      food.draw();

      ctx.save();
      ctx.fillStyle = "#ff0000";
      ctx.font = "70px sans-serif";
      ctx.fillText(`Score:${score}`, 45, 65);
      ctx.restore();
    } else if (updteCount > 60) {
      updteCount = 0;
    }

    if (isOver) return;
    updteCount++;
    collide(snake, food) && food.resetFood();
    requestAnimationFrame(animate);
  }
  animate();
});
