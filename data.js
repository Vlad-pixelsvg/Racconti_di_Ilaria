const storieData = [

  {
    id: "DOC-01",

    title: "Palinsesti serali e maratone d'azione",

    category: "Cinema & TV",

    mood: "Nostalgico",

    status: "unlocked",

    requirement: {
      type: "free"
    },

    readingTime: "5 min",

    abstract: `
      I miei punti fermi sullo schermo:
      la profilazione di <span class="redacted">Criminal Minds</span>,
      l'antropologia di <span class="redacted">Bones</span>
      e le indagini di <span class="redacted">CSI: Scena del crimine</span>.
      Sul fronte film, l'equilibrio oscilla tra la dolcezza de
      <span class="redacted">L'amore non va in vacanza</span>
      e l'adrenalina pura di
      <span class="redacted">Fast & Furious</span>
      e <span class="redacted">John Wick</span>.
    `,

    content: `
      <p>
        Ci sono cose che non considero semplicemente programmi televisivi.
        Sono diventate una specie di compagnia.
      </p>

      <p>
        Per molto tempo i miei punti fermi sono stati
        <span class="redacted">Criminal Minds</span>,
        <span class="redacted">Bones</span> e
        <span class="redacted">CSI: Scena del crimine</span>.
      </p>

      <p>
        Poi ci sono i film.
        Da una parte la dolcezza de
        <span class="redacted">L'amore non va in vacanza</span>.
        Dall'altra <span class="redacted">Fast & Furious</span>
        e <span class="redacted">John Wick</span>.
      </p>

      <p>
        Non è necessariamente buon gusto.
        È semplicemente parte di me.
      </p>
    `
  },


  {
    id: "DOC-02",

    title: "La volta che ho confuso <span class='redacted'>Marco</span> con il cameriere",

    category: "Relazioni",

    mood: "Vergognoso",

    status: "unlocked",

    requirement: {
      type: "free"
    },

    readingTime: "4 min",

    abstract: `
      È successo a <span class="redacted">Bologna</span> nel 2022.
      Credevo mi stesse portando il conto,
      invece voleva il mio numero.
    `,

    content: `
      <p>
        È successo a <span class="redacted">Bologna</span> nel 2022.
      </p>

      <p>
        Ero convinta che la persona che si stava avvicinando
        al tavolo fosse il cameriere.
      </p>

      <p>
        Quindi, con assoluta naturalezza,
        ho iniziato a chiedere informazioni sul conto.
      </p>

      <p>
        Il problema è che non era il cameriere.
      </p>

      <p>
        Era <span class="redacted">Marco</span>.
      </p>

      <p>
        E voleva il mio numero.
      </p>
    `
  },


  {
    id: "DOC-03",

    title: "Perché non parlo mai del mio primo lavoro",

    category: "Carriera",

    mood: "Cinico",

    status: "locked_inexperience",

    requirement: {
      type: "experience",
      amount: 2
    },

    readingTime: "6 min",

    abstract: `
      Un resoconto sugli errori commessi quando non sapevo ancora
      come ci si difende in un ufficio.
    `,

    content: `
      <p>
        Il primo lavoro ti insegna moltissime cose.
      </p>

      <p>
        Alcune sono quelle che ti aspetti.
        Altre assolutamente no.
      </p>

      <p>
        Pensavo che essere disponibili significasse dire sempre sì.
        Pensavo che impegnarsi molto fosse sufficiente.
      </p>

      <p>
        Non lo era.
      </p>

      <p>
        Ho imparato che esistono confini,
        persone difficili e conversazioni
        che devi imparare ad affrontare.
      </p>
    `
  },


  {
    id: "DOC-04",

    title: "La verità sulla serata a Londra",

    category: "Memorie",

    mood: "Impulsivo",

    status: "locked_wine",

    requirement: {
      type: "wine",
      amount: 1
    },

    wineRequired: "1 Calice di Rosso",

    readingTime: "8 min",

    abstract: `
      Dettagli che possono essere confessati soltanto dopo
      una certa ora e il giusto livello di alcol.
    `,

    content: `
      <p>
        Londra.
      </p>

      <p>
        Una sera che doveva essere tranquilla
        e che ha preso una direzione completamente diversa.
      </p>

      <p>
        C'erano musica, persone e decisioni
        che sembravano ottime in quel momento.
      </p>

      <p>
        E poi c'era una quantità discutibile di
        <span class="redacted">vino rosso</span>.
      </p>

      <p>
        Il resto preferisco raccontarlo davanti a un bicchiere.
      </p>
    `
  },


  {
    id: "DOC-05",

    title: "Una cosa che non ammetterò facilmente",

    category: "Confessioni",

    mood: "Vergognoso",

    status: "locked_inexperience",

    requirement: {
      type: "experience",
      amount: 4
    },

    readingTime: "7 min",

    abstract: `
      Per arrivare qui bisogna aver già letto abbastanza di me.
    `,

    content: `
      <p>
        Questa è una di quelle storie che non racconterei
        alla prima persona che incontro.
      </p>

      <p>
        Non perché sia particolarmente grave.
      </p>

      <p>
        Semplicemente perché dice qualcosa di me
        che normalmente preferisco nascondere.
      </p>

      <p>
        Ho passato molto tempo a cercare di sembrare
        più sicura di quanto fossi realmente.
      </p>
    `
  },


  {
    id: "DOC-06",

    title: "Quella volta in cui avrei dovuto stare zitta",

    category: "Aneddoti",

    mood: "Cinico",

    status: "locked_inexperience",

    requirement: {
      type: "experience",
      amount: 6
    },

    readingTime: "5 min",

    abstract: `
      Una frase detta nel momento sbagliato
      può diventare una storia per anni.
    `,

    content: `
      <p>
        Ci sono momenti in cui il cervello dovrebbe
        semplicemente premere il pulsante pausa.
      </p>

      <p>
        Il mio, quel giorno, evidentemente non lo trovava.
      </p>

      <p>
        Ho detto esattamente quello che pensavo.
      </p>

      <p>
        Era sincero.
        Era spontaneo.
        Era completamente fuori luogo.
      </p>

      <p>
        Il silenzio successivo è ancora oggi
        uno dei silenzi più lunghi che ricordi.
      </p>
    `
  },


  {
    id: "DOC-07",

    title: "La storia che non avevo intenzione di raccontare",

    category: "Confessioni",

    mood: "Nostalgico",

    status: "locked_inexperience",

    requirement: {
      type: "experience",
      amount: 10
    },

    readingTime: "10 min",

    abstract: `
      Alcune storie diventano più facili da raccontare
      con il tempo.
    `,

    content: `
      <p>
        Alcune persone entrano nella nostra vita
        senza che ce ne accorgiamo immediatamente.
      </p>

      <p>
        Poi, quando guardiamo indietro,
        ci rendiamo conto che hanno lasciato una traccia
        molto più grande di quanto pensassimo.
      </p>

      <p>
        Questa è una di quelle storie.
      </p>

      <p>
        E probabilmente è anche quella che racconta meglio
        perché esiste questa raccolta.
      </p>
    `
  },


  {
    id: "DOC-08",

    title: "Questa forse è meglio con due bicchieri",

    category: "Segreti",

    mood: "Impulsivo",

    status: "locked_wine",

    requirement: {
      type: "wine",
      amount: 2
    },

    readingTime: "12 min",

    abstract: `
      Non tutte le storie sono fatte per essere raccontate
      al primo bicchiere.
    `,

    content: `
      <p>
        Un bicchiere può aiutare a iniziare una conversazione.
      </p>

      <p>
        Due possono aiutare a finirla.
      </p>

      <p>
        Questa storia appartiene decisamente
        alla seconda categoria.
      </p>

      <p>
        Non ci sono grandi misteri.
        Soltanto una serie di decisioni discutibili,
        una notte molto lunga e una persona che,
        probabilmente, non avrebbe dovuto essere lì.
      </p>
    `
  }

];
