let level = 1;
let currLevel = levels[level];
let startingPoint = [7, 13];
let x = 7, y = 13;
let path = [{ x, y }];
let errores = 0;
let progreso = 0; // porcentaje entre 0 y 100

//contar cuadrados del recorrido por nivel
let totalCuadrosCorrectos = 0;

function contarCuadrosDelNivel() {
  totalCuadrosCorrectos = 0;
  for (let i = 0; i < currLevel.length; i++) {
    for (let j = 0; j < currLevel[i].length; j++) {
      if (currLevel[i][j] === 1 || currLevel[i][j] === 2) {
        totalCuadrosCorrectos++;
      }
    }
  }
}




//Cuando el nombre habla de game se refiere a la grilla que uno dibuja, cuando habla de level es del modelo estático a seguir

const gridSize = 15;
const cellSizeGame = 500 / gridSize; 
const cellSizeLevel = 300 / gridSize;
let steps = 0;

const gameCanvas = document.getElementById("game");
const levelCanvas = document.getElementById("level");
const gameContext = gameCanvas.getContext("2d");
const levelContext = levelCanvas.getContext("2d");

function draw() {
  // Limpiar los canvas
  gameContext.clearRect(0, 0, 500, 500);
  levelContext.clearRect(0, 0, 300, 300);

  // Dibujar la grilla del canvas de #game
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

  // Dibujar la grilla del canvas del #level
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

//función para las teclas
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
  // Código de don chatcito para prevenir que se haga scroll con teclas de flecha
  const keysQueDesactivanScroll = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
  if (keysQueDesactivanScroll.includes(e.key)) {
    e.preventDefault();
  }

  const move = getMove(e.key);
  if (move) {
    const newX = Math.max(0, Math.min(gridSize - 1, x + move.dx));
const newY = Math.max(0, Math.min(gridSize - 1, y + move.dy));
const yaVisitado = path.some(p => p.x === newX && p.y === newY);

if (!yaVisitado) {
  x = newX;
  y = newY;
  path.push({ x, y });
  validarMovimiento(x, y);
  draw();
}
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
  contarCuadrosDelNivel();
  x = 7;
  y = 13;
  path = [{ x, y }];
  document.getElementById("infoDia").innerText = "Día 1";
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
  y = 13;
  path = [{ x, y }];
  errores = 0;
  progreso = 0;
  draw();

//reiniciar imagen de la reina
  const imagen = document.getElementById("imagenReina");
  if (imagen) {
    imagen.src = "img/r-indiferente.png";
  }
  actualizarBarra();

  const burbuja = document.getElementById("burbujaDecepcion");
if (burbuja) {
  burbuja.style.display = "none";
}

  const paloma = document.getElementById("imagenPaloma");
  if (paloma) {
  paloma.src = "img/paloma.png"; // o el archivo original que usas
  }


}


// Para chequear el trazo que dibujas
function validarMovimiento(x, y) {
  const correcto = currLevel[y]?.[x];
  const esNuevo = !path.slice(0, -1).some(p => p.x === x && p.y === y); // revisamos el path excepto el actual

  if (esNuevo) {
    if (correcto === 1 || correcto === 2) {
      progreso += (100 / totalCuadrosCorrectos); // avanzamos proporcional
    } else {
      errores++;
      progreso -= 8;

      const imagen = document.getElementById("imagenReina");
      if (imagen) {
        if (errores >= 1 && errores <= 4) {
          imagen.src = "img/r-sorprendida.png";
        } else if (errores >= 5 && errores <= 8) {
          imagen.src = "img/r-molesta.png";
        } else if (errores >= 8) {
        imagen.src = "img/r-decepcionada.png"; 

        const burbuja = document.getElementById("burbujaDecepcion");
        if (burbuja) {
        burbuja.style.display = "block";
        }
        const paloma = document.getElementById("imagenPaloma");
        if (paloma) {
        paloma.src = "img/paloma-2.png";
        }
        }
      }
    }
    actualizarBarra();
  }
}


//Función para barra progreso
function actualizarBarra() {
  progreso = Math.max(0, Math.min(100, progreso));

  // Corrige errores de punto flotante al final
  if (path.filter(p => currLevel[p.y]?.[p.x] === 1 || currLevel[p.y]?.[p.x] === 2).length === totalCuadrosCorrectos) {
    progreso = 100;
  }

  const barra = document.getElementById("barraAprobacion");
  barra.style.width = progreso + "%";

  if (progreso >= 70) {
    barra.style.backgroundColor = "#6fbf73";
  } else if (progreso >= 40) {
    barra.style.backgroundColor = "#f1c40f";
  } else {
    barra.style.backgroundColor = "#e74c3c";
  }
}




function siguienteDia() {
  document.getElementById("finDia").style.display = "none";
  level++;
 
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



