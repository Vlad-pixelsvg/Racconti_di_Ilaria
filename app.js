/* ============================================================
   ILARIA — PRIVATE STORIES
   Interactive narrative engine
============================================================ */


/* ============================================================
   CONFIGURAZIONE
============================================================ */

const STORAGE_KEY = "ilaria_private_stories";

const experiencePerStory = 1;


/*
  Il livello viene determinato dalle storie lette.

  0-1 storie  → Livello 1
  2-2 storie  → Livello 2
  3-3 storie  → Livello 3
  4-4 storie  → Livello 4
  ecc.
*/

function calculateLevel(storiesRead) {

  return Math.max(
    1,
    storiesRead + 1
  );

}


/* ============================================================
   STATO
============================================================ */

let state = loadState();

let currentFilter = "all";

let currentWineStory = null;


/* ============================================================
   CARICAMENTO STATO
============================================================ */

function loadState() {

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {

      return {
        readStories: [],
        wineStories: []
      };

    }

    const parsed = JSON.parse(saved);

    return {
      readStories: Array.isArray(parsed.readStories)
        ? parsed.readStories
        : [],

      wineStories: Array.isArray(parsed.wineStories)
        ? parsed.wineStories
        : []
    };

  } catch (error) {

    console.warn(
      "Impossibile leggere lo stato salvato.",
      error
    );

    return {
      readStories: [],
      wineStories: []
    };

  }

}


/* ============================================================
   SALVATAGGIO
============================================================ */

function saveState() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

}


/* ============================================================
   ESPERIENZA
============================================================ */

function getExperience() {

  return state.readStories.length * experiencePerStory;

}


function getLevel() {

  return calculateLevel(
    state.readStories.length
  );

}


/*
  Trova la prossima soglia di esperienza.

  Esempio:

  0 storie:
  livello 1 → prossima soglia 2

  2 storie:
  livello 3 → prossima soglia 3

  Questo serve soprattutto alla barra.
*/

function getNextExperienceRequirement() {

  const lockedExperienceStories = storieData
    .filter(story =>
      story.access &&
      story.access.type === "experience"
    )
    .map(story => story.access.required)
    .filter(value => value > getExperience())
    .sort((a, b) => a - b);

  if (lockedExperienceStories.length === 0) {

    return Math.max(
      getExperience(),
      1
    );

  }

  return lockedExperienceStories[0];

}


/* ============================================================
   CONTROLLO ACCESSO
============================================================ */

function isStoryRead(story) {

  return state.readStories.includes(
    story.id
  );

}


function isWineUnlocked(story) {

  return state.wineStories.includes(
    story.id
  );

}


function canOpenStory(story) {

  if (!story.access) {

    return true;

  }


  if (story.access.type === "free") {

    return true;

  }


  if (story.access.type === "experience") {

    return getExperience() >= story.access.required;

  }


  if (story.access.type === "wine") {

    return isWineUnlocked(story);

  }


  return false;

}


/* ============================================================
   TESTO ACCESSO
============================================================ */

function getAccessBadge(story) {

  if (story.access.type === "free") {

    return `
      <span class="badge badge-free">
        ✓ Lettura libera
      </span>
    `;

  }


  if (story.access.type === "experience") {

    if (
      getExperience() >= story.access.required
    ) {

      return `
        <span class="badge badge-free">
          ✓ Esperienza acquisita
        </span>
      `;

    }

    return `
      <span class="badge badge-exp">
        ◆ Esperienza ${String(
          story.access.required
        ).padStart(2, "0")}
      </span>
    `;

  }


  if (story.access.type === "wine") {

    if (isWineUnlocked(story)) {

      return `
        <span class="badge badge-wine">
          🍷 Accesso ottenuto
        </span>
      `;

    }

    return `
      <span class="badge badge-wine">
        🍷 ${story.wineRequired || "Vino"}
      </span>
    `;

  }


  return "";

}


/* ============================================================
   CARD
============================================================ */

function renderStories() {

  const grid =
    document.getElementById(
      "stories-grid"
    );

  if (!grid) return;


  let stories = storieData;


  /*
    FILTRO MOOD
  */

  if (currentFilter !== "all") {

    stories = stories.filter(
      story =>
        story.mood === currentFilter
    );

  }


  if (stories.length === 0) {

    grid.innerHTML = `
      <div class="empty-state md:col-span-3">

        <div class="font-mono text-[10px] text-red tracking-[0.15em]">
          NESSUN DOCUMENTO
        </div>

        <div class="font-display text-2xl mt-3">
          Nessuna storia con questo mood.
        </div>

      </div>
    `;

    return;

  }


  grid.innerHTML = stories
    .map(
      (story, index) =>
        createStoryCard(story, index)
    )
    .join("");


  /*
    Event listener sulle card
  */

  document
    .querySelectorAll(
      "[data-story-id]"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          const storyId =
            card.dataset.storyId;

          const story =
            storieData.find(
              item =>
                item.id === storyId
            );

          if (!story) return;

          handleStoryClick(story);

        }
      );

    });

}


/* ============================================================
   CREA CARD
============================================================ */

function createStoryCard(story, index) {

  const available =
    canOpenStory(story);

  const read =
    isStoryRead(story);

  const storyNumber =
    String(index + 1).padStart(2, "0");


  /*
    CARD BLOCCATA
  */

  if (!available) {

    let lockText = "";


    if (
      story.access.type === "experience"
    ) {

      const missing =
        story.access.required -
        getExperience();

      lockText = `
        <div class="lock-panel">

          <div class="font-mono text-[9px] text-red tracking-[0.12em]">
            STORIA NON ANCORA DISPONIBILE
          </div>

          <div class="font-display italic text-sm mt-2 opacity-70">
            Ti mancano ${missing}
            ${
              missing === 1
                ? "storia"
                : "storie"
            } da leggere.
          </div>

          <div class="font-mono text-[9px] mt-4 opacity-55">
            ESPERIENZA RICHIESTA:
            ${String(
              story.access.required
            ).padStart(2, "0")}
          </div>

        </div>
      `;

    }


    if (
      story.access.type === "wine"
    ) {

      lockText = `
        <div class="lock-panel">

          <div class="text-2xl">
            🍷
          </div>

          <div class="font-mono text-[9px] text-red tracking-[0.12em] mt-3">
            ACCESSO CON VINO
          </div>

          <div class="font-display italic text-sm mt-2 opacity-70">
            Questa storia preferisce
            essere raccontata davanti
            a un bicchiere.
          </div>

        </div>
      `;

    }


    return `
      <article
        class="story-card locked p-6 cursor-pointer"
        data-story-id="${story.id}">

        <div class="flex justify-between items-start">

          <div class="story-number">
            STORIA ${storyNumber}
          </div>

          ${getAccessBadge(story)}

        </div>


        <div class="mt-12">

          <div class="font-mono text-[9px] uppercase opacity-50 tracking-[0.12em]">
            ${story.category}
          </div>

          <h3 class="story-title mt-3">
            ${story.title}
          </h3>

        </div>


        ${lockText}

      </article>
    `;

  }


  /*
    CARD SBLOCCATA
  */

  return `
    <article
      class="story-card p-6 cursor-pointer"
      data-story-id="${story.id}">

      <div class="flex justify-between items-start">

        <div class="story-number">
          STORIA ${storyNumber}
        </div>

        ${getAccessBadge(story)}

      </div>


      <div class="mt-9">

        <div class="font-mono text-[9px] uppercase opacity-50 tracking-[0.12em]">
          ${story.category}
        </div>

        <h3 class="story-title mt-3">
          ${story.title}
        </h3>

        <p class="story-excerpt mt-6">
          ${story.abstract}
        </p>

      </div>


      <div class="absolute bottom-6 left-6 right-6">

        <div class="dossier-line mb-4"></div>

        <div class="flex justify-between items-center">

          <div class="font-mono text-[9px] opacity-50">
            ${story.mood}
            ·
            ${story.readingTime}
          </div>

          <div class="font-mono text-[10px] text-red">
            ${read ? "RILEGGI →" : "LEGGI →"}
          </div>

        </div>

      </div>

    </article>
  `;

}


/* ============================================================
   CLICK STORIA
============================================================ */

function handleStoryClick(story) {

  /*
    Se è bloccata dall'esperienza
  */

  if (
    story.access.type === "experience" &&
    getExperience() < story.access.required
  ) {

    showExperienceMessage(
      story
    );

    return;

  }


  /*
    Se è bloccata dal vino
  */

  if (
    story.access.type === "wine" &&
    !isWineUnlocked(story)
  ) {

    openWineModal(
      story
    );

    return;

  }


  /*
    Altrimenti apertura
  */

  openStory(
    story
  );

}


/* ============================================================
   APERTURA STORIA
============================================================ */

function openStory(story) {

  /*
    Prima apertura:
    assegniamo esperienza.

    Una storia vale esperienza
    una sola volta.
  */

  const wasRead =
    isStoryRead(story);


  if (!wasRead) {

    state.readStories.push(
      story.id
    );

    saveState();

    updateInterface();

    showReadingMessage(
      story
    );

  }


  /*
    Modale
  */

  const modal =
    document.getElementById(
      "story-modal"
    );


  document.getElementById(
    "modal-number"
  ).textContent =
    story.id;


  document.getElementById(
    "modal-category"
  ).textContent =
    story.category;


  document.getElementById(
    "modal-title"
  ).textContent =
    stripHTML(story.title);


  document.getElementById(
    "modal-content"
  ).innerHTML =
    story.content;


  document.getElementById(
    "modal-mood"
  ).textContent =
    story.mood;


  document.getElementById(
    "modal-time"
  ).textContent =
    story.readingTime;


  modal.classList.add(
    "active"
  );


  document.body.style.overflow =
    "hidden";


  /*
    Redacted dentro il modal
  */

  setTimeout(
    attachRedactedListeners,
    50
  );

}


/* ============================================================
   CHIUSURA MODALE
============================================================ */

function closeStoryModal() {

  const modal =
    document.getElementById(
      "story-modal"
    );

  modal.classList.remove(
    "active"
  );

  document.body.style.overflow =
    "";

}


/* ============================================================
   VINO
============================================================ */

function openWineModal(story) {

  currentWineStory =
    story;

  document.getElementById(
    "wine-required"
  ).textContent =
    story.wineRequired ||
    "1 bicchiere";


  document
    .getElementById(
      "wine-modal"
    )
    .classList.add(
      "active"
    );


  document.body.style.overflow =
    "hidden";

}


function closeWineModal() {

  document
    .getElementById(
      "wine-modal"
    )
    .classList.remove(
      "active"
    );

  currentWineStory =
    null;

  document.body.style.overflow =
    "";

}


/*
  L'utente dichiara di avere
  il requisito necessario.

  Il browser non può verificare
  fisicamente se abbia bevuto.
*/

function unlockWineStory() {

  if (!currentWineStory) {
    return;
  }


  const story =
    currentWineStory;


  if (
    !state.wineStories.includes(
      story.id
    )
  ) {

    state.wineStories.push(
      story.id
    );

    saveState();

  }


  closeWineModal();

  renderStories();

  showWineMessage(
    story
  );


  /*
    Apriamo immediatamente
    il racconto.
  */

  setTimeout(
    () => {

      openStory(
        story
      );

    },
    450
  );

}


/* ============================================================
   MESSAGGI
============================================================ */

function showReadingMessage(story) {

  const message =
    document.getElementById(
      "unlock-message"
    );

  const title =
    document.getElementById(
      "unlock-title"
    );


  title.textContent =
    `Hai conosciuto un altro pezzo di Ilaria.`;


  message.classList.add(
    "show"
  );


  setTimeout(
    () => {

      message.classList.remove(
        "show"
      );

    },
    2800
  );

}


function showWineMessage(story) {

  const message =
    document.getElementById(
      "unlock-message"
    );

  const title =
    document.getElementById(
      "unlock-title"
    );


  title.textContent =
    `La storia "${stripHTML(story.title)}" è stata aperta.`;


  message.classList.add(
    "show"
  );


  setTimeout(
    () => {

      message.classList.remove(
        "show"
      );

    },
    2800
  );

}


function showExperienceMessage(story) {

  const message =
    document.getElementById(
      "unlock-message"
    );

  const title =
    document.getElementById(
      "unlock-title"
    );


  const missing =
    story.access.required -
    getExperience();


  title.textContent =
    `Ancora ${missing} ${
      missing === 1
        ? "storia"
        : "storie"
    } e potrai conoscerla.`;


  message.classList.add(
    "show"
  );


  setTimeout(
    () => {

      message.classList.remove(
        "show"
      );

    },
    3000
  );

}


/* ============================================================
   INTERFACCIA / PROGRESSO
============================================================ */

function updateInterface() {

  const experience =
    getExperience();

  const level =
    getLevel();

  const storiesRead =
    state.readStories.length;


  /*
    HEADER
  */

  const headerLevel =
    document.getElementById(
      "header-level"
    );

  if (headerLevel) {

    headerLevel.textContent =
      String(level).padStart(2, "0");

  }


  const headerStories =
    document.getElementById(
      "header-stories"
    );

  if (headerStories) {

    headerStories.textContent =
      String(storiesRead).padStart(
        2,
        "0"
      );

  }


  /*
    LIVELLO PRINCIPALE
  */

  const experienceLevel =
    document.getElementById(
      "experience-level"
    );

  if (experienceLevel) {

    experienceLevel.textContent =
      String(level).padStart(
        2,
        "0"
      );

  }


  const experienceCurrent =
    document.getElementById(
      "experience-current"
    );

  if (experienceCurrent) {

    experienceCurrent.textContent =
      experience;

  }


  /*
    PROSSIMA STORIA
  */

  const nextRequirement =
    getNextExperienceRequirement();


  const nextElement =
    document.getElementById(
      "experience-next"
    );

  if (nextElement) {

    nextElement.textContent =
      nextRequirement;

  }


  /*
    BARRA

    Se siamo a 1/2:
    50%

    Se siamo a 2/3:
    66%

    ecc.
  */

  let progress = 100;


  if (
    nextRequirement >
    experience
  ) {

    progress =
      Math.min(
        100,
        (experience /
          nextRequirement) *
          100
      );

  }


  const experienceProgress =
    document.getElementById(
      "experience-progress"
    );

  if (experienceProgress) {

    experienceProgress.style.width =
      `${progress}%`;

  }


  const headerProgress =
    document.getElementById(
      "header-progress"
    );

  if (headerProgress) {

    headerProgress.style.width =
      `${progress}%`;

  }


  /*
    DOSSIER
  */

  const totalStories =
    document.getElementById(
      "total-stories"
    );

  if (totalStories) {

    totalStories.textContent =
      String(
        storieData.length
      ).padStart(
        2,
        "0"
      );

  }


  const knownStories =
    document.getElementById(
      "known-stories"
    );

  if (knownStories) {

    knownStories.textContent =
      String(
        storiesRead
      ).padStart(
        2,
        "0"
      );

  }


  /*
    RENDER CARD
  */

  renderStories();

}


/* ============================================================
   RANDOM STORY
============================================================ */

function openRandomStory() {

  /*
    Prima cerchiamo tra quelle
    effettivamente leggibili.
  */

  const availableStories =
    storieData.filter(
      story =>
        canOpenStory(story)
    );


  if (
    availableStories.length === 0
  ) {

    return;

  }


  /*
    Preferiamo una storia
    non ancora letta.
  */

  const unread =
    availableStories.filter(
      story =>
        !isStoryRead(story)
    );


  const pool =
    unread.length > 0
      ? unread
      : availableStories;


  const randomIndex =
    Math.floor(
      Math.random() *
      pool.length
    );


  openStory(
    pool[randomIndex]
  );

}


/* ============================================================
   FILTRI
============================================================ */

function setupFilters() {

  document
    .querySelectorAll(
      ".filter-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          currentFilter =
            button.dataset.filter;


          document
            .querySelectorAll(
              ".filter-btn"
            )
            .forEach(btn => {

              btn.classList.remove(
                "btn-red"
              );

              btn.classList.add(
                "btn-outline"
              );

            });


          button.classList.remove(
            "btn-outline"
          );

          button.classList.add(
            "btn-red"
          );


          renderStories();

        }
      );

    });

}


/* ============================================================
   REDACTED
============================================================ */

function attachRedactedListeners() {

  document
    .querySelectorAll(
      ".redacted"
    )
    .forEach(element => {

      element.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          element.classList.toggle(
            "revealed"
          );

        }
      );

    });

}


/* ============================================================
   UTILITY
============================================================ */

function stripHTML(html) {

  const temporary =
    document.createElement(
      "div"
    );

  temporary.innerHTML =
    html;

  return temporary.textContent ||
    temporary.innerText ||
    "";

}


/* ============================================================
   RESET PROGRESS
============================================================ */

/*
  Non è mostrato nell'interfaccia.

  Utile per te durante lo sviluppo.

  Da console del browser:

  resetIlariaProgress()

*/

window.resetIlariaProgress =
  function () {

    localStorage.removeItem(
      STORAGE_KEY
    );

    location.reload();

  };


/* ============================================================
   EVENT LISTENERS
============================================================ */

function setupEvents() {


  /*
    CHIUDI STORIA
  */

  document
    .getElementById(
      "modal-close"
    )
    .addEventListener(
      "click",
      closeStoryModal
    );


  /*
    CLICK FUORI DAL MODAL
  */

  document
    .getElementById(
      "story-modal"
    )
    .addEventListener(
      "click",
      event => {

        if (
          event.target.id ===
          "story-modal"
        ) {

          closeStoryModal();

        }

      }
    );


  /*
    ESC
  */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeStoryModal();

        closeWineModal();

      }

    }
  );


  /*
    VINO
  */

  document
    .getElementById(
      "wine-confirm"
    )
    .addEventListener(
      "click",
      unlockWineStory
    );


  document
    .getElementById(
      "wine-cancel"
    )
    .addEventListener(
      "click",
      closeWineModal
    );


  /*
    RANDOM
  */

  document
    .getElementById(
      "random-btn"
    )
    .addEventListener(
      "click",
      openRandomStory
    );


  document
    .getElementById(
      "random-btn-hero"
    )
    .addEventListener(
      "click",
      openRandomStory
    );


  document
    .getElementById(
      "random-btn-bottom"
    )
    .addEventListener(
      "click",
      openRandomStory
    );


  /*
    START READING
  */

  document
    .getElementById(
      "start-reading"
    )
    .addEventListener(
      "click",
      () => {

        const firstAvailable =
          storieData.find(
            story =>
              canOpenStory(story)
          );


        if (firstAvailable) {

          openStory(
            firstAvailable
          );

        }

      }
    );


  setupFilters();

}


/* ============================================================
   AVVIO
============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateInterface();

    setupEvents();

  }
);
