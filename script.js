const STORAGE_KEYS = {
  profile: "loveGiftProfile",
  soundtrack: "loveGiftSoundtrack",
  polaroids: "loveGiftPolaroids",
  loveClicks: "loveGiftLoveClicks"
};

const defaultProfile = {
  fromName: "Yasmim",
  toName: "Gabriel",
  sinceDate: "2024-05-30"
};

const romanticTemplates = [
  "Eu escolheria você de novo e de novo, todos os dias.",
  "O nosso amor é o meu lugar favorito.",
  "Por você eu passaria todos os levels do mundo!",
  "O lado bom da vida é o lado que tem você comigo!",
  "Que sorte a do meu sorriso, ter você como motivo!",
  "Você é o meu par favorito em todas as combinações da vida!",
  "No jogo do amor, já ganhei só por ter você!",
  "O meu som preferido sempre será a sua voz!"
];

const capsuleTemplates = [
  "Vale chameguinhos ilimitados",
  "Vale cafuné",
  "Vale lanche favorito",
  "Vale doce favorito",
  "Vale foto do casal",
  "Vale presente",
  "Vale passeio",
  "Vale jantar fora",
  "Vale um desejo",
  "Vale um jantar preparado por mim",
  "Vale um dia inteiro sem reclamar de nada",
  "Vale uma noite de jogos juntos",
  "Vale night com os amigos",
  "Vale uma ida ao cinema",
  "Vale o que você quiser",
  "Vale um \"sim\" como resposta",
  "Vale café da manhã na cama",
  "Vale muitos beijinhos"
];

const SLOT_SYMBOLS = ["tulip", "bow", "heart"];

const heroTitleEl = document.getElementById("heroTitle");
const heroSubtitleEl = document.getElementById("heroSubtitle");
const coupleHeadlineEl = document.getElementById("coupleHeadline");

const nameForm = document.getElementById("nameForm");
const fromNameInput = document.getElementById("fromName");
const toNameInput = document.getElementById("toName");
const relationshipDateInput = document.getElementById("relationshipDate");
const nameFeedback = document.getElementById("nameFeedback");

const vinylEl = document.getElementById("vinyl");
const tonearmEl = document.getElementById("tonearm");
const mediaFrame = document.getElementById("mediaFrame");
const embedShell = document.getElementById("embedShell");
const playerFeedback = document.getElementById("playerFeedback");

const FIXED_SPOTIFY_PLAYLIST = "https://open.spotify.com/playlist/3Crc3YKTFBYWawEub8pKNv?si=OJtXKHtkQZ6KiQBvm1skCw";

const bgMusicUrlInput = document.getElementById("bgMusicUrl");
const bgMusicFileInput = document.getElementById("bgMusicFile");
const applyBgMusicBtn = document.getElementById("applyBgMusicBtn");
const startBgMusicBtn = document.getElementById("startBgMusicBtn");
const stopBgMusicBtn = document.getElementById("stopBgMusicBtn");
const bgVolumeInput = document.getElementById("bgVolume");
const bgMusicFeedback = document.getElementById("bgMusicFeedback");

const mailText = document.getElementById("mailText");
const mailLetter = document.getElementById("mailLetter");
const newLetterBtn = document.getElementById("newLetterBtn");
const toggleLetterBtn = document.getElementById("toggleLetterBtn");
const mailboxFlag = document.getElementById("mailboxFlag");

const polaroidImages = [
  document.getElementById("polaroidImg1"),
  document.getElementById("polaroidImg2"),
  document.getElementById("polaroidImg3")
];

const timeDaysEl = document.getElementById("timeDays");
const timeHoursEl = document.getElementById("timeHours");
const timeMinutesEl = document.getElementById("timeMinutes");

const loveRainBtn = document.getElementById("loveRainBtn");
const loveRainLayer = document.getElementById("loveRainLayer");
const loveRainCountEl = document.getElementById("loveRainCount");

const machineKnob = document.getElementById("machineKnob");
const spinMachineBtn = document.getElementById("spinMachineBtn");
const capsule = document.getElementById("capsule");
const capsuleMessage = document.getElementById("capsuleMessage");
const reelEls = Array.from(document.querySelectorAll(".reel"));

const boardEl = document.getElementById("board");
const gameStatusEl = document.getElementById("gameStatus");
const resetGameBtn = document.getElementById("resetGameBtn");

let currentProfile = { ...defaultProfile };
let isVinylPlaying = false;
let board = Array(9).fill("");
let currentPlayer = "X";
let gameFinished = false;
let currentBackgroundObjectUrl = "";
let isLetterOpen = false;
let loveClicks = Number(localStorage.getItem(STORAGE_KEYS.loveClicks) || 0);

// Troque os 3 caminhos abaixo pelas suas fotos da pasta images.
// Exemplo: "images/polaroid-1.jpg"
const defaultPolaroids = [
  "images/02.png",
  "images/04.png",
  "images/16.png"
];

const backgroundAudio = new Audio();
backgroundAudio.loop = true;
backgroundAudio.preload = "auto";

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function sanitizeText(text) {
  return String(text || "").replace(/[<>]/g, "").trim();
}

function formatDateBR(isoDate) {
  if (!isoDate) {
    return "";
  }
  const parsed = new Date(`${isoDate}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("pt-BR");
}

function getStoredObject(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setFeedback(element, text, type = "default") {
  if (!element) {
    return;
  }
  element.textContent = text;
  element.style.color = type === "error" ? "#ff9b9b" : type === "success" ? "#8de2ac" : "#e7d8d6";
}

function readStoredPolaroids() {
  return [...defaultPolaroids];
}

function savePolaroids() {}

function renderPolaroids() {
  const images = readStoredPolaroids();
  polaroidImages.forEach((img, index) => {
    if (img) {
      img.src = images[index] || defaultPolaroids[index];
    }
  });
}

function updateLoveCounter() {
  if (!timeDaysEl || !timeHoursEl || !timeMinutesEl) {
    return;
  }

  const sinceValue = currentProfile.sinceDate || defaultProfile.sinceDate;
  const startDate = new Date(`${sinceValue}T00:00:00`);
  if (Number.isNaN(startDate.getTime())) {
    timeDaysEl.textContent = "0";
    timeHoursEl.textContent = "0";
    timeMinutesEl.textContent = "0";
    return;
  }

  const diffMs = Math.max(0, Date.now() - startDate.getTime());
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  timeDaysEl.textContent = String(days);
  timeHoursEl.textContent = String(hours).padStart(2, "0");
  timeMinutesEl.textContent = String(minutes).padStart(2, "0");
}

function updateLoveClickCounter() {
  if (loveRainCountEl) {
    loveRainCountEl.textContent = `Cliques de amor: ${loveClicks}`;
  }
}

function createRainHeart() {
  if (!loveRainLayer) {
    return;
  }
  const heart = document.createElement("span");
  heart.className = "rain-heart";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.setProperty("--drift", `${(Math.random() * 120 - 60).toFixed(0)}px`);
  heart.style.setProperty("--duration", `${(Math.random() * 1.6 + 2.6).toFixed(2)}s`);
  heart.style.setProperty("--delay", `${(Math.random() * 0.35).toFixed(2)}s`);
  heart.style.width = `${Math.floor(Math.random() * 10 + 12)}px`;
  heart.style.height = heart.style.width;

  loveRainLayer.appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 4600);
}

function triggerLoveRain() {
  loveClicks += 1;
  localStorage.setItem(STORAGE_KEYS.loveClicks, String(loveClicks));
  updateLoveClickCounter();

  for (let i = 0; i < 34; i += 1) {
    setTimeout(createRainHeart, i * 28);
  }
}

function personalize(template) {
  return template
    .replaceAll("{fromName}", currentProfile.fromName)
    .replaceAll("{toName}", currentProfile.toName);
}

function applyProfileOnHero() {
  const since = formatDateBR(currentProfile.sinceDate);
  if (heroTitleEl) {
    heroTitleEl.textContent = `${currentProfile.fromName} + ${currentProfile.toName}`;
  }
  if (heroSubtitleEl) {
    heroSubtitleEl.textContent = "Um espacinho amoroso para guardar musica, bilhetes e momentos especiais.";
  }
  if (coupleHeadlineEl) {
    coupleHeadlineEl.textContent = since ? `Juntos desde ${since}.` : "Nosso amor em cada detalhe.";
  }
  updateLoveCounter();
}

function restoreProfile() {
  const saved = getStoredObject(STORAGE_KEYS.profile, null);
  if (saved && saved.fromName && saved.toName) {
    currentProfile = {
      fromName: sanitizeText(saved.fromName),
      toName: sanitizeText(saved.toName),
      sinceDate: saved.sinceDate || defaultProfile.sinceDate
    };
  }
  if (fromNameInput) {
    fromNameInput.value = currentProfile.fromName;
  }
  if (toNameInput) {
    toNameInput.value = currentProfile.toName;
  }
  if (relationshipDateInput) {
    relationshipDateInput.value = currentProfile.sinceDate;
  }
  applyProfileOnHero();
}

function saveProfile(event) {
  event.preventDefault();
  if (!fromNameInput || !toNameInput || !relationshipDateInput) {
    return;
  }
  const fromName = sanitizeText(fromNameInput.value);
  const toName = sanitizeText(toNameInput.value);
  const sinceDate = relationshipDateInput.value;

  if (!fromName || !toName) {
    setFeedback(nameFeedback, "Preencha os dois nomes.", "error");
    return;
  }

  currentProfile = { fromName, toName, sinceDate };
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(currentProfile));
  applyProfileOnHero();
  setFeedback(nameFeedback, "Assinatura salva com carinho.", "success");
  revealMailLetter();
}

function extractSpotifyEmbed(url) {
  const match = url.match(/open\.spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/);
  if (!match) {
    return null;
  }
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`;
}

function loadSpotifyPlaylistPlayer() {
  if (!mediaFrame || !embedShell) {
    return;
  }

  const embedUrl = extractSpotifyEmbed(FIXED_SPOTIFY_PLAYLIST);
  if (!embedUrl) {
    setFeedback(playerFeedback, "Nao foi possivel carregar sua playlist fixa.", "error");
    return;
  }

  mediaFrame.src = embedUrl;
  embedShell.hidden = false;
  setFeedback(playerFeedback, "Player da playlist carregado. Use os controles do Spotify.", "success");
}

function extractYouTubeEmbed(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.searchParams.get("list")) {
      return `https://www.youtube.com/embed/videoseries?list=${parsed.searchParams.get("list")}`;
    }
    if (parsed.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }
    return null;
  } catch {
    return null;
  }
}

function toggleVinylAnimation() {
  isVinylPlaying = !isVinylPlaying;
  vinylEl?.classList.toggle("spinning", isVinylPlaying);
  tonearmEl?.classList.toggle("active", isVinylPlaying);
}

function cleanupBackgroundObjectUrl() {
  if (currentBackgroundObjectUrl) {
    URL.revokeObjectURL(currentBackgroundObjectUrl);
    currentBackgroundObjectUrl = "";
  }
}

function setBackgroundVolume() {
  const volume = Number(bgVolumeInput.value);
  backgroundAudio.volume = Number.isFinite(volume) ? volume : 0.35;
  const config = getStoredObject(STORAGE_KEYS.soundtrack, {});
  config.volume = backgroundAudio.volume;
  localStorage.setItem(STORAGE_KEYS.soundtrack, JSON.stringify(config));
}

function applyBackgroundMusic() {
  const url = sanitizeText(bgMusicUrlInput.value);
  const file = bgMusicFileInput.files?.[0];

  if (!url && !file) {
    setFeedback(bgMusicFeedback, "Adicione um link de audio ou um arquivo.", "error");
    return;
  }

  cleanupBackgroundObjectUrl();
  let source = url;
  if (file) {
    source = URL.createObjectURL(file);
    currentBackgroundObjectUrl = source;
  }

  backgroundAudio.src = source;
  localStorage.setItem(STORAGE_KEYS.soundtrack, JSON.stringify({
    url: file ? "" : source,
    volume: Number(bgVolumeInput.value)
  }));

  backgroundAudio.play().then(() => {
    setFeedback(bgMusicFeedback, "Trilha tocando em segundo plano.", "success");
  }).catch(() => {
    setFeedback(bgMusicFeedback, "Autoplay bloqueado. Clique em Iniciar.", "error");
  });
}

function startBackgroundMusic() {
  if (!backgroundAudio.src) {
    setFeedback(bgMusicFeedback, "Aplique uma trilha primeiro.", "error");
    return;
  }
  backgroundAudio.play().then(() => {
    setFeedback(bgMusicFeedback, "Trilha iniciada.", "success");
  }).catch(() => {
    setFeedback(bgMusicFeedback, "Nao foi possivel tocar agora.", "error");
  });
}

function stopBackgroundMusic() {
  backgroundAudio.pause();
  backgroundAudio.currentTime = 0;
  setFeedback(bgMusicFeedback, "Trilha parada.");
}

function restoreSoundtrack() {
  if (!bgVolumeInput || !bgMusicUrlInput) {
    return;
  }
  const saved = getStoredObject(STORAGE_KEYS.soundtrack, {});
  const volume = Number.isFinite(saved.volume) ? saved.volume : 0.35;
  backgroundAudio.volume = volume;
  bgVolumeInput.value = String(volume);

  if (saved.url) {
    bgMusicUrlInput.value = saved.url;
    backgroundAudio.src = saved.url;
  }
}

function revealMailLetter() {
  mailText.textContent = personalize(randomItem(romanticTemplates));
  isLetterOpen = true;
  toggleLetterBtn.textContent = "Fechar bilhete";
  mailboxFlag?.classList.add("raised");
  mailLetter.classList.remove("show");
  requestAnimationFrame(() => {
    mailLetter.classList.add("show");
  });
}

function toggleLetter() {
  isLetterOpen = !isLetterOpen;
  mailLetter.classList.toggle("show", isLetterOpen);
  toggleLetterBtn.textContent = isLetterOpen ? "Fechar bilhete" : "Abrir bilhete";
  mailboxFlag?.classList.toggle("raised", isLetterOpen);
}

function spinMachine() {
  machineKnob.classList.remove("spin");
  capsule.classList.remove("drop");
  reelEls.forEach(reel => reel.classList.add("spinning"));
  requestAnimationFrame(() => {
    machineKnob.classList.add("spin");
    capsule.classList.add("drop");
  });

  const spinInterval = setInterval(() => {
    reelEls.forEach(reel => {
      const symbol = randomItem(SLOT_SYMBOLS);
      reel.dataset.symbol = symbol;
      reel.textContent = symbol;
    });
  }, 110);

  setTimeout(() => {
    clearInterval(spinInterval);
    reelEls.forEach(reel => reel.classList.remove("spinning"));
    setFeedback(capsuleMessage, personalize(randomItem(capsuleTemplates)), "success");
  }, 700);
}

function checkWinner(cells) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((value, index) => {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.type = "button";
    if (value === "X") {
      const markX = document.createElement("span");
      markX.className = "mark-x";
      markX.textContent = "✕";
      cell.appendChild(markX);
    } else if (value === "O") {
      const markO = document.createElement("span");
      markO.className = "mark-o";
      markO.textContent = "♥";
      cell.appendChild(markO);
    }
    cell.addEventListener("click", () => playMove(index));
    boardEl.appendChild(cell);
  });
}

function resetGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameFinished = false;
  setFeedback(gameStatusEl, "Sua vez: X");
  renderBoard();
}

function cupidoMove() {
  const emptyIndexes = board.map((cell, index) => (cell ? -1 : index)).filter(index => index !== -1);
  if (!emptyIndexes.length || gameFinished) {
    return;
  }
  const index = randomItem(emptyIndexes);
  board[index] = "O";
  renderBoard();
  const winner = checkWinner(board);
  if (winner) {
    gameFinished = true;
    setFeedback(gameStatusEl, "Cupido venceu dessa vez.", "error");
    return;
  }
  if (!board.includes("")) {
    gameFinished = true;
    setFeedback(gameStatusEl, "Empate fofinho.");
    return;
  }
  currentPlayer = "X";
  setFeedback(gameStatusEl, "Sua vez: X");
}

function playMove(index) {
  if (gameFinished || board[index]) {
    return;
  }
  board[index] = currentPlayer;
  renderBoard();
  const winner = checkWinner(board);
  if (winner) {
    gameFinished = true;
    setFeedback(gameStatusEl, "Voce venceu!", "success");
    return;
  }
  if (!board.includes("")) {
    gameFinished = true;
    setFeedback(gameStatusEl, "Empate fofinho.");
    return;
  }
  currentPlayer = "O";
  setFeedback(gameStatusEl, "Vez do Cupido.");
  setTimeout(cupidoMove, 320);
}

function setupCinematicReveal() {
  const cards = document.querySelectorAll(".cinematic");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  cards.forEach(card => observer.observe(card));
}

nameForm?.addEventListener("submit", saveProfile);
applyBgMusicBtn?.addEventListener("click", applyBackgroundMusic);
startBgMusicBtn?.addEventListener("click", startBackgroundMusic);
stopBgMusicBtn?.addEventListener("click", stopBackgroundMusic);
bgVolumeInput?.addEventListener("input", setBackgroundVolume);
newLetterBtn?.addEventListener("click", revealMailLetter);
toggleLetterBtn?.addEventListener("click", toggleLetter);
spinMachineBtn?.addEventListener("click", spinMachine);
machineKnob?.addEventListener("click", spinMachine);
resetGameBtn?.addEventListener("click", resetGame);
loveRainBtn?.addEventListener("click", triggerLoveRain);

restoreProfile();
restoreSoundtrack();
loadSpotifyPlaylistPlayer();
renderPolaroids();
resetGame();
setupCinematicReveal();
updateLoveCounter();
updateLoveClickCounter();

setInterval(updateLoveCounter, 60000);
