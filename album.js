const STORAGE_KEY = "loveGiftPhotos";

const photoInput = document.getElementById("photoInput");
const clearAlbumBtn = document.getElementById("clearAlbumBtn");
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
  "images/19.png"
];

// =========================================================================
// MUDE MANUALMENTE AQUI: Altere os textos e as datas de uma por uma!
// Cada linha altera a foto correspondente na lista de cima.
// =========================================================================
const CUSTOM_CAPTIONS = [
  { title: "Nosso primeiro date \"oficial\" ", date: "25/04/2024" }, // Altera a foto 02.png
  { title: "Nossa primeira viagem juntos (Goiânia-GO)", date: "27/07/2024" }, // Altera a foto 04.png
  { title: " ", date: "05/04/2026" }, // Altera a foto 07.png
  { title: "Ida ao Route 64 e show de \"Os Paralamas do Sucesso\"",         date: "02/05/2026" }, // Altera a foto 08.png
  { title: "Passeio com a Gamora, na casa da sua mãe",        date: "07/06/2026" }, // Altera a foto 09.png
  { title: "Ida ao The Haus, quando conheci os seus amigos e saímos pela primeira vez oficialmente como um casal",  date: "31/05/2024" }, // Altera a foto 10.png
  { title: " ",   date: "31/05/2024" }, // Altera a foto 11.png
  { title: "Primeiro presente que te dei, de dia dos namorados",        date: "20/06/2025" }, // Altera a foto 12.png
  { title: " ", date: "20/06/2025" }, // Altera a foto 13.png
  { title: "Fomos ao \"Macarrão da Hora\"",           date: "23/06/2024" }, // Altera a foto 14.png
  { title: "Pedido de namoro",        date: "30/05/2024" }  // Altera a foto 15.png
    { title: "Pedido de namoro",        date: "30/05/2024" }  // Altera a foto 16.png
  { title: "Pedido de namoro",        date: "30/05/2024" }  // Altera a foto 17.png
  { title: "Pedido de namoro",        date: "30/05/2024" }  // Altera a foto 18.png
  { title: "Pedido de namoro",        date: "30/05/2024" }  // Altera a foto 19.png
];

const appConfig = window.APP_CONFIG || {};
const supabaseUrl = String(appConfig.SUPABASE_URL || "").trim().replace(/\/$/, "");
const supabaseAnonKey = String(appConfig.SUPABASE_ANON_KEY || "").trim();
const supabaseBucket = String(appConfig.SUPABASE_BUCKET || "love-photos").trim() || "love-photos";
const isOnlineMode = Boolean(supabaseUrl && supabaseAnonKey);

let currentPhotos = [];

// Injeta dinamicamente as legendas customizadas sem alterar a estrutura do seu HTML original
function getFixedPhotos() {
  return FIXED_ALBUM_IMAGES.map((src, index) => {
    const caption = CUSTOM_CAPTIONS[index] || { title: `Memoria ${index + 1}`, date: "Sem data" };
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
  albumFeedback.textContent = text;
  albumFeedback.style.color = type === "error" ? "#ff9c9c" : type === "success" ? "#8fe8b3" : "#e6d8d6";
}

function formatDateBR(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR");
}

function slugifyFileName(name) {
  return String(name || "foto")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function localGetPhotos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map(item => {
        if (typeof item === "string") {
          return {
            id: `local-${Math.random().toString(36).slice(2)}`,
            src: item,
            addedAt: "",
            filePath: ""
          };
        }
        if (item && typeof item.src === "string") {
          return {
            id: item.id || `local-${Math.random().toString(36).slice(2)}`,
            src: item.src,
            addedAt: item.addedAt || "",
            filePath: item.filePath || ""
          };
        }
        return null;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function localSavePhotos(photos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return null;
}

async function onlineFetchPhotos() {
  const rows = await apiRequest("/rest/v1/album_photos?select=id,image_url,file_path,added_at&order=added_at.desc");
  return rows.map(item => ({
    id: item.id,
    src: item.image_url,
    addedAt: formatDateBR(item.added_at),
    filePath: item.file_path || ""
  }));
}

async function onlineUploadFile(file) {
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const filePath = `${uniquePrefix}-${slugifyFileName(file.name)}`;

  await apiRequest(`/storage/v1/object/${encodeURIComponent(supabaseBucket)}/${encodeURIComponent(filePath)}`, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false"
    },
    body: file
  });

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(supabaseBucket)}/${encodeURIComponent(filePath)}`;
  return { publicUrl, filePath };
}

async function onlineInsertPhoto(photo) {
  const payload = {
    image_url: photo.publicUrl,
    file_path: photo.filePath,
    added_at: new Date().toISOString()
  };

  const inserted = await apiRequest("/rest/v1/album_photos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(payload)
  });

  return inserted?.[0] || null;
}

async function onlineDeletePhoto(photo) {
  if (photo.filePath) {
    await apiRequest(`/storage/v1/object/${encodeURIComponent(supabaseBucket)}/${encodeURIComponent(photo.filePath)}`, {
      method: "DELETE"
    });
  }

  await apiRequest(`/rest/v1/album_photos?id=eq.${encodeURIComponent(photo.id)}`, {
    method: "DELETE"
  });
}

function renderAlbum(photos) {
  albumGrid.innerHTML = "";

  if (!photos.length) {
    const empty = document.createElement("p");
    empty.className = "feedback";
    empty.textContent = "Seu album ainda esta vazio.";
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
    // Garante que se o 'title' manual estiver vazio, ele use o número da memória
    title.textContent = (photo.title && photo.title.trim() !== "") ? photo.title : `Memória ${index + 1}`;

    const date = document.createElement("p");
    date.className = "album-back-date";
    // Garante que se a 'date' manual estiver vazia, ele mostre "Sem data"
    date.textContent = (photo.addedAt && photo.addedAt.trim() !== "") ? photo.addedAt : "Sem data";

    back.appendChild(title);
    back.appendChild(date);

    flip.appendChild(front);
    flip.appendChild(back);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "photo-remove";
    removeBtn.textContent = "x";
    removeBtn.addEventListener("click", async () => {
      if (isFixedMode) {
        setFeedback("Modo fixo ativo: as fotos do album vem da pasta images.");
        return;
      }
      try {
        if (isOnlineMode) {
          await onlineDeletePhoto(photo);
          await refreshAlbum();
          setFeedback("Foto removida.", "success");
        } else {
          currentPhotos = currentPhotos.filter(item => item.id !== photo.id);
          localSavePhotos(currentPhotos);
          renderAlbum(currentPhotos);
          setFeedback("Foto removida.", "success");
        }
      } catch {
        setFeedback("Nao foi possivel remover a foto online.", "error");
      }
    });

    if (isFixedMode) {
      removeBtn.hidden = true;
    }

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

  if (isOnlineMode) {
    currentPhotos = await onlineFetchPhotos();
  } else {
    currentPhotos = localGetPhotos();
  }
  renderAlbum(currentPhotos);
}

async function addPhotos(fileList) {
  if (isFixedMode) {
    setFeedback("Modo fixo ativo: edite a lista em album.js para mudar as fotos.");
    return;
  }

  const files = Array.from(fileList).slice(0, 12);
  if (!files.length) {
    return;
  }

  try {
    if (isOnlineMode) {
      for (const file of files) {
        const uploadResult = await onlineUploadFile(file);
        await onlineInsertPhoto(uploadResult);
      }
      await refreshAlbum();
      setFeedback("Fotos adicionadas online com sucesso.", "success");
      return;
    }

    const readers = files.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    }));

    const results = await Promise.all(readers);
    const nowLabel = formatDateBR(new Date().toISOString());
    const valid = results
      .filter(Boolean)
      .map(src => ({
        id: `local-${Math.random().toString(36).slice(2)}`,
        src,
        addedAt: nowLabel,
        filePath: ""
      }));
    currentPhotos = [...localGetPhotos(), ...valid].slice(0, 80);
    localSavePhotos(currentPhotos);
    renderAlbum(currentPhotos);
    setFeedback("Fotos adicionadas localmente com sucesso.", "success");
  } catch {
    setFeedback("Falha ao enviar fotos para o album online.", "error");
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

photoInput?.addEventListener("change", async event => {
  await addPhotos(event.target.files);
  photoInput.value = "";
});

clearAlbumBtn?.addEventListener("click", async () => {
  if (isFixedMode) {
    setFeedback("Modo fixo ativo: nada para limpar.");
    return;
  }

  try {
    if (isOnlineMode) {
      for (const photo of currentPhotos) {
        await onlineDeletePhoto(photo);
      }
      await refreshAlbum();
      setFeedback("Album online limpo.", "success");
      return;
    }

    currentPhotos = [];
    localSavePhotos([]);
    renderAlbum(currentPhotos);
    setFeedback("Album local limpo.");
  } catch {
    setFeedback("Nao foi possivel limpar o album online.", "error");
  }
});

async function bootstrap() {
  if (isFixedMode) {
    setFeedback("Modo fixo ativo: album carregado da pasta images.", "success");
    await refreshAlbum();
    if (photoInput) {
      photoInput.disabled = true;
    }
    if (clearAlbumBtn) {
      clearAlbumBtn.disabled = true;
    }
    return;
  }

  if (isOnlineMode) {
    setFeedback("Modo online ativo: as fotos aparecem para todos.", "success");
  } else {
    setFeedback("Modo local ativo. Configure o Supabase no config.js para modo online.");
  }

  try {
    await refreshAlbum();
  } catch {
    setFeedback("Falha ao carregar album online. Verifique config.js e politicas do banco.", "error");
    currentPhotos = localGetPhotos();
    renderAlbum(currentPhotos);
  }
}

bootstrap();
setupCinematicReveal();