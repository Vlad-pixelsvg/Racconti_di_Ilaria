document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("stories-grid");
  const storyCount = document.getElementById("story-count");

  const modal = document.getElementById("story-modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");
  const modalOverlay = document.querySelector(".modal-overlay");

  const surpriseButton = document.getElementById("surprise-btn");
  const randomStoryButton = document.getElementById("random-story-button");

  const filterButtons = document.querySelectorAll(".filter-btn");

  let currentMood = "ALL";


  /* -----------------------------------------
     UTILITY
  ----------------------------------------- */

  function formatNumber(number) {
    return String(number).padStart(2, "0");
  }


  function moodClass(mood) {
    return mood.toLowerCase();
  }


  /* -----------------------------------------
     RENDER STORIES
  ----------------------------------------- */

  function renderStories() {

    const filteredStories =
      currentMood === "ALL"
        ? storieData
        : storieData.filter(story => story.mood === currentMood);

    grid.innerHTML = "";

    storyCount.textContent =
      formatNumber(filteredStories.length);


    if (!filteredStories.length) {

      grid.innerHTML = `
        <div class="empty-state">
          Non ci sono storie in questa categoria.
          <br><br>
          Probabilmente è meglio così.
        </div>
      `;

      return;
    }


    filteredStories.forEach((story, index) => {

      const card = document.createElement("article");

      card.className = "story-card";

      card.dataset.mood = story.mood;

      card.dataset.id = story.id;


      let statusHTML = "";

      if (story.status === "unlocked") {

        statusHTML = `
          <span class="read-story">
            LEGGI
            <span>→</span>
          </span>
        `;

      } else if (story.status === "locked_wine") {

        statusHTML = `
          <span class="story-lock">
            🍷 ACCESSO LIMITATO
          </span>
        `;

      } else {

        statusHTML = `
          <span class="story-lock">
            🔒 ACCESSO LIMITATO
          </span>
        `;
      }


      card.innerHTML = `

        <div class="card-top">

          <span class="card-number">
            STORY ${formatNumber(index + 1)}
          </span>

          <span class="card-mood">
            ${story.mood.toUpperCase()}
          </span>

        </div>


        <div class="card-content">

          <h3>
            ${story.title}
          </h3>

          <div class="card-abstract">
            ${story.abstract}
          </div>

        </div>


        <div class="card-bottom">

          <span class="card-category">
            ${story.category}
            ·
            ${story.readingTime}
          </span>

          ${statusHTML}

        </div>

      `;


      card.addEventListener("click", () => {
        openStory(story);
      });


      grid.appendChild(card);

    });


    initializeRedactions();

  }


  /* -----------------------------------------
     REDACTIONS
  ----------------------------------------- */

  function initializeRedactions() {

    const redactions = document.querySelectorAll(".redacted");

    redactions.forEach(redaction => {

      redaction.setAttribute("tabindex", "0");

      redaction.addEventListener("click", event => {

        event.stopPropagation();

        redaction.classList.toggle("revealed");

      });


      redaction.addEventListener("keydown", event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          redaction.classList.toggle("revealed");

        }

      });

    });

  }


  /* -----------------------------------------
     OPEN STORY
  ----------------------------------------- */

  function openStory(story) {

    if (story.status !== "unlocked") {

      renderLockedStory(story);

    } else {

      renderStory(story);

    }

    modal.classList.add("open");

    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

  }


  /* -----------------------------------------
     NORMAL STORY
  ----------------------------------------- */

  function renderStory(story) {

    const storyIndex =
      storieData.findIndex(item => item.id === story.id) + 1;


    const paragraphs = story.body
      .map(paragraph => `<p>${paragraph}</p>`)
      .join("");


    modalContent.innerHTML = `

      <div class="reader-meta">

        <span class="reader-number">
          STORY ${formatNumber(storyIndex)}
          ·
          ${story.category.toUpperCase()}
        </span>

        <span class="reader-mood">
          ${story.mood.toUpperCase()}
        </span>

      </div>


      <h1 class="reader-title">
        ${story.title}
      </h1>


      <p class="reader-intro">
        ${story.intro}
      </p>


      <div class="reader-divider"></div>


      <div class="reader-body">

        ${paragraphs}

      </div>


      <div class="reader-note">
        ${story.note}
      </div>


      <div class="reader-end">

        <span>
          FINE DELLA STORIA
        </span>

        <span>
          ${story.readingTime}
        </span>

      </div>

    `;


    initializeRedactions();

    modalContent.scrollTop = 0;

  }


  /* -----------------------------------------
     LOCKED STORY
  ----------------------------------------- */

  function renderLockedStory(story) {

    let requirement = "";

    if (story.status === "locked_wine") {

      requirement = `
        <span class="lock-requirement">
          🍷 ${story.wineRequired}
        </span>
      `;

    } else {

      requirement = `
        <span class="lock-requirement">
          🔒 ESPERIENZA RICHIESTA
        </span>
      `;

    }


    modalContent.innerHTML = `

      <div class="lock-screen">

        <div class="lock-symbol">
          ${story.status === "locked_wine" ? "🍷" : "?"}
        </div>

        <span class="eyebrow">
          ${story.category.toUpperCase()}
        </span>

        <h2>
          ${story.title}
        </h2>

        <p>
          ${story.abstract}
        </p>

        ${requirement}

        <p>
          Questa storia esiste.
          <br>
          Ma forse non è ancora il momento giusto.
        </p>

      </div>

    `;

  }


  /* -----------------------------------------
     CLOSE MODAL
  ----------------------------------------- */

  function closeStory() {

    modal.classList.remove("open");

    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

  }


  modalClose.addEventListener("click", closeStory);

  modalOverlay.addEventListener("click", closeStory);


  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeStory();
    }

  });


  /* -----------------------------------------
     FILTERS
  ----------------------------------------- */

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      currentMood = button.dataset.mood;


      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });


      button.classList.add("active");


      renderStories();


      document
        .getElementById("storie")
        .scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

    });

  });


  /* -----------------------------------------
     RANDOM STORY
  ----------------------------------------- */

  function randomStory() {

    const story =
      storieData[
        Math.floor(Math.random() * storieData.length)
      ];


    openStory(story);

  }


  surpriseButton.addEventListener(
    "click",
    randomStory
  );


  randomStoryButton.addEventListener(
    "click",
    randomStory
  );


  /* -----------------------------------------
     CURSOR
  ----------------------------------------- */

  const cursor =
    document.querySelector(".cursor-dot");


  if (cursor) {

    document.addEventListener("mousemove", event => {

      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;

    });

  }


  /* -----------------------------------------
     INITIALIZE
  ----------------------------------------- */

  renderStories();

});
