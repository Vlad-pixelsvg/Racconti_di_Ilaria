/* =========================================================
   ILARIA — STORY ENGINE
   ========================================================= */

const STORAGE_KEY = "ilaria-story-progress";


/* ---------------------------------------------------------
   STATO
   --------------------------------------------------------- */

let state = {
  experience: 0,
  readStories: [],
  wine: 0
};


/* ---------------------------------------------------------
   CARICAMENTO
   --------------------------------------------------------- */

function loadState() {

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return;
  }

  try {

    const parsed = JSON.parse(saved);

    state.experience =
      Number(parsed.experience) || 0;

    state.readStories =
      Array.isArray(parsed.readStories)
        ? parsed.readStories
        : [];

    state.wine =
      Number(parsed.wine) || 0;

  } catch (error) {

    console.warn(
      "Impossibile leggere i progressi salvati.",
      error
    );

  }

}


/* ---------------------------------------------------------
   SALVATAGGIO
   --------------------------------------------------------- */

function saveState() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

}


/* ---------------------------------------------------------
   REQUISITI
   --------------------------------------------------------- */

function isStoryUnlocked(story) {

  const requirement = story.requirement;

  if (!requirement) {
    return true;
  }


  if (requirement.type === "free") {
    return true;
  }


  if (requirement.type === "experience") {

    return state.experience >= requirement.amount;

  }


  if (requirement.type === "wine") {

    return state.wine >= requirement.amount;

  }


  return false;

}


/* ---------------------------------------------------------
   TESTO REQUISITO
   --------------------------------------------------------- */

function getRequirementText(story) {

  const requirement = story.requirement;

  if (!requirement || requirement.type === "free") {

    return `
      <span class="text-green-700">
        ✓ STORIA DISPONIBILE
      </span>
    `;

  }


  if (requirement.type === "experience") {

    const missing =
      Math.max(
        0,
        requirement.amount - state.experience
      );

    if (missing === 0) {

      return `
        <span class="text-green-700">
          ✓ SBLOCCATA
        </span>
      `;

    }

    return `
      <span>
        🔒 SERVONO ${missing} XP
      </span>
    `;

  }


  if (requirement.type === "wine") {

    const missing =
      Math.max(
        0,
        requirement.amount - state.wine
      );

    if (missing === 0) {

      return `
        <span class="text-red">
          🍷 PRONTA DA RACCONTARE
        </span>
      `;

    }

    return `
      <span>
        🍷 SERVONO ${missing}
        ${missing === 1 ? "BICCHIERE" : "BICCHIERI"}
      </span>
    `;

  }

  return "";

}


/* ---------------------------------------------------------
   CARD STORIA
   --------------------------------------------------------- */

function createStoryCard(story) {

  const unlocked =
    isStoryUnlocked(story);

  const alreadyRead =
    state.readStories.includes(story.id);


  const card =
    document.createElement("article");

  card.className =
    `story-card ${
      unlocked ? "" : "locked-card"
    }`;


  let action = "";


  if (unlocked) {

    action = `
      <button
        class="open-story font-mono text-[10px] uppercase tracking-[0.1em] text-red hover:underline"
        data-id="${story.id}"
      >
        ${
          alreadyRead
            ? "Rileggi la storia →"
            : "Leggi la storia →"
        }
      </button>
    `;

  } else {

    action = `
      <span class="font-mono text-[10px] uppercase text-muted">
        ${getRequirementText(story)}
      </span>
    `;

  }


  const readBadge =
    alreadyRead
      ? `
        <span class="font-mono text-[9px] uppercase text-green-700">
          ✓ Già letta
        </span>
      `
      : "";


  card.innerHTML = `

    <div>

      <div class="flex justify-between items-start mb-8">

        <span class="story-number">
          ${story.id}
        </span>

        <span class="font-mono text-[9px] uppercase text-muted">
          ${story.category}
        </span>

      </div>


      <h3 class="story-title mb-6">
        ${story.title}
      </h3>


      <p class="story-abstract">
        ${story.abstract}
      </p>


      ${
        !unlocked
          ? `
            <div class="lock-box">
              ${getRequirementText(story)}
            </div>
          `
          : ""
      }

    </div>


    <div class="story-footer">

      <div class="flex flex-col gap-1">

        <span class="font-mono text-[9px] uppercase text-muted">
          ${story.mood}
        </span>

        <span class="font-mono text-[9px] text-muted">
          ${story.readingTime}
        </span>

        ${readBadge}

      </div>

      ${action}

    </div>

  `;


  return card;

}


/* ---------------------------------------------------------
   RENDER STORIE
   --------------------------------------------------------- */

function renderStories(mood = "ALL") {

  const container =
    document.getElementById("grid-container");

  const emptyMessage =
    document.getElementById("empty-message");


  container.innerHTML = "";


  const filteredStories =
    storieData.filter(story => {

      if (mood === "ALL") {
        return true;
      }

      return story.mood === mood;

    });


  if (filteredStories.length === 0) {

    emptyMessage.classList.remove("hidden");

    return;

  }


  emptyMessage.classList.add("hidden");


  filteredStories.forEach(story => {

    const card =
      createStoryCard(story);

    container.appendChild(card);

  });


  attachStoryButtons();

}


/* ---------------------------------------------------------
   BOTTONI STORIE
   --------------------------------------------------------- */

function attachStoryButtons() {

  document
    .querySelectorAll(".open-story")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.dataset.id;

          openStory(id);

        }
      );

    });

}


/* ---------------------------------------------------------
   APERTURA STORIA
   --------------------------------------------------------- */

function openStory(id) {

  const story =
    storieData.find(
      item => item.id === id
    );


  if (!story) {
    return;
  }


  if (!isStoryUnlocked(story)) {

    alert(
      getLockedMessage(story)
    );

    return;

  }


  /*
   * Il vino viene consumato
   * solo quando la storia viene aperta.
   */

  if (
    story.requirement &&
    story.requirement.type === "wine" &&
    !state.readStories.includes(story.id)
  ) {

    state.wine =
      Math.max(
        0,
        state.wine - story.requirement.amount
      );

  }


  /*
   * La prima lettura assegna esperienza.
   */

  if (
    !state.readStories.includes(story.id)
  ) {

    state.readStories.push(
      story.id
    );

    state.experience += 1;

  }


  saveState();

  updateInterface();

  showModal(story);

}


/* ---------------------------------------------------------
   MESSAGGIO BLOCCO
   --------------------------------------------------------- */

function getLockedMessage(story) {

  const requirement =
    story.requirement;


  if (
    requirement.type === "experience"
  ) {

    const missing =
      requirement.amount -
      state.experience;

    return `
      Questa storia non è ancora pronta.

      Ti mancano ${missing} ${
        missing === 1
          ? "storia letta"
          : "storie lette"
      } per guadagnare abbastanza esperienza.
    `;

  }


  if (
    requirement.type === "wine"
  ) {

    const missing =
      requirement.amount -
      state.wine;

    return `
      Questa storia richiede
      ${requirement.amount} ${
        requirement.amount === 1
          ? "bicchiere"
          : "bicchieri"
      } di vino.

      Te ne ${
        missing === 1
          ? "manca ancora uno"
          : `mancano ancora ${missing}`
      }.
    `;

  }


  return "Questa storia è ancora bloccata.";

}


/* ---------------------------------------------------------
   MODALE
   --------------------------------------------------------- */

function showModal(story) {

  const modal =
    document.getElementById("story-modal");


  document.getElementById(
    "modal-category"
  ).textContent =
    story.category;


  document.getElementById(
    "modal-id"
  ).textContent =
    story.id;


  document.getElementById(
    "modal-title"
  ).innerHTML =
    story.title;


  document.getElementById(
    "modal-body"
  ).innerHTML =
    story.content;


  document.getElementById(
    "modal-mood"
  ).textContent =
    `Mood: ${story.mood}`;


  document.getElementById(
    "modal-reading-time"
  ).textContent =
    story.readingTime;


  modal.classList.add("open");

  document.body.style.overflow =
    "hidden";

}


/* ---------------------------------------------------------
   CHIUSURA MODALE
   --------------------------------------------------------- */

function closeModal() {

  const modal =
    document.getElementById("story-modal");

  modal.classList.remove("open");

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


/* ---------------------------------------------------------
   FILTRI
   --------------------------------------------------------- */

document
  .querySelectorAll(".filter-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".filter-btn")
          .forEach(btn => {

            btn.classList.remove(
              "active"
            );

          });


        button.classList.add(
          "active"
        );


        renderStories(
          button.dataset.mood
        );

      }
    );

  });


/* ---------------------------------------------------------
   AGGIUNGI VINO
   ---------------------------------------------------------

   Per ora è un sistema di test.
   Successivamente possiamo trasformarlo
   in una vera interazione narrativa.
   --------------------------------------------------------- */

function addWine() {

  state.wine += 1;

  saveState();

  updateInterface();

}


/*
 * Per aggiungere un bicchiere da console:
 *
 * addWine()
 *
 * In futuro possiamo creare un pulsante
 * "Versa un bicchiere" direttamente nella UI.
 */


/* ---------------------------------------------------------
   INTERFACCIA
   --------------------------------------------------------- */

function updateInterface() {

  const xp =
    state.experience;


  document.getElementById(
    "experience-value"
  ).textContent =
    xp;


  document.getElementById(
    "xp-current"
  ).textContent =
    xp;


  document.getElementById(
    "wine-count"
  ).textContent =
    state.wine;


  /*
   * Trova il prossimo livello.
   */

  const levels = [
    0,
    2,
    4,
    6,
    10
  ];


  let nextLevel =
    levels.find(
      level => level > xp
    );


  if (!nextLevel) {
    nextLevel = xp;
  }


  document.getElementById(
    "xp-next"
  ).textContent =
    nextLevel;


  /*
   * Percentuale progressione.
   */

  const previousLevel =
    levels
      .filter(level => level <= xp)
      .pop() || 0;


  let percentage;


  if (nextLevel === xp) {

    percentage = 100;

  } else {

    percentage =
      (
        (xp - previousLevel) /
        (nextLevel - previousLevel)
      ) * 100;

  }


  document.getElementById(
    "experience-progress"
  ).style.width =
    `${Math.min(100, percentage)}%`;


  /*
   * Mantiene il filtro corrente.
   */

  const activeFilter =
    document.querySelector(
      ".filter-btn.active"
    );


  const currentMood =
    activeFilter
      ? activeFilter.dataset.mood
      : "ALL";


  renderStories(currentMood);

}


/* ---------------------------------------------------------
   AVVIO
   --------------------------------------------------------- */

loadState();

updateInterface();


/* ---------------------------------------------------------
   DEBUG / TEST
   ---------------------------------------------------------

   Queste funzioni sono volutamente esposte
   nel browser per facilitare il test.
   --------------------------------------------------------- */

window.ilaria = {

  getState() {
    return state;
  },

  addWine() {
    addWine();
  },

  addExperience(amount = 1) {

    state.experience += amount;

    saveState();

    updateInterface();

  },

  reset() {

    localStorage.removeItem(
      STORAGE_KEY
    );

    state = {
      experience: 0,
      readStories: [],
      wine: 0
    };

    updateInterface();

  }

};
