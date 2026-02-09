export function initSnake() {
  const canvas = document.getElementById("snakeCanvas");
  const scoreEl = document.getElementById("snakeScore");
  const restartBtn = document.getElementById("snakeRestart");

  const btnUp = document.getElementById("btnUp");
  const btnDown = document.getElementById("btnDown");
  const btnLeft = document.getElementById("btnLeft");
  const btnRight = document.getElementById("btnRight");

  if (!canvas || !scoreEl || !restartBtn) return;

  const ctx = canvas.getContext("2d");

  const GRID = 21;
  const CELL = canvas.width / GRID;

  let dir, nextDir, snake, food, score, tickMs, timer, alive;

  function same(a, b) { return a.x === b.x && a.y === b.y; }
  function rndCell() { return { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }; }

  function spawnFood() {
    let f;
    do { f = rndCell(); } while (snake.some(s => same(s, f)));
    return f;
  }

  function setDir(nx, ny) {
    // запрет разворота на 180°
    if (nx === -dir.x && ny === -dir.y) return;
    nextDir = { x: nx, y: ny };
  }

  function draw(gameOver = false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // сетка
    ctx.globalAlpha = 0.12;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.strokeStyle = "#fff"; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(canvas.width, i * CELL); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // еда
    ctx.fillStyle = "#ff4d6d";
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);

    // змейка
    snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? "#8b5cf6" : "#e5e7eb";
      ctx.fillRect(p.x * CELL + 2, p.y * CELL + 2, CELL - 4, CELL - 4);
    });

    // game over слой
    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,.55)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      ctx.font = "700 28px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = "16px system-ui";
      ctx.fillText("Нажми Restart", canvas.width / 2, canvas.height / 2 + 20);
    }
  }

  function step() {
    if (!alive) return;

    dir = nextDir;

    const head = snake[0];
    const newHead = { x: head.x + dir.x, y: head.y + dir.y };

    // стены
    if (newHead.x < 0 || newHead.x >= GRID || newHead.y < 0 || newHead.y >= GRID) {
      alive = false;
      draw(true);
      return;
    }

    // врезался в себя
    if (snake.some((s, i) => i !== 0 && same(s, newHead))) {
      alive = false;
      draw(true);
      return;
    }

    snake.unshift(newHead);

    if (same(newHead, food)) {
      score += 1;
      scoreEl.textContent = String(score);
      food = spawnFood();

      // ускорение каждые 5 очков
      if (score % 5 === 0 && tickMs > 60) {
        tickMs -= 10;
        clearInterval(timer);
        timer = setInterval(step, tickMs);
      }
    } else {
      snake.pop();
    }

    draw(false);
  }

  function reset() {
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    food = spawnFood();
    score = 0;
    tickMs = 120;
    alive = true;

    scoreEl.textContent = "0";

    clearInterval(timer);
    timer = setInterval(step, tickMs);
    draw(false);
  }

  // Управление кнопками
  btnUp?.addEventListener("click", () => setDir(0, -1));
  btnDown?.addEventListener("click", () => setDir(0, 1));
  btnLeft?.addEventListener("click", () => setDir(-1, 0));
  btnRight?.addEventListener("click", () => setDir(1, 0));

  restartBtn.addEventListener("click", reset);

  reset();
}
