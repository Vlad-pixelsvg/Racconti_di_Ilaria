document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("grid-container");
  const moodButtons = document.querySelectorAll(".mood-btn");
  const statusButtons = document.querySelectorAll(".status-btn");
  const modal = document.getElementById("story-modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");
  const randomBtn = document.getElementById("random-btn");

  let currentMood = "ALL";
  let currentStatus = "ALL";

  function getRequirementBanner(story) {
    if (story.status === "locked_wine") {
      return `
        <div class="mt-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg font-mono text-xs">
          <div class="font-bold text-amber-900 flex items-center gap-1.5">
            <span>🍷</span> REQUISITO ACCESSO
          </div>
          <div class="text-amber-700 mt-0.5">${story.wineRequired || "Disinibizione / Calice di vino"}</div>
        </div>
      `;
    }
    if (story.status === "locked_inexperience") {
      return `
        <div class="mt-4 p-3 bg-slate-100 border-l-4 border-slate-500 rounded-r-lg font-mono text-xs">
          <div class="font-bold text-slate-800 flex items-center gap-1.5">
            <span>🔒</span> VINCOLO NARRATIVO
          </div>
          <div class="text-slate-600 mt-0.5">Archiviato per immaturità / inesperienza dell'epoca</div>
        </div>
      `;
    }
    return `
      <div class="mt-4 p-2 bg-emerald-50 border border-emerald-200 rounded-md font-mono text-[11px] text-emerald-800 flex items-center justify-between">
        <span>✓ Documento sbloccato</span>
        <span class="font-bold">Lettura immediata</span>
      </div>
    `;
  }
  function renderGrid() {
    container.innerHTML = "";
    const filtered = storieData.filter(s => {
      const matchMood = currentMood === "ALL" || s.mood === currentMood;
      const matchStatus = currentStatus === "ALL" || s.status === currentStatus;
      return matchMood && matchStatus;
    });

    filtered.forEach(story => {
      const isLocked = story.status !== "unlocked";
      const card = document.createElement("div");
      
      card.className = `bg-white border rounded-xl p-6 transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-md ${
        isLocked ? 'border-dashed border-brand-border bg-slate-50/50' : 'border-brand-border hover:border-brand-accent'
      }`;

      card.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-3 font-mono text-xs">
            <span class="text-brand-muted font-bold">${story.id}</span>
            <span class="px-2.5 py-0.5 rounded-full bg-brand-accentLight text-brand-accent font-semibold">${story.mood}</span>
          </div>
          <h3 class="font-serif text-xl font-bold text-brand-text mb-2 leading-snug">${story.title}</h3>
          <p class="text-xs font-mono text-brand-muted uppercase tracking-wider mb-3">${story.category} • ${story.readingTime}</p>
          <p class="text-sm font-serif text-brand-text/80 leading-relaxed mb-2">${story.abstract}</p>
          
          ${getRequirementBanner(story)}
        </div>

        <div class="pt-4 mt-4 border-t border-brand-bg flex justify-between items-center font-mono text-xs">
          <span class="text-brand-muted">${isLocked ? 'ISPEZIONE' : 'NARRATIVA'}</span>
          <span class="font-bold ${isLocked ? 'text-amber-800' : 'text-brand-accent'}">
            ${isLocked ? 'CONSULTA VINCOLO →' : 'LEGGI IL TESTO →'}
          </span>
        </div>
      `;

      card.addEventListener("click", () => openModal(story));
      container.appendChild(card);
    });
  }

  function openModal(story) {
    let modalBody = "";

    if (story.status === "unlocked") {
      modalBody = `
        <div class="font-mono text-xs text-brand-accent mb-2 font-semibold">${story.id} // ${story.mood}</div>
        <h3 class="font-serif text-2xl font-bold mb-3 text-brand-text">${story.title}</h3>
        <p class="font-mono text-xs text-brand-muted uppercase mb-6">${story.category} • Tempo di lettura: ${story.readingTime}</p>
        <div class="font-serif text-brand-text leading-relaxed space-y-4 mb-6">
          <p>${story.abstract}</p>
        </div>
      `;
    } else if (story.status === "locked_wine") {
      modalBody = `
        <div class="font-mono text-xs text-amber-700 mb-2 font-semibold">${story.id} // DOCUMENTO RISERVATO</div>
        <h3 class="font-serif text-2xl font-bold mb-3 text-brand-text">${story.title}</h3>
        <div class="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 mb-6">
          <p class="font-serif text-base text-amber-950 italic mb-3">
            "Questa storia richiede una dose di disinibizione per essere raccontata."
          </p>
          <div class="font-mono text-xs text-amber-900 bg-amber-200/60 p-2.5 rounded-md font-bold flex items-center gap-2">
            <span>🍷</span> REQUISITO NECESSARIO: ${story.wineRequired || "Offrire un calice di vino"}
          </div>
        </div>
        <p class="font-serif text-sm text-brand-muted mb-6">${story.abstract}</p>
      `;
    } else if (story.status === "locked_inexperience") {
      modalBody = `
        <div class="font-mono text-xs text-slate-600 mb-2 font-semibold">${story.id} // ARCHIVIATO PER INESPERIENZA</div>
        <h3 class="font-serif text-2xl font-bold mb-3 text-brand-text">${story.title}</h3>
        <div class="bg-slate-100 border-2 border-slate-300 rounded-xl p-5 mb-6">
          <p class="font-serif text-base text-slate-900 italic mb-3">
            "Contenuto momentaneamente sigillato a causa di errori dettati dalla giovinezza o dalla scarsa maturità del periodo."
          </p>
          <div class="font-mono text-xs text-slate-700 bg-slate-200 p-2.5 rounded-md font-bold flex items-center gap-2">
            <span>🔒</span> REQUISITO NECESSARIO: Prospettiva e il passare del tempo
          </div>
        </div>
        <p class="font-serif text-sm text-brand-muted mb-6">${story.abstract}</p>
      `;
    }

    modalContent.innerHTML = `
      ${modalBody}
      <button id="close-modal-btn" class="w-full bg-brand-text text-white font-mono text-xs py-3 rounded-lg font-bold hover:bg-brand-accent transition-colors">
        CHIUDI SCHEDA
      </button>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    document.getElementById("close-modal-btn").addEventListener("click", closeModal);
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  randomBtn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * storieData.length);
    openModal(storieData[randomIndex]);
  });

  // Eventi Filtri Mood
  moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      moodButtons.forEach(b => {
        b.classList.remove("bg-brand-text", "text-white");
        b.classList.add("bg-white", "text-brand-muted");
      });
      btn.classList.remove("bg-white", "text-brand-muted");
      btn.classList.add("bg-brand-text", "text-white");
      currentMood = btn.dataset.mood;
      renderGrid();
    });
  });

  // Eventi Filtri Status
  statusButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      statusButtons.forEach(b => {
        b.classList.remove("bg-brand-text", "text-white");
      });
      btn.classList.add("bg-brand-text", "text-white");
      currentStatus = btn.dataset.status;
      renderGrid();
    });
  });

  modalClose.addEventListener("click", closeModal);
  renderGrid();
});
