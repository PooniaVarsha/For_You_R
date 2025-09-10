const lyricsData = [
    { time: 1, text: "Eyy..." },
    { time: 10, text: "Saari raat main laaiyan calls" },
    { time: 13, text: "Tainu ki andaaza mere dil 'te ki biti"},
    { time: 18, text: "mainu chain naa aave"},
    { time: 20, text: "Awkhin radhake ninder" },
    { time: 22, text: "mainu saun naa deve bechaini" },
    { time: 24, text: "Bas main hi nahi aan kalla" },
    { time: 27, text: "ajj tere chann nal taare hain" },
    { time: 29, text: "Kaisa hoiya ae mahaul?"},
    { time: 32, text: "Sonatae da shor mere kan tak gunje," },
    { time: 36, text: "mainu khan tik jaave" },
    { time: 39,  text: "Saari raat main laaiyan calls" },
    { time: 42, text: "Tainu ki andaaza mere dil 'te ki biti, mainu chain naa aave" }
];

const audio = document.getElementById('audio');
const startButton = document.getElementById('startButton');
const lyricsDiv = document.getElementById('lyricsContainer');
const balloonContainer = document.getElementById('balloonsContainer');

let currentLyricIndex = 0;
let currentGroupCount = 0;
let isFadingOut = false;
let balloonIntervalId = null;
let currentFloatDuration = 5;

startButton.addEventListener('click', () => {
  currentLyricIndex = 0;
  lyricsDiv.innerHTML = "";
  currentGroupCount = 0;
  isFadingOut = false;

  audio.currentTime = 0;
  audio.play().catch(err => console.error(err));

  if (balloonIntervalId) clearInterval(balloonIntervalId);
  balloonIntervalId = setInterval(createBalloon, 1000);
});

audio.addEventListener('timeupdate', () => {
  while (currentLyricIndex < lyricsData.length && audio.currentTime >= lyricsData[currentLyricIndex].time) {
    processLyric(lyricsData[currentLyricIndex]);
  }
});

function processLyric(lyricObj) {
  // If current group is full, remove oldest group lines
  if (currentGroupCount >= 3) {
    const oldLines = Array.from(lyricsDiv.children).slice(0, currentGroupCount);
    oldLines.forEach(line => line.remove());
    currentGroupCount = 0;
  }

  appendLyric(lyricObj);
  currentGroupCount++;
  currentLyricIndex++;

  // If this is the **last lyric**, remove it after 5 seconds
  if (currentLyricIndex === lyricsData.length) {
    setTimeout(() => {
      lyricsDiv.innerHTML = "";
    }, 5000); // 5000 ms = 5 sec
  }
}




function appendLyric(lyricObj) {
  const newEl = document.createElement('div');
  newEl.className = 'lyric-line';
  newEl.innerHTML = lyricObj.text;
  lyricsDiv.appendChild(newEl);
}

function createBalloon() {
  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  balloon.style.left = Math.random() * 90 + '%';
  balloon.style.animationDuration = currentFloatDuration + 's';

  balloonContainer.appendChild(balloon);

  const popTime = Math.random() * 2000 + 1000;
  const autoPopTimer = setTimeout(() => popBalloon(balloon), popTime);

  balloon.addEventListener('click', () => {
    clearTimeout(autoPopTimer);
    popBalloon(balloon);
  });
}

function popBalloon(balloon) {
  if (!balloon.parentNode) return;
  const rect = balloon.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  balloon.remove();

  triggerConfetti(x, y);
}

function triggerConfetti(x, y) {
  for (let i = 0; i < 10; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = `hsl(${Math.random()*360},80%,60%)`;
    confetti.style.left = (x + Math.random()*50 - 25) + 'px';
    confetti.style.top = (y + Math.random()*50 - 25) + 'px';
    balloonContainer.appendChild(confetti);
    confetti.addEventListener('animationend', () => confetti.remove());
  }
}
