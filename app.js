/* ==========================================================
   ILARIA — NARRATIVE ENGINE
   ========================================================== */


/* ==========================================================
   STATO DEL GIOCO
   ========================================================== */

const STORAGE_KEY = "ilaria_story_progress_v1";

let gameState = {

  experience: 0,

  wine: 0,

  readStories: []

};


/* ==========================================================
   CARICAMENTO
   ========================================================== */

function loadGame() {

  const saved =
    localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return;
  }

  try {

    const parsed =
      JSON.parse(saved);

    gameState.experience =
      Number(parsed.experience) || 0;

    gameState.wine =
      Number(parsed.wine) || 0;

    gameState.readStories =
      Array.isArray(parsed.readStories)
        ? parsed.readStories
        : [];

  } catch (error) {

    console.error(
      "Errore nel caricamento dei progressi:",
      error
    );

  }

}


/* ==========================================================
   SALVATAGGIO
   ========================================================== */

function saveGame() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(gameState)
  );

}


/* ==========================================================
   CONTROLLO SBLOCCO
   ========================================================== */

function isUnlocked(story) {

  const requirement =
    story.requirement;


  if (!requirement) {
    return true;
  }


  if (requirement.type === "free") {
    return true;
  }


  if (requirement.type === "experience") {

    return (
      gameState.experience >=
      requirement.amount
    );

  }


  if (requirement.type === "wine") {

    return (
      gameState.wine >=
      requirement.amount
    );

  }


  return false;

}


/* ==========================================================
   DESCRIZIONE DEL REQUISITO
   ========================================================== */

function getRequirementLabel(story) {

  const requirement =
    story.requirement;


  if (!requirement ||
      requirement.type === "free") {

    return `
      <span class="text-emerald-700">
        ✓ LETTURA LIBERA
      </span>
    `;

  }


  if (requirement.type === "experience") {

    const missing =
      Math.max(
        0,
        requirement.amount -
        gameState.experience
      );


    if (missing === 0) {

      return `
        <span class="text-emerald-700">
          ✓ SBLOCCATA
        </span>
      `;

    }


    return `
      <span class="text-slate-600">
        🔒 SERVONO ${missing} XP
      </span>
    `;

  }


  if (requirement.type === "wine") {

    const missing =
      Math.max(
        0,
        requirement.amount -
        gameState.wine
      );


    if (missing === 0) {

      return `
        <span class="text-amber-700">
          🍷 PRONTA DA RACCONTARE
        </span>
      `;

    }


    return `
      <span class="text-amber-700">
        🍷 SERVONO ${missing}
        ${missing === 1
          ? "BICCHIERE"
          : "BICCHIERI"}
      </span>
    `;

  }

}


/* ==========================================================
   CREA CARD
   ========================================================== */

function createStoryCard(story) {

  const unlocked =
    isUnlocked(story);

  const read =
    gameState.readStories.includes(
      story.id
    );


  const card =
    document.createElement("article");


  card.className = `
    story-card
    bg-white
    border
    border-brand-border
    rounded-xl
    p-6
    flex
    flex-col
    justify-between
    min-h-[360px]
    ${!unlocked ? "locked" : ""}
  `;


  /* -------------------------------------------------------
     REQUISITO
     ------------------------------------------------------- */

  let requirementBox = "";


  if (!unlocked) {

    requirementBox = `

      <div class="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-lg">

        <div class="flex items-center gap-3">

          <div class="lock-icon">
            🔒
          </div>

          <div>

            <div class="font-mono text-[9px] uppercase text-brand-muted mb-1">
              Requisito
            </div>

            <div class="font-mono text-[10px]">
              ${getRequirementLabel(story)}
            </div>

          </div>

        </div>

      </div>

    `;

  }


  /* -------------------------------------------------------
     AZIONE
     ------------------------------------------------------- */

  let action = "";


  if (unlocked) {

    action = `

      <button
        class="open-story font-mono text-[10px] text-brand-accent font-bold hover:underline"
        data-id="${story.id}"
      >
        ${read
          ? "↗ RILEGGI STORIA"
          : "↗ APRI STORIA"}
      </button>

    `;

  } else {

    action = `

      <span class="font-mono text-[9px] text-brand-muted uppercase">
        ${getRequirementLabel(story)}
      </span>

    `;

  }


  /* -------------------------------------------------------
     CARD HTML
     ------------------------------------------------------- */

  card.innerHTML = `

    <div>

      <div class="flex items-center justify-between mb-5">

        <span class="font-mono text-[10px] text-brand-accent font-bold">
          ${story.id}
        </span>

        <span class="font-mono text-[9px] text-brand-muted uppercase">
          ${story.category}
        </span>

      </div>


      <h3 class="font-serif text-2xl font-bold leading-tight mb-4">
        ${story.title}
      </h3>


      <p class="font-serif text-base leading-relaxed text-brand-muted">
        ${story.abstract}
      </p>


      ${requirementBox}

    </div>


    <div class="mt-8 pt-4 border-t border-brand-border flex items-end justify-between gap-4">

      <div>

        <div class="font-mono text-[9px] text-brand-muted uppercase mb-1">
          Mood
        </div>

        <div class="font-mono text-[10px]">
          ${story.mood}
        </div>

      </div>


      <div>

        <div class="font-mono text-[9px] text-brand-muted uppercase mb-1">
          Lettura
        </div>

        <div class="font-mono text-[10px]">
          ${story.readingTime}
        </div>

      </div>


      <div class="ml-auto">
        ${action}
      </div>

    </div>

  `;


  return card;

}


/* ==========================================================
   RENDER
   ========================================================== */

let currentMood = "ALL";
let currentStatus = "ALL";


function renderStories() {

  const container =
    document.getElementById(
      "grid-container"
    );

  const empty =
    document.getElementById(
      "empty-message"
    );


  container.innerHTML = "";


  const filtered =
    storieData.filter(story => {


      /* MOOD */

      if (
        currentMood !== "ALL" &&
        story.mood !== currentMood
      ) {

        return false;

      }


      /* STATUS */

      if (
        currentStatus !== "ALL"
      ) {

        if (
          currentStatus === "unlocked" &&
          !isUnlocked(story)
        ) {

          return false;

        }


        if (
          currentStatus === "locked_wine" &&
          !(
            story.requirement &&
            story.requirement.type === "wine"
          )
        ) {

          return false;

        }


        if (
          currentStatus === "locked_inexperience" &&
          !(
            story.requirement &&
            story.requirement.type === "experience"
          )
        ) {

          return false;

        }

      }


      return true;

    });


  if (filtered.length === 0) {

    empty.classList.remove(
      "hidden"
    );

    return;

  }


  empty.classList.add(
    "hidden"
  );


  filtered.forEach(story => {

    container.appendChild(
      createStoryCard(story)
    );

  });


  attachStoryButtons();

}


/* ==========================================================
   BOTTONI STORIE
   ========================================================== */

function attachStoryButtons() {

  document
    .querySelectorAll(".open-story")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openStory(
            button.dataset.id
          );

        }
      );

    });

}


/* ==========================================================
   APRI STORIA
   ========================================================== */

function openStory(id) {

  const story =
    storieData.find(
      item => item.id === id
    );


  if (!story) {
    return;
  }


  if (!isUnlocked(story)) {

    showLockedMessage(story);

    return;

  }


  const alreadyRead =
    gameState.readStories.includes(
      story.id
    );


  /* -------------------------------------------------------
     VINO
     ------------------------------------------------------- */

  if (
    !alreadyRead &&
    story.requirement &&
    story.requirement.type === "wine"
  ) {

    gameState.wine -=
      story.requirement.amount;

  }


  /* -------------------------------------------------------
     ESPERIENZA
     ------------------------------------------------------- */

  if (!alreadyRead) {

    gameState.readStories.push(
      story.id
    );

    gameState.experience += 1;

  }


  saveGame();

  updateInterface();

  showStoryModal(story);

}


/* ==========================================================
   MODALE STORIA
   ========================================================== */

function showStoryModal(story) {

  const modal =
    document.getElementById(
      "story-modal"
    );


  const content =
    document.getElementById(
      "modal-content"
    );


  content.innerHTML = `

    <div class="mb-6">

      <div class="flex justify-between items-center gap-4">

        <span class="font-mono text-[10px] text-brand-accent uppercase tracking-wider">
          ${story.category}
        </span>

        <span class="font-mono text-[9px] text-brand-muted">
          ${story.id}
        </span>

      </div>

    </div>


    <h2 class="font-serif text-4xl font-bold leading-tight mb-6">
      ${story.title}
    </h2>


    <div class="font-serif text-lg leading-relaxed text-slate-600 space-y-5">

      ${story.content}

    </div>


    <div class="mt-8 pt-5 border-t border-brand-border flex justify-between">

      <span class="font-mono text-[9px] text-brand-muted uppercase">
        Mood: ${story.mood}
      </span>

      <span class="font-mono text-[9px] text-brand-muted uppercase">
        ${story.readingTime}
      </span>

    </div>

  `;


  modal.classList.remove(
    "hidden"
  );

  modal.classList.add(
    "flex"
  );


  requestAnimationFrame(() => {

    modal.classList.add(
      "modal-visible"
    );

    modal.classList.remove(
      "opacity-0"
    );

  });


  document.body.style.overflow =
    "hidden";

}


/* ==========================================================
   CHIUDI MODALE
   ========================================================== */

function closeModal() {

  const modal =
    document.getElementById(
      "story-modal"
    );


  modal.classList.remove(
    "modal-visible"
  );

  modal.classList.add(
    "opacity-0"
  );


  setTimeout(() => {

    modal.classList.remove(
      "flex"
    );

    modal.classList.add(
      "hidden"
    );

  }, 200);


  document.body.style.overflow =
    "";

}


document
  .getElementById("modal-close")
  .addEventListener(
    "click",
    closeModal
  );


document
  .getElementById("story-modal")
  .addEventListener(
    "click",
    event => {

      if (
        event.target.id ===
        "story-modal"
      ) {

        closeModal();

      }

    }
  );


document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeModal();

    }

  }
);


/* ==========================================================
   MESSAGGIO STORIA BLOCCATA
   ========================================================== */

function showLockedMessage(story) {

  const requirement =
    story.requirement;


  if (
    requirement.type ===
    "experience"
  ) {

    const missing =
      requirement.amount -
      gameState.experience;


    alert(
      `Questa storia è ancora secretata.\n\n` +
      `Ti servono ancora ${missing} ` +
      `${missing === 1 ? "XP" : "XP"} ` +
      `per conoscerla.`
    );

    return;

  }


  if (
    requirement.type ===
    "wine"
  ) {

    const missing =
      requirement.amount -
      gameState.wine;


    alert(
      `Questa storia richiede vino.\n\n` +
      `Ti ${
        missing === 1
          ? "serve ancora 1 bicchiere"
          : `servono ancora ${missing} bicchieri`
      }.`
    );

  }

}


/* ==========================================================
   FILTRO MOOD
   ========================================================== */

document
  .querySelectorAll(".mood-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        currentMood =
          button.dataset.mood;


        document
          .querySelectorAll(".mood-btn")
          .forEach(btn => {

            btn.classList.remove(
              "bg-brand-text",
              "text-white"
            );

            btn.classList.add(
              "bg-white",
              "text-brand-muted"
            );

          });


        button.classList.remove(
          "bg-white",
          "text-brand-muted"
        );

        button.classList.add(
          "bg-brand-text",
          "text-white"
        );


        renderStories();

      }
    );

  });


/* ==========================================================
   FILTRO REQUISITI
   ========================================================== */

document
  .querySelectorAll(".status-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        currentStatus =
          button.dataset.status;


        document
          .querySelectorAll(".status-btn")
          .forEach(btn => {

            btn.classList.remove(
              "bg-brand-text",
              "text-white"
            );

            btn.classList.add(
              "bg-white",
              "text-brand-muted"
            );

          });


        button.classList.remove(
          "bg-white",
          "text-brand-muted"
        );

        button.classList.add(
          "bg-brand-text",
          "text-white"
        );


        renderStories();

      }
    );

  });


/* ==========================================================
   VINO
   ========================================================== */

document
  .getElementById("wine-btn")
  .addEventListener(
    "click",
    () => {

      gameState.wine += 1;

      saveGame();

      updateInterface();

    }
  );


/* ==========================================================
   AGGIORNAMENTO INTERFACCIA
   ========================================================== */

function updateInterface() {

  const xp =
    gameState.experience;


  document.getElementById(
    "experience-value"
  ).textContent =
    `${xp} XP`;


  document.getElementById(
    "experience-detail"
  ).textContent =
    `${xp} XP`;


  document.getElementById(
    "wine-count"
  ).textContent =
    gameState.wine;


  /*
   * Il massimo attuale è 10 XP.
   * Possiamo aumentarlo facilmente aggiungendo
   * nuove soglie.
   */

  const maxXP = 10;


  const percentage =
    Math.min(
      100,
      (xp / maxXP) * 100
    );


  document.getElementById(
    "experience-bar"
  ).style.width =
    `${percentage}%`;


  /* Messaggio */

  const message =
    document.getElementById(
      "experience-message"
    );


  if (xp === 0) {

    message.textContent =
      "Leggi le storie per scoprire qualcosa in più.";

  } else if (xp < 2) {

    message.textContent =
      "Hai appena iniziato a conoscermi.";

  } else if (xp < 4) {

    message.textContent =
      "Stai iniziando a capire come funziono.";

  } else if (xp < 6) {

    message.textContent =
      "Ora cominci a conoscere le parti meno evidenti.";

  } else if (xp < 10) {

    message.textContent =
      "Sei arrivato abbastanza lontano.";

  } else {

    message.textContent =
      "Ormai sai parecchie cose su di me.";

  }


  renderStories();

}


/* ==========================================================
   STORIA CASUALE
   ========================================================== */

document
  .getElementById("random-btn")
  .addEventListener(
    "click",
    () => {

      const available =
        storieData.filter(
          story =>
            isUnlocked(story)
        );


      if (!available.length) {
        return;
      }


      const randomStory =
        available[
          Math.floor(
            Math.random() *
            available.length
          )
        ];


      openStory(
        randomStory.id
      );

    }
  );


/* ==========================================================
   AVVIO
   ========================================================== */

loadGame();

updateInterface();


/* ==========================================================
   FUNZIONI DI TEST
   ==========================================================

   Aprendo la console del browser puoi utilizzare:

   ilaria.addXP(1)
   ilaria.addWine()
   ilaria.reset()

   ========================================================== */

window.ilaria = {

  addXP(amount = 1) {

    gameState.experience +=
      Number(amount);

    saveGame();

    updateInterface();

  },


  addWine() {

    gameState.wine += 1;

    saveGame();

    updateInterface();

  },


  reset() {

    gameState = {

      experience: 0,

      wine: 0,

      readStories: []

    };

    saveGame();

    updateInterface();

  },


  getState() {

    return gameState;

  }

};
