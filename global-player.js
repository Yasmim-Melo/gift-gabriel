(() => {
  const FIXED_SPOTIFY_PLAYLIST = "https://open.spotify.com/playlist/3Crc3YKTFBYWawEub8pKNv?si=OJtXKHtkQZ6KiQBvm1skCw";
  const STORAGE_KEY = "loveGiftGlobalPlayerCollapsed";

  function extractSpotifyEmbed(url) {
    const match = url.match(/open\.spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/);
    if (!match) {
      return null;
    }
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`;
  }

  function buildDock() {
    const embedUrl = extractSpotifyEmbed(FIXED_SPOTIFY_PLAYLIST);
    if (!embedUrl) {
      return;
    }

    const dock = document.createElement("aside");
    dock.className = "global-player-dock";

    const header = document.createElement("div");
    header.className = "global-player-header";

    const title = document.createElement("strong");
    title.textContent = "Vitrola do amor";

    const actions = document.createElement("div");
    actions.className = "global-player-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "secondary";
    toggleBtn.textContent = "Minimizar";

    const continuousBtn = document.createElement("button");
    continuousBtn.type = "button";
    continuousBtn.textContent = "Modo continuo";

    actions.appendChild(toggleBtn);
    actions.appendChild(continuousBtn);
    header.appendChild(title);
    header.appendChild(actions);

    const body = document.createElement("div");
    body.className = "global-player-body";

    const info = document.createElement("p");
    info.className = "global-player-info";
    info.textContent = "Toque a playlist fixa em qualquer pagina.";

    const frame = document.createElement("iframe");
    frame.className = "global-player-frame";
    frame.title = "Player global";
    frame.loading = "lazy";
    frame.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
    frame.src = embedUrl;

    body.appendChild(info);
    body.appendChild(frame);

    dock.appendChild(header);
    dock.appendChild(body);
    document.body.appendChild(dock);

    const isCollapsed = localStorage.getItem(STORAGE_KEY) === "1";
    if (isCollapsed) {
      dock.classList.add("collapsed");
      toggleBtn.textContent = "Expandir";
    }

    toggleBtn.addEventListener("click", () => {
      dock.classList.toggle("collapsed");
      const collapsed = dock.classList.contains("collapsed");
      toggleBtn.textContent = collapsed ? "Expandir" : "Minimizar";
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    });

    continuousBtn.addEventListener("click", () => {
      window.open("player.html", "lovePlayerWindow", "width=430,height=720,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildDock);
  } else {
    buildDock();
  }
})();