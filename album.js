const STORAGE_KEY = "loveGiftPhotos";

const albumGrid = document.getElementById("albumGrid");
const albumFeedback = document.getElementById("albumFeedback");
const isFixedMode = true;

// Sua lista de imagens original mantida intacta
const FIXED_ALBUM_IMAGES = [
  "images/02.png",
  "images/04.png",
  "images/07.png",
  "images/08.png",
  "images/09.png",
  "images/10.png",
  "images/11.png",
  "images/12.png",
  "images/13.png",
  "images/14.png",
  "images/15.png",
  "images/16.png",
  "images/17.png",
  "images/18.png",
  "images/19.png",
  "images/20.png",
  "images/21.png",
  "images/22.png",  
  "images/23.png",
  "images/24.png",
  "images/25.png",
  "images/26.png",
  "images/27.png",
  "images/28.png"
];

// =========================================================================
// SEU MAPEAMENTO MANUAL: Legendas e datas configuradas uma por uma
// =========================================================================
const CUSTOM_CAPTIONS = [
  { title: "Nosso primeiro date \"oficial\" ", date: "25/04/2024" }, // Altera a foto 02.png
  { title: "Nossa primeira viagem juntos (Goiânia-GO)", date: "27/07/2024" }, // Altera a foto 04.png
  { title: " ", date: "05/04/2026" }, // Altera a foto 07.png
  { title: "Ida ao Route 64 e show de \"Os Paralamas do Sucesso\"", date: "02/05/2026" }, // Altera a foto 08.png
  { title: "Passeio com a Gamora, na casa da sua mãe", date: "07/06/2026" }, // Altera a foto 09.png
  { title: "Ida ao The Haus, quando conheci os seus amigos e saímos pela primeira vez oficialmente como um casal", date: "31/05/2024" }, // Altera a foto 10.png
  { title: " ", date: "31/05/2024" }, // Altera a foto 11.png
  { title: "Primeiro presente que te dei, de dia dos namorados", date: "20/06/2025" }, // Altera a foto 12.png
  { title: " ", date: "20/06/2025" }, // Altera a foto 13.png
  { title: "Fomos ao \"Macarrão da Hora\"", date: "23/06/2024" }, // Altera a foto 14.png
  { title: "Pedido de namoro", date: "30/05/2024" }, // Altera a foto 15.png
  { title: "Festa com amigos do Glaydson dos bombeiros", date: "31/01/2026" }, // Altera a foto 16.png
  { title: "Viagem para Pirenópolis", date: "15/11/2024" }, // Altera a foto 17.png
  { title: "Pirenópolis II", date: "16/11/2024" }, // Altera a foto 18.png
  { title: "Pirenópolis III", date: "15/11/2024" }, // Altera a foto 19.png
  { title: "Pousada das Araras I", date: "21/09/2025" }, // Altera a foto 20.png
  { title: "Pousada das Araras II", date: "21/09/2025" }, // Altera a foto 21.png
  { title: "Pousada das Araras III", date: "21/09/2025" }, // Altera a foto 22.png
  { title: "Pousada das Araras IV", date: "21/09/2025" }, // Altera a foto 23.png
  { title: "Pousada das Araras V", date: "21/09/2025" }, // Altera a foto 24.png
  { title: "Pousada das Araras VI", date: "21/09/2025" }, // Altera a foto 25.png
  { title: "Pousada das Araras VII", date: "21/09/2025" }, // Altera a foto 26.png
  { title: "Pousada das Araras VIII", date: "21/09/2025" }, // Altera a foto 27.png
  { title: "Pousada das Araras IX", date: "21/09/2025" }  // Altera a foto 28.png
];

const appConfig = window.APP_CONFIG || {};
const supabaseUrl = String(appConfig.SUPABASE_URL || "").trim().replace(/\/$/, "");
const supabaseAnonKey = String(appConfig.SUPABASE_ANON_KEY || "").trim();
const supabaseBucket = String(appConfig.SUPABASE_BUCKET || "love-photos").trim() || "love-photos";
const isOnlineMode = Boolean(supabaseUrl && supabaseAnonKey);

let currentPhotos = [];

// Combina os arquivos com as legendas manuais
function getFixedPhotos() {
  return FIXED_ALBUM_IMAGES.map((src, index) => {
    const caption = CUSTOM_CAPTIONS[index] || { title: "", date: "" };
    return {
      id: `fixed-${index + 1}`,
      src,
      title: caption.title, 
      addedAt: caption.date,
      filePath: ""
    };
  });
}

function setFeedback(text, type = "default") {
  if (!albumFeedback) return;
  albumFeedback.textContent = text;
  albumFeedback.style.color = type === "error" ? "#ff9c9c" : type === "success" ? "#8fe8b3" : "#e6d8d6";
}

function formatDateBR(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR");
}

function localGetPhotos() {
  return [];
}

function renderAlbum(photos) {
  if (!albumGrid) return;
  albumGrid.innerHTML = "";

  if (!photos.length) {
    const empty = document.createElement("p");
    empty.className = "feedback";
    empty.textContent = "Nenhuma memória encontrada para o filtro selecionado.";
    albumGrid.appendChild(empty);
    return;
  }

  photos.forEach((photo, index) => {
    const card = document.createElement("article");
    card.className = "photo-card";

    const flip = document.createElement("div");
    flip.className = "album-flip";

    const front = document.createElement("div");
    front.className = "album-face album-front";

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.title || `Memoria ${index + 1}`;
    front.appendChild(img);

    const back = document.createElement("div");
    back.className = "album-face album-back";

    const title = document.createElement("p");
    title.className = "album-back-title";
    title.textContent = (photo.title && photo.title.trim() !== "") ? photo.title : `Memória ${index + 1}`;

    const date = document.createElement("p");
    date.className = "album-back-date";
    date.textContent = (photo.addedAt && photo.addedAt.trim() !== "") ? photo.addedAt : "Sem data";

    back.appendChild(title);
    back.appendChild(date);

    flip.appendChild(front);
    flip.appendChild(back);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "photo-remove";
    removeBtn.textContent = "x";
    removeBtn.hidden = true; // Ocultado no modo fixo estático

    card.appendChild(flip);
    card.appendChild(removeBtn);
    albumGrid.appendChild(card);
  });
}

async function refreshAlbum() {
  if (isFixedMode) {
    currentPhotos = getFixedPhotos();
    renderAlbum(currentPhotos);
    return;
  }
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

// =========================================================================
// CORREÇÃO E IMPLANTAÇÃO: Eventos de Escuta do Filtro por Data
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const dateFilterInput = document.getElementById("dateFilterInput");
  const clearFilterBtn = document.getElementById("clearFilterBtn");

  if (dateFilterInput) {
    dateFilterInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.trim().toLowerCase();
      
      if (!searchTerm) {
        renderAlbum(currentPhotos);
        setFeedback("Mostrando todas as memórias.", "success");
        return;
      }

      const filtered = currentPhotos.filter(photo => {
        const photoDate = String(photo.addedAt || "").toLowerCase();
        const photoTitle = String(photo.title || "").toLowerCase();
        // Permite filtrar buscando tanto pela data digitada quanto por termos da legenda
        return photoDate.includes(searchTerm) || photoTitle.includes(searchTerm);
      });

      renderAlbum(filtered);

      if (filtered.length === 0) {
        setFeedback("Nenhuma foto encontrada para essa busca.", "error");
      } else {
        setFeedback(`Encontrada(s) ${filtered.length} memória(s)!`, "success");
      }
    });
  }

  clearFilterBtn?.addEventListener("click", () => {
    if (dateFilterInput) {
      dateFilterInput.value = "";
    }
    renderAlbum(currentPhotos);
    setFeedback("Mostrando todas as memórias.", "success");
  });
});

async function bootstrap() {
  setFeedback("Álbum carregado com suas legendas e datas personalizadas.", "success");
  await refreshAlbum();
}

bootstrap();
setupCinematicReveal();