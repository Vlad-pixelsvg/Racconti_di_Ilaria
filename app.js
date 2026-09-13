document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("grid-container");
  const filterButtons = document.querySelectorAll(".mood-btn");
  const modal = document.getElementById("story-modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");
  const randomBtn = document.getElementById("random-btn");

  let currentMood = "ALL";

  function renderGrid() {
    container.innerHTML = "";
    const filtered = storieData.filter(s => currentMood === "ALL" || s.mood === currentMood);

    filtered.forEach(story => {
      const card = document.createElement("div");
      card.className = "bg-white border border-brand-border rounded-xl p-6 hover:border-brand-accent transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-md";

      card.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-3 font-mono text-xs text-brand-muted">
            <span>${story.id}</span>
            <span class="px-2.5 py-0.5 rounded-full bg-brand-accentLight text-brand-accent font-semibold">${story.mood}</span>
          </div>
          <h3 class="font-serif text-xl font-bold text-brand-text mb-2 leading-snug">${story.title}</h3>
          <p class="text-xs font-mono text-brand-muted uppercase tracking-wider mb-4">${story.category} • ${story.readingTime}</p>
          <p class="text-sm font-serif text-brand-text/80 leading-relaxed mb-6">${story.abstract}</p>
        </div>
        <div class="pt-4 border-t border-brand-bg flex justify-between items-center font-mono text-xs">
          <span class="text-brand-muted">LEGGERE</span>
          <span class="font-bold text-brand-accent">APRI →</span>
        </div>
      `;

      card.addEventListener("click", () => openModal(story));
      container.appendChild(card);
    });
  }

  function openModal(story) {
    modalContent.innerHTML = `
      <div class="font-mono text-xs text-brand-accent mb-2 font-semibold">${story.id} // ${story.mood}</div>
      <h3 class="font-serif text-2xl font-bold mb-3 text-brand-text">${story.title}</h3>
      <p class="font-mono text-xs text-brand-muted uppercase mb-6">${story.category} • Tempo di lettura: ${story.readingTime}</p>
      <div class="font-serif text-brand-text leading-relaxed space-y-4 mb-6">
        <p>${story.abstract}</p>
        <p class="italic text-brand-muted text-sm border-l-2 border-brand-accent pl-4">
          [Il testo completo di questa cronaca è disponibile nell'archivio cartaceo originale.]
        </p>
      </div>
      <button id="close-modal-btn" class="w-full bg-brand-text text-white font-mono text-xs py-3 rounded-lg font-bold hover:bg-brand-accent transition-colors">
        CHIUDI DOCUMENTO
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

  // Estrazione casuale
  randomBtn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * storieData.length);
    openModal(storieData[randomIndex]);
  });

  // Filtri Mood
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => {
        b.classList.remove("bg-brand-text", "text-white");
        b.classList.add("bg-white", "text-brand-muted");
      });

      btn.classList.remove("bg-white", "text-brand-muted");
      btn.classList.add("bg-brand-text", "text-white");

      currentMood = btn.dataset.mood;
      renderGrid();
    });
  });

  modalClose.addEventListener("click", closeModal);

  renderGrid();
});
