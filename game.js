let level = 1;
let currLevel = levels[level];
let startingPoint = [7, 13];
let x = 7, y = 13;
let path = [{ x, y }];
let errores = 0;
let progreso = 0; // porcentaje entre 0 y 100
let cuadrosCorrectosVisitados = 0;
let totalCuadrosCorrectos = 0;

let timerInterval = null;
let timerStarted = false;
let timerElapsed = 0;
const timerDuration = 60; // 60 segundos
const pieCanvas = document.getElementById("pieTimer");
const pieCtx = pieCanvas.getContext("2d");


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

function drawPieTimer() {
  const percent = timerElapsed / timerDuration;
  const angle = percent * 2 * Math.PI;

  // Limpiar canvas
  pieCtx.clearRect(0, 0, pieCanvas.width, pieCanvas.height);

  // Fondo gris
  pieCtx.fillStyle = "#ddd";
  pieCtx.beginPath();
  pieCtx.moveTo(40, 40); // centro
  pieCtx.arc(40, 40, 35, 0, 2 * Math.PI);
  pieCtx.fill();

  // Pie progresivo
  pieCtx.fillStyle = "#3498db"; // color del tiempo
  pieCtx.beginPath();
  pieCtx.moveTo(40, 40); // centro
  pieCtx.arc(40, 40, 35, -0.5 * Math.PI, angle - 0.5 * Math.PI);
  pieCtx.lineTo(40, 40);
  pieCtx.fill();
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
  const keysQueDesactivanScroll = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
  if (keysQueDesactivanScroll.includes(e.key)) {
    e.preventDefault();
  }

  const move = getMove(e.key);
  if (move) {

    if (!timerStarted) {
      timerStarted = true;
      timerElapsed = 0;
      drawPieTimer();
      timerInterval = setInterval(() => {
        timerElapsed++;
        if (timerElapsed >= timerDuration) {
          clearInterval(timerInterval);
          timerElapsed = timerDuration;
          // Aquí puedes hacer algo si se acaba el tiempo, como mostrar un mensaje
        }
        drawPieTimer();
      }, 1000);
    }

    const newX = Math.max(0, Math.min(gridSize - 1, x + move.dx));
    const newY = Math.max(0, Math.min(gridSize - 1, y + move.dy));
    const esPuntoInicio = newX === startingPoint[0] && newY === startingPoint[1];
    const yaVisitado = path.some(p => p.x === newX && p.y === newY);

    if (!yaVisitado || esPuntoInicio) {
      x = newX;
      y = newY;
      path.push({ x, y });

      if (!yaVisitado) {
        validarMovimiento(x, y);
      }

      draw();

      if (esPuntoInicio && path.length > 1) {
        mostrarResultadoFinal();
      }
    }
  }

  if (e.key === "Enter") {
    level++;
    if (levels[level]) {
      currLevel = levels[level];
      contarCuadrosDelNivel();
      reiniciarNivel();
      draw();
    } else {
      console.log("No hay más niveles disponibles.");
    }
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


function mostrarReina() {
  document.getElementById("mesa").style.display = "none";
  document.getElementById("narrativa").style.display = "block";
}


function iniciarPuzzle() {
  document.getElementById("narrativa").style.display = "none";
  document.getElementById("mesa").style.display = "block";
}

// Para chequear el trazo que dibujas
function validarMovimiento(x, y) {
  const correcto = currLevel[y]?.[x];
  const esNuevo = !path.slice(0, -1).some(p => p.x === x && p.y === y); 

  if (esNuevo) {
    if (correcto === 1 || correcto === 2) {
      cuadrosCorrectosVisitados++;
      progreso += (100 / totalCuadrosCorrectos); 
    } else {
      errores++;
      progreso -= 15;

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
  let progresoCalculado = ((cuadrosCorrectosVisitados - errores) / totalCuadrosCorrectos) * 100;
  progresoCalculado = Math.max(0, Math.min(100, progresoCalculado));
  progreso = progresoCalculado;

  const barra = document.getElementById("barraAprobacion");
  barra.style.width = progreso + "%";

  if (progreso >= 70) {
    barra.style.backgroundColor = "#6fbf73"; // verde
  } else if (progreso >= 40) {
    barra.style.backgroundColor = "#f1c40f"; // amarillo
  } else {
    barra.style.backgroundColor = "#e74c3c"; // rojo
  }
}



function reiniciarNivel() {
  x = 7;
  y = 13;
  path = [{ x, y }];
  cuadrosCorrectosVisitados = 0;
  errores = 0;
  progreso = 0;

  if (timerInterval) {
  clearInterval(timerInterval);
  }
  timerStarted = false;
  timerElapsed = 0;
  drawPieTimer(); // para reiniciar visualmente


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

function mostrarResultadoFinal() {
  // Redondear progreso
  const progresoFinal = Math.round(progreso);

  // Mostrar porcentaje y mensaje
  const texto = document.getElementById("textoResultado");
  const imagen = document.getElementById("imagenReinaFinal");

  let mensaje = "";
  let imagenSrc = "";

  if (progresoFinal >= 90) {
    mensaje = `¡Excelente trabajo! Tu aprobación fue de ${progresoFinal}%.`;
    imagenSrc = "img/r-indiferente-2.png";
  } else if (progresoFinal >= 70) {
    mensaje = `Bien hecho. Tu aprobación fue de ${progresoFinal}%.`;
    imagenSrc = "img/r-sorprendida-2.png";
  } else if (progresoFinal >= 40) {
    mensaje = `Podrías mejorar. Tu aprobación fue de ${progresoFinal}%.`;
    imagenSrc = "img/r-molesta-2.png";
  } else {
    mensaje = `Estoy decepcionada... Tu aprobación fue de ${progresoFinal}%.`;
    imagenSrc = "img/r-decepcionada-2.png";
  }

  texto.textContent = mensaje;
  imagen.src = imagenSrc;

  // Mostrar cuadro
  document.getElementById("resultadoFinal").style.display = "block";
}


function siguienteDia() {
  document.getElementById("finDia").style.display = "none";
  level++;
  document.getElementById("resultadoFinal").style.display = "none";


  if (levels[level]) {
    currLevel = levels[level];
    reiniciarNivel();
    contarCuadrosDelNivel();
    document.getElementById("infoDia").innerText = `Día ${level}`;
    document.getElementById("juego").style.display = "block";
    draw();
  } else {
    console.log("No hay más niveles disponibles.");
  }
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



