let level = 1;
let currLevel = levels[level];
let startingPoint = [7, 13];
let x = 7, y = 13;
let path = [{ x, y }];

const gridSize = 15;
const cellSizeGame = 500 / gridSize; // para #game
const cellSizeLevel = 300 / gridSize; // para #level (ajústalo según el nuevo tamaño del canvas)
let steps = 0;

const gameCanvas = document.getElementById("game");
const levelCanvas = document.getElementById("level");
const gameContext = gameCanvas.getContext("2d");
const levelContext = levelCanvas.getContext("2d");

function draw() {
  // Limpiar los canvas
  gameContext.clearRect(0, 0, 500, 500);
  levelContext.clearRect(0, 0, 300, 300);

  // Dibujar la grilla del canvas de juego
  gameContext.strokeStyle = "#ccc";
  for (let i = 0; i <= gridSize; i++) {
    gameContext.beginPath();
    gameContext.moveTo(i * cellSizeGame, 0);
    gameContext.lineTo(i * cellSizeGame, 500);
    gameContext.stroke();

    gameContext.beginPath();
    gameContext.moveTo(0, i * cellSizeGame);
    gameContext.lineTo(500, i * cellSizeGame);
    gameContext.stroke();
  }

  // Dibujar la grilla del canvas del modelo
  levelContext.strokeStyle = "#ccc";
  for (let i = 0; i <= gridSize; i++) {
    levelContext.beginPath();
    levelContext.moveTo(i * cellSizeLevel, 0);
    levelContext.lineTo(i * cellSizeLevel, 300);
    levelContext.stroke();

    levelContext.beginPath();
    levelContext.moveTo(0, i * cellSizeLevel);
    levelContext.lineTo(300, i * cellSizeLevel);
    levelContext.stroke();
  }

  // Dibujar el trazo del jugador
  gameContext.fillStyle = "#8ab6d6";
  path.forEach(pos => {
    gameContext.fillRect(pos.x * cellSizeGame, pos.y * cellSizeGame, cellSizeGame, cellSizeGame);
  });

  // Dibujar el modelo
  for (let i = 0; i < currLevel.length; i++) {
    for (let j = 0; j < currLevel[i].length; j++) {
      if (currLevel[i][j] === 1) {
        levelContext.fillStyle = "#ccc";
        levelContext.fillRect(j * cellSizeLevel, i * cellSizeLevel, cellSizeLevel, cellSizeLevel);
      }
      if (currLevel[i][j] === 2) {
        levelContext.fillStyle = "#e74c3c";
        levelContext.fillRect(j * cellSizeLevel, i * cellSizeLevel, cellSizeLevel, cellSizeLevel);
        startingPoint = [j, i];
      }
    }
  }
}


//función del día 1
function mostrarPuzzle() {
  document.getElementById("narrativa").style.display = "none";
  document.getElementById("juego").style.display = "block";
  draw();
}




function getMove(key) {
  const moves = {
    "ArrowUp": { dx: 0, dy: -1 },
    "ArrowDown": { dx: 0, dy: 1 },
    "ArrowLeft": { dx: -1, dy: 0 },
    "ArrowRight": { dx: 1, dy: 0 },
    "w": { dx: 0, dy: -1 },
    "s": { dx: 0, dy: 1 },
    "a": { dx: -1, dy: 0 },
    "d": { dx: 1, dy: 0 },
  };
  return moves[key] || null;
}

document.addEventListener("keydown", (e) => {
  // Prevenir scroll con teclas de flecha
  const keysQueDesactivanScroll = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
  if (keysQueDesactivanScroll.includes(e.key)) {
    e.preventDefault();
  }


  const move = getMove(e.key);
  if (move) {
    x = Math.max(0, Math.min(gridSize - 1, x + move.dx));
    y = Math.max(0, Math.min(gridSize - 1, y + move.dy));
    path.push({ x, y });
    draw();
  }

  if (e.key === "Enter") {
  document.getElementById("juego").style.display = "none";
  document.getElementById("finDia").style.display = "flex";
}
});



function startGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("mesa").style.display = "block";
  level = 1;
  currLevel = levels[level];
  x = 7;
  y = 4;
  path = [{ x, y }];
  document.getElementById("infoDia").innerText = "Día 1";
}

function mostrarReina() {
  document.getElementById("mesa").style.display = "none";
  document.getElementById("narrativa").style.display = "block";
}


function mostrarReina() {
  document.getElementById("mesa").style.display = "none";
  document.getElementById("narrativa").style.display = "block";
}


function iniciarPuzzle() {
  document.getElementById("narrativa").style.display = "none";
  document.getElementById("mesa").style.display = "block";
}


function reiniciarNivel() {
  x = 7;
  y = 4;
  path = [{ x, y }];
  draw();
}

function siguienteDia() {
  document.getElementById("finDia").style.display = "none";
  level++;
  if (!levels[level]) {
    alert("¡Has terminado el juego!");
    location.reload();
    return;
  }
  document.getElementById("infoDia").innerText = `Día ${level}`;
  currLevel = levels[level];
  reiniciarNivel();
  document.getElementById("juego").style.display = "block";
}


//menú desplegable
function toggleMenu() {
  const menu = document.getElementById("menuOpciones");
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function volverAlMenu() {
  document.getElementById("juego").style.display = "none";
document.getElementById("finDia").style.display = "none";
document.getElementById("mesa").style.display = "none";
document.getElementById("narrativa").style.display = "none";
document.getElementById("menu").style.display = "block";

}



