const circleElement = document.querySelector(".circle");
const timeElement = document.querySelector(".time");
const timeModeElement = document.querySelector(".time-mode");
const turnElement = document.querySelector(".turns");
const controlButton = document.querySelector(".timer-control");
const resetButton = document.querySelector(".reset-button");
const titleElement = document.querySelector(".title");
const clickSound = document.querySelector("#click");
const notificationSound = document.querySelector("#notification");
const plusElement = document.querySelector("#plus");
const minusElement = document.querySelector("#minus");
const btnPomodoro = document.querySelector(".btn-pomodoro");
const btnCurto = document.querySelector(".btn-curto");
const btnLongo = document.querySelector(".btn-longo");
const aboutElement = document.querySelector(".about");
const aboutModal = document.querySelector(".aboutModal");

var span = document.getElementsByClassName("close")[0];

// Fecha janela "sobre" ao clicar no "X"
span.onclick = function () {
    aboutModal.style.display = "none";
}

// Fecha a janela "sobre" ao clicar em qualquer lugar fora da janela
window.onclick = function (event) {
    if (event.target == aboutModal) {
        aboutModal.style.display = "none";
    }
}

clickSound.volume = 0.3;
notificationSound.volume = 0.3;


let isRunning,
    workTime,
    totalTurns,
    currentTurn,
    totalTime,
    timeRemaining,
    timer;
setValues();

function setValues() {
    isRunning = false;
    workTime = 1 * 1500;
    totalTurns = 1;
    currentTurn = 1;
    totalTime = workTime;
    timeRemaining = totalTime;
    timer = null;
    timeModeElement.innerText = "Hora de trabalhar!"
    timeModeElement.style.display = "inline";
}

controlButton.addEventListener("click", toggleStartPause);
resetButton.addEventListener("click", alertReset);
plusElement.addEventListener("click", addTurn);
minusElement.addEventListener("click", removeTurn);
aboutElement.addEventListener("click", aboutWindow);

function aboutWindow() {
    aboutModal.style.display = "block";
}

btnPomodoro.addEventListener(
    "click",
    function () {
        clickSound.play();
        setTimer(1500);
        timeModeElement.innerText = "Hora de trabalhar!"
    },
    false
);

btnCurto.addEventListener(
    "click",
    function () {
        clickSound.play();
        setTimer(300);
        timeModeElement.innerText = "Descanso curto"
    },
    false
);

btnLongo.addEventListener(
    "click",
    function () {
        clickSound.play();
        setTimer(600);
        timeModeElement.innerText = "Descanso longo"
    },
    false
);



function setTimer(num) {
    workTime = num;
    totalTime = workTime;
    timeRemaining = totalTime;
    drawTime();
}

function TurnsOptions() {
    if (isRunning) {
        plusElement.style.display = "none";
        minusElement.style.display = "none";
        btnPomodoro.style.display = "none";
        btnCurto.style.display = "none";
        btnLongo.style.display = "none";

    } else {
        plusElement.style.display = "inline";
        minusElement.style.display = "inline";
        btnPomodoro.style.display = "inline";
        btnCurto.style.display = "inline";
        btnLongo.style.display = "inline";
    }
}

function addTurn() {
    totalTurns += 1;
    drawTurn();
}

function removeTurn() {
    totalTurns > 1 ? (totalTurns -= 1) : (totalTurns = 1);
    drawTurn();
}

function alertReset() {
    clickSound.play();
    if (confirm("Deseja mesmo reiniciar?")) {
        reset();
    }

}

function toggleStartPause() {
    timeModeElement.style.display = "none";
    clickSound.play();
    isRunning ? pause() : start();

}

function start() {
    isRunning = true;
    TurnsOptions();
    controlButton.innerHTML =
        '<img src="assets/img/16px/pause.png"></img>' + " Pausar";
    timer = setInterval(updateTimer, 1000);
}

function pause() {
    isRunning = false;
    controlButton.innerHTML =
        '<img src="assets/img/16px/play-button.png">' + " Iniciar";
    clearInterval(timer);
}

function updateTimer() {
    if (timeRemaining > 0) {
        timeRemaining--;
    } else {
        finishTurn();
    }
    drawTime();
}

function finishTurn() {
    pause();
    notificationSound.play();
    nextTurn();
    drawTurn();
}

function nextTurn() {

    currentTurn++;
    if (currentTurn <= totalTurns) {
        if (!currentTurn < totalTime) {
            totalTime = workTime;
            timeRemaining = totalTime;
        }
    }

    else {
        reset();
    }
}


function reset() {
    pause();
    setValues();
    drawTime();
    drawTurn();
    TurnsOptions();
}

function drawTime() {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, "0");
    const seconds = Math.floor(timeRemaining % 60).toString().padStart(2, "0");

    timeElement.innerText = `${minutes}:${seconds}`;

    // Muda o título da página, incluindo o tempo no title.
    if (isRunning) {
        titleElement.textContent = "Web Pomodoro - " + timeElement.innerHTML;
    } else {
        if (totalTurns > 1) {
            titleElement.textContent = "Web Pomodoro - " + currentTurn + "/" + totalTurns;
        } else {
            titleElement.textContent = "Web Pomodoro";
        }
    }

    setCirclePercent((timeRemaining / totalTime) * 100);
}

function drawTurn() {
    turnElement.innerText = `${currentTurn} / ${totalTurns}`;
}

function setCirclePercent(percent) {
    const circlePerimeter = 597; // Tamanho do círculo exato
    const dashoffset = circlePerimeter * (percent / 100);
    circleElement.style.setProperty("--dash-offset", circlePerimeter - dashoffset);
}

reset();
