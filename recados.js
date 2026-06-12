const NOTES_KEY = "loveGiftNotes";

const noteForm = document.getElementById("noteForm");
const noteTitleInput = document.getElementById("noteTitle");
const noteBodyInput = document.getElementById("noteBody");
const notesList = document.getElementById("notesList");
const noteFeedback = document.getElementById("noteFeedback");
const quickMessageBtn = document.getElementById("quickMessageBtn");
const quickMessageText = document.getElementById("quickMessageText");

const quickMessages = [
  "Você ilumina meus dias",
  "Amar você é a melhor parte da minha vida.",
  "Obrigada por deixar meus dias tão leves.",
  "Eu escolho você todos os dias.",
  "No teu abraço, encontrei meu lar.",
  "Você é meu porto seguro.",
  "Cada momento com você é um presente.",
];

function sanitizeText(text) {
  return String(text || "").replace(/[<>]/g, "").trim();
}

function getNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function setFeedback(text, type = "default") {
  noteFeedback.textContent = text;
  noteFeedback.style.color = type === "error" ? "#ff9c9c" : type === "success" ? "#e2f6ea" : "#e6d8d6";
}

function renderNotes() {
  const notes = getNotes();
  notesList.innerHTML = "";

  if (!notes.length) {
    const empty = document.createElement("p");
    empty.className = "feedback";
    empty.textContent = "Nenhum recado salvo ainda.";
    notesList.appendChild(empty);
    return;
  }

  notes.forEach((note, index) => {
    const item = document.createElement("article");
    item.className = "note-item";

    const title = document.createElement("h3");
    title.textContent = note.title;

    const body = document.createElement("p");
    body.textContent = note.body;

    const meta = document.createElement("div");
    meta.className = "note-meta";

    const date = document.createElement("span");
    date.className = "note-date";
    date.textContent = note.date;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "secondary";
    removeBtn.textContent = "Excluir";
    removeBtn.addEventListener("click", () => {
      const updated = getNotes().filter((_, i) => i !== index);
      saveNotes(updated);
      renderNotes();
    });

    meta.appendChild(date);
    meta.appendChild(removeBtn);

    item.appendChild(title);
    item.appendChild(body);
    item.appendChild(meta);

    notesList.appendChild(item);
  });
}

function saveNote(event) {
  event.preventDefault();

  const title = sanitizeText(noteTitleInput.value);
  const body = sanitizeText(noteBodyInput.value);

  if (!title || !body) {
    setFeedback("Preencha titulo e mensagem.", "error");
    return;
  }

  const newNote = {
    title,
    body,
    date: new Date().toLocaleString("pt-BR")
  };

  saveNotes([newNote, ...getNotes()].slice(0, 120));
  noteForm.reset();
  setFeedback("Recado salvo com sucesso.", "success");
  renderNotes();
}

function generateQuickMessage() {
  quickMessageText.textContent = quickMessages[Math.floor(Math.random() * quickMessages.length)];
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

noteForm.addEventListener("submit", saveNote);
quickMessageBtn.addEventListener("click", generateQuickMessage);

renderNotes();
setupCinematicReveal();
