const PROFILE_KEY = "loveGiftProfile";
const TIMELINE_KEY = "loveGiftTimeline";
const GOALS_KEY = "loveGiftGoals";

const timelineForm = document.getElementById("timelineForm");
const timelineDateInput = document.getElementById("timelineDate");
const timelineTitleInput = document.getElementById("timelineTitle");
const timelineTextInput = document.getElementById("timelineText");
const timelineList = document.getElementById("timelineList");

const goalForm = document.getElementById("goalForm");
const goalTitleInput = document.getElementById("goalTitle");
const goalTextInput = document.getElementById("goalText");
const goalsList = document.getElementById("goalsList");

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function getStoredArray(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredArray(key, payload) {
  localStorage.setItem(key, JSON.stringify(payload));
}

function formatDateBR(dateValue) {
  if (!dateValue) {
    return "";
  }
  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR");
}

function ensureInitialTimeline() {
  const existing = getStoredArray(TIMELINE_KEY);

  const profile = (() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const partnerName = sanitizeText(profile?.toName) || "Gabriel";

  const requiredMoments = [
    {
      date: "2024-05-10",
      title: "Primeiro beijo",
      text: `Nosso primeiro beijo.`
    },
    {
      date: "2024-05-25",
      title: "Primeiro date",
      text: "Nosso primeiro date oficial"
    },
    {
      date: "2024-05-30",
      title: "Início do namoro",
      text: "Esse foi o dia em que você me pediu em namoro."
    },
    {
      date: "2024-08-10",
      title: "Nossa viagem para a Pousada das Araras",
      text: "Foi uma viagem incrível, foi ótimo passar um tempo juntos, e com os nossos amigos, em um lugar tão bonito e aconchegante, espero fazer mais viagens desse tipo e aproveitar cada momento ao seu lado."
    }
  ];

  const merged = [...existing];

  requiredMoments.forEach(moment => {
    const alreadyExists = merged.some(item => item.date === moment.date && item.title === moment.title);
    if (!alreadyExists) {
      merged.push(moment);
    }
  });

  saveStoredArray(TIMELINE_KEY, merged);
}

function ensureInitialGoals() {
  const existing = getStoredArray(GOALS_KEY);
  if (existing.length) {
    return;
  }

  const initialGoals = [
    {
      title: "Viagem romântica",
      text: "Planejar uma viagem especial para comemorar nosso amor.",
      done: false
    },
    {
      title: "Noite de filmes",
      text: "Montar uma noite com filmes favoritos, coberta e pipoca.",
      done: false
    },
    {
      title: "Carta anual",
      text: "Escrever uma carta um para o outro todo ano no aniversário de namoro.",
      done: false
    }
  ];

  saveStoredArray(GOALS_KEY, initialGoals);
}

function renderTimeline() {
  const events = getStoredArray(TIMELINE_KEY).sort((a, b) => (a.date < b.date ? 1 : -1));
  timelineList.innerHTML = "";

  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "feedback";
    empty.textContent = "Nenhum momento salvo ainda.";
    timelineList.appendChild(empty);
    return;
  }

  events.forEach((eventItem, index) => {
    const item = document.createElement("article");
    item.className = "timeline-item";

    const title = document.createElement("h3");
    title.textContent = eventItem.title;

    const text = document.createElement("p");
    text.textContent = eventItem.text;

    const meta = document.createElement("div");
    meta.className = "timeline-meta";

    const date = document.createElement("span");
    date.className = "timeline-date";
    date.textContent = formatDateBR(eventItem.date);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "secondary";
    removeBtn.textContent = "Excluir";
    removeBtn.addEventListener("click", () => {
      const sorted = getStoredArray(TIMELINE_KEY).sort((a, b) => (a.date < b.date ? 1 : -1));
      const target = sorted[index];
      const updated = getStoredArray(TIMELINE_KEY).filter(itemToCompare => {
        return !(itemToCompare.date === target.date && itemToCompare.title === target.title && itemToCompare.text === target.text);
      });
      saveStoredArray(TIMELINE_KEY, updated);
      renderTimeline();
    });

    meta.appendChild(date);
    meta.appendChild(removeBtn);

    item.appendChild(title);
    item.appendChild(text);
    item.appendChild(meta);

    timelineList.appendChild(item);
  });
}

function saveTimeline(event) {
  event.preventDefault();

  const date = timelineDateInput.value;
  const title = sanitizeText(timelineTitleInput.value);
  const text = sanitizeText(timelineTextInput.value);

  if (!date || !title || !text) {
    return;
  }

  const entry = { date, title, text };
  saveStoredArray(TIMELINE_KEY, [entry, ...getStoredArray(TIMELINE_KEY)].slice(0, 120));
  timelineForm.reset();
  renderTimeline();
}

function renderGoals() {
  const goals = getStoredArray(GOALS_KEY);
  goalsList.innerHTML = "";

  if (!goals.length) {
    const empty = document.createElement("p");
    empty.className = "feedback";
    empty.textContent = "Adicione metas para o casal.";
    goalsList.appendChild(empty);
    return;
  }

  goals.forEach((goal, index) => {
    const item = document.createElement("article");
    item.className = "goal-item";

    const title = document.createElement("h3");
    title.textContent = goal.title;

    const text = document.createElement("p");
    text.textContent = goal.text;

    const meta = document.createElement("div");
    meta.className = "goal-meta";

    const checkWrap = document.createElement("label");
    checkWrap.className = "row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "goal-check";
    checkbox.checked = Boolean(goal.done);
    checkbox.addEventListener("change", () => {
      const updated = getStoredArray(GOALS_KEY);
      updated[index].done = checkbox.checked;
      saveStoredArray(GOALS_KEY, updated);
      renderGoals();
    });

    const checkText = document.createElement("span");
    checkText.textContent = checkbox.checked ? "Concluida" : "Em andamento";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "secondary";
    removeBtn.textContent = "Excluir";
    removeBtn.addEventListener("click", () => {
      const updated = getStoredArray(GOALS_KEY).filter((_, i) => i !== index);
      saveStoredArray(GOALS_KEY, updated);
      renderGoals();
    });

    checkWrap.appendChild(checkbox);
    checkWrap.appendChild(checkText);
    meta.appendChild(checkWrap);
    meta.appendChild(removeBtn);

    item.appendChild(title);
    item.appendChild(text);
    item.appendChild(meta);

    goalsList.appendChild(item);
  });
}

function saveGoal(event) {
  event.preventDefault();

  const title = sanitizeText(goalTitleInput.value);
  const text = sanitizeText(goalTextInput.value);

  if (!title || !text) {
    return;
  }

  const goal = { title, text, done: false };
  saveStoredArray(GOALS_KEY, [goal, ...getStoredArray(GOALS_KEY)].slice(0, 120));
  goalForm.reset();
  renderGoals();
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
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
}

ensureInitialTimeline();
ensureInitialGoals();
renderTimeline();
renderGoals();
setupCinematicReveal();

timelineForm.addEventListener("submit", saveTimeline);
goalForm.addEventListener("submit", saveGoal);
