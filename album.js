const STORAGE_KEY = "loveGiftPhotos";

const photoInput = document.getElementById("photoInput");
const clearAlbumBtn = document.getElementById("clearAlbumBtn");
const albumGrid = document.getElementById("albumGrid");
const albumFeedback = document.getElementById("albumFeedback");

function getPhotos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePhotos(photos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

function setFeedback(text, type = "default") {
  albumFeedback.textContent = text;
  albumFeedback.style.color = type === "error" ? "#ff9c9c" : type === "success" ? "#8fe8b3" : "#e6d8d6";
}

function renderAlbum() {
  const photos = getPhotos();
  albumGrid.innerHTML = "";

  if (!photos.length) {
    const empty = document.createElement("p");
    empty.className = "feedback";
    empty.textContent = "Seu album ainda esta vazio.";
    albumGrid.appendChild(empty);
    return;
  }

  photos.forEach((src, index) => {
    const card = document.createElement("article");
    card.className = "photo-card";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Memoria ${index + 1}`;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "photo-remove";
    removeBtn.textContent = "x";
    removeBtn.addEventListener("click", () => {
      const updated = getPhotos().filter((_, i) => i !== index);
      savePhotos(updated);
      renderAlbum();
    });

    card.appendChild(img);
    card.appendChild(removeBtn);
    albumGrid.appendChild(card);
  });
}

function addPhotos(fileList) {
  const files = Array.from(fileList).slice(0, 12);
  if (!files.length) {
    return;
  }

  const readers = files.map(file => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  }));

  Promise.all(readers).then(results => {
    const valid = results.filter(Boolean);
    const merged = [...getPhotos(), ...valid].slice(0, 80);
    savePhotos(merged);
    renderAlbum();
    setFeedback("Fotos adicionadas com sucesso.", "success");
  });
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

photoInput.addEventListener("change", event => {
  addPhotos(event.target.files);
  photoInput.value = "";
});

clearAlbumBtn.addEventListener("click", () => {
  savePhotos([]);
  renderAlbum();
  setFeedback("Album limpo.");
});

renderAlbum();
setupCinematicReveal();
