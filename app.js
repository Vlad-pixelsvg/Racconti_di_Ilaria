document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("grid-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const modal = document.getElementById("unlock-modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  let currentFilter = "ALL";

  function getBadgeHTML(status) {
    switch (status) {
      case "unlocked":
        return '<span class="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#E2F0D9] text-[#2E6B40]">[DISPONIBILE]</span>';
      case "told_verbally":
        return '<span class="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#E1EBF5] text-[#1D4E89]">[RACCONTATO A VOCE]</span>';
      case "locked_wine":
        return '<span class="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#FCE4D6] text-[#5C1A28]">[RISERVATO: VINO]</span>';
      case "locked_experience":
        return '<span class="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#EDEDED] text-[#595959]">[IN MATURAZIONE]</span>';
    }
  }

  function renderGrid() {
    container.innerHTML = "";
    const filtered = storieData.filter(s => currentFilter === "ALL" || s.status === currentFilter);

    filtered.forEach(story => {
      const card = document.createElement("div");
      const borderStyle = story.status === "locked_experience" ? "border-dashed" : "border-solid";
      card.className = `border border-[#E0E0E0] bg-white p-6 cursor-pointer hover:border-[#111111] transition-all duration-200 flex flex-col justify-between ${borderStyle}`;
      
      let footerHTML = "";
      if (story.status === "unlocked") {
        footerHTML = `<span class="text-gray-400">${story.readingTime}</span><span class="font-bold text-[#111111]">LEGGI IL SAGGIO →</span>`;
      } else if (story.status === "told_verbally") {
        footerHTML = `<span class="text-gray-400">AUDIO / NOTE</span><span class="font-bold text-[#1D4E89]">CONSULTA →</span>`;
      } else if (story.status === "locked_wine") {
        footerHTML = `<span class="text-[#5C1A28]">${story.wineCurrent}/${story.wineTarget} CALICI</span><span class="font-bold text-[#5C1A28]">[ OFFRI CALICE ]</span>`;
      } else if (story.status === "locked_experience") {
        footerHTML = `<span class="text-gray-400">PROGRESSO: ${story.progress}%</span><span class="font-bold text-gray-600">[ AVVISAMI ]</span>`;
      }

      card.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-4 font-mono text-xs">
            <span class="text-gray-400">${story.id}</span>
            ${getBadgeHTML(story.status)}
          </div>
          <h3 class="font-serif text-xl font-bold text-[#111111] mb-2 leading-snug">${story.title}</h3>
          <p class="text-xs font-sans text-gray-500 uppercase tracking-wider mb-3">${story.category}</p>
          <p class="text-sm font-serif text-gray-700 leading-relaxed mb-6">${story.abstract}</p>
        </div>
        <div class="pt-4 border-t border-[#F0F0F0] flex justify-between items-center font-mono text-xs">
          ${footerHTML}
        </div>
      `;

      card.addEventListener("click", () => {
        if (story.status === "unlocked") {
          alert("Apertura pagina del saggio: " + story.title);
        } else {
          openModal(story);
        }
      });

      container.appendChild(card);
    });
  }

  function openModal(story) {
    let body = "";
    if (story.status === "locked_wine") {
      body = `
        <div class="p-4 bg-[#FDF8F6] border-l-4 border-[#5C1A28] mb-6">
          <p class="font-mono text-xs text-[#5C1A28] font-bold uppercase mb-1">PROTOCOLLO CONVIVIALE</p>
          <p class="font-serif text-sm text-gray-700 italic">"Questo saggio contiene dettagli che l'autrice non è disposta a divulgare in condizioni di totale sobrietà."</p>
        </div>
        <a href="https://ko-fi.com" target="_blank" class="block w-full text-center bg-[#5C1A28] text-white font-mono text-xs uppercase py-3 font-bold hover:bg-[#42121D] transition-colors mb-4">Offri un calice di vino (€ 2,50)</a>
        <div class="font-mono text-xs text-gray-500 text-center">Stato della bottiglia: ${story.wineCurrent}/${story.wineTarget} calici sbloccati</div>
      `;
    } else if (story.status === "locked_experience") {
      body = `
        <div class="p-4 bg-[#F8F8F8] border-l-4 border-[#9E9E9E] mb-6">
          <p class="font-mono text-xs text-gray-600 font-bold uppercase mb-1">STATO: IN CORSO DI VITA</p>
          <p class="font-serif text-sm text-gray-700 italic">"L'autrice sta attualmente vivendo i fatti o attendendo che le conseguenze siano chiaramente decifrabili."</p>
        </div>
        <div class="mb-6">
          <div class="flex justify-between font-mono text-xs mb-1">
            <span>MATURAZIONE ESPERIENZA</span><span>${story.progress}%</span>
          </div>
          <div class="w-full bg-gray-200 h-2">
            <div class="bg-[#111111] h-2" style="width: ${story.progress}%"></div>
          </div>
          <p class="font-mono text-[10px] text-gray-400 mt-1">STIMA: ${story.estimatedCompletion}</p>
        </div>
        <form onsubmit="event.preventDefault(); alert('Notifica attivata!'); modal.classList.add('hidden'); modal.classList.remove('flex');" class="flex gap-2">
          <input type="email" required placeholder="Inserisci la tua email..." class="flex-1 border border-[#E0E0E0] p-2 font-mono text-xs focus:outline-none focus:border-black">
          <button type="submit" class="bg-[#111111] text-white font-mono text-xs uppercase px-4 py-2 font-bold">Notificami</button>
        </form>
      `;
    } else if (story.status === "told_verbally") {
      body = `
        <div class="p-4 bg-[#F2F6FA] border-l-4 border-[#1D4E89] mb-6">
          <p class="font-mono text-xs text-[#1D4E89] font-bold uppercase mb-1">TRACCIA NARRATIVA</p>
          <p class="font-serif text-sm text-gray-700 italic">"Questa storia è già stata espressa oralmente a cena. Di seguito gli appunti sintetici tratti dalla conversazione."</p>
        </div>
        <p class="font-serif text-sm text-gray-800 leading-relaxed">${story.abstract}</p>
      `;
    }

    modalContent.innerHTML = `
      <span class="font-mono text-xs text-gray-400 uppercase tracking-widest block mb-1">CODICE: ${story.id}</span>
      <h2 class="font-serif text-2xl font-bold text-[#111111] mb-2">${story.title}</h2>
      ${body}
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  modalClose.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => {
        b.classList.remove("bg-[#111111]", "text-white", "font-bold");
        b.classList.add("bg-white", "text-gray-600", "border", "border-[#E0E0E0]");
      });
      btn.classList.remove("bg-white", "text-gray-600", "border", "border-[#E0E0E0]");
      btn.classList.add("bg-[#111111]", "text-white", "font-bold");
      currentFilter = btn.dataset.filter;
      renderGrid();
    });
  });

  renderGrid();
});
