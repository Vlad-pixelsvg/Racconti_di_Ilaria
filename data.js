const storieData = [

  {
    id: "DOC-01",

    title: "Palinsesti serali e maratone d'azione",

    category: "Cinema & TV",

    mood: "Nostalgico",

    access: {
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
        Ci sono persone che hanno una playlist per ogni momento
        della propria vita.
        Io ho sempre avuto qualcosa di simile con le serie TV.
      </p>

      <p>
        Alcuni titoli sono diventati quasi dei punti di riferimento.
        Non importa quante volte li abbia già visti:
        quando ricompaiono sullo schermo è come tornare
        in un posto che conosco.
      </p>

      <p>
        <span class="redacted">Criminal Minds</span>
        è probabilmente uno degli esempi più evidenti.
        Non saprei dire quante volte abbia seguito
        quelle indagini.
      </p>

      <p>
        Poi ci sono i film.
        Quelli che scegli quando vuoi stare tranquilla
        e quelli che scegli quando invece vuoi semplicemente
        vedere qualcosa esplodere.
      </p>

      <p>
        In qualche modo, credo che i miei gusti televisivi
        dicano parecchio di me.
      </p>
    `
  },


  {
    id: "DOC-02",

    title: "La volta che ho confuso Marco con il cameriere",

    category: "Relazioni",

    mood: "Vergognoso",

    access: {
      type: "free"
    },

    readingTime: "4 min",

    abstract: `
      È successo a <span class="redacted">Bologna</span>
      nel 2022.
      Credevo mi stesse portando il conto,
      invece voleva il mio numero.
    `,

    content: `
      <p>
        Questa è una di quelle storie che racconti soltanto
        dopo aver verificato almeno tre volte
        che la persona coinvolta non sia nella stanza.
      </p>

      <p>
        Era il 2022.
        Ero a <span class="redacted">Bologna</span>
        e quella che sembrava una normalissima serata
        ha deciso di trasformarsi in una delle situazioni
        più imbarazzanti che mi siano mai capitate.
      </p>

      <p>
        Lui si avvicina.
        Io penso che sia un cameriere.
      </p>

      <p>
        Il problema è che non era un cameriere.
      </p>

      <p>
        E la cosa peggiore è che me ne sono accorta
        soltanto dopo avergli risposto come se mi stesse
        chiedendo cosa volessi ordinare.
      </p>

      <p>
        Alla fine voleva il mio numero.
        Io avrei preferito ricevere direttamente il conto.
      </p>
    `
  },


  {
    id: "DOC-03",

    title: "Perché non parlo mai del mio primo lavoro",

    category: "Carriera",

    mood: "Cinico",

    access: {
      type: "experience",
      required: 2
    },

    readingTime: "6 min",

    abstract: `
      Un resoconto sugli errori commessi quando non sapevo
      ancora come ci si difende in un ufficio.
    `,

    content: `
      <p>
        Prima di imparare come funzionano davvero
        certe dinamiche lavorative,
        ero convinta che bastasse fare bene il proprio lavoro.
      </p>

      <p>
        Spoiler:
        non basta.
      </p>

      <p>
        Il mio primo lavoro mi ha insegnato una quantità
        sorprendente di cose che nessun manuale avrebbe
        potuto spiegarmi.
      </p>

      <p>
        Ho imparato a riconoscere una promessa vaga.
        Ho imparato la differenza tra una richiesta urgente
        e una richiesta semplicemente organizzata male.
      </p>

      <p>
        E soprattutto ho imparato che la frase
        "siamo tutti una famiglia"
        dovrebbe probabilmente far scattare
        qualche campanello d'allarme.
      </p>
    `
  },


  {
    id: "DOC-04",

    title: "La verità sulla serata a Londra",

    category: "Memorie",

    mood: "Impulsivo",

    access: {
      type: "wine",
      required: 1
    },

    wineRequired: "1 bicchiere",

    readingTime: "8 min",

    abstract: `
      Dettagli che possono essere confessati soltanto
      dopo una certa ora e il giusto livello di alcol.
    `,

    content: `
      <p>
        Cominciamo col dire che quella sera
        nessuno aveva intenzione di fare qualcosa di memorabile.
      </p>

      <p>
        Ed è probabilmente proprio questo il motivo
        per cui è finita così.
      </p>

      <p>
        Eravamo a <span class="redacted">Londra</span>.
        Avevamo bevuto qualcosa.
        Poi qualcos'altro.
      </p>

      <p>
        A un certo punto qualcuno ha avuto un'idea.
        Una pessima idea.
      </p>

      <p>
        Io, invece di fermarlo,
        ho deciso che era una buona idea partecipare.
      </p>

      <p>
        Non entrerò nei dettagli senza prima aver verificato
        che questo racconto sia effettivamente destinato
        a persone di cui mi fido.
      </p>

      <p>
        Diciamo soltanto che il giorno dopo
        abbiamo ricostruito gli eventi attraverso fotografie,
        messaggi e testimonianze incrociate.
      </p>

      <p>
        E no.
        Non è una metafora.
      </p>
    `
  },


  {
    id: "DOC-05",

    title: "La cosa che non avrei dovuto comprare",

    category: "Decisioni",

    mood: "Impulsivo",

    access: {
      type: "experience",
      required: 3
    },

    readingTime: "5 min",

    abstract: `
      Un acquisto completamente irrazionale,
      seguito da una settimana passata a convincermi
      che fosse assolutamente necessario.
    `,

    content: `
      <p>
        Tutto è cominciato con la frase:
        "Costa poco, quindi al massimo..."
      </p>

      <p>
        Non esiste frase più pericolosa.
      </p>

      <p>
        Dopo circa venti minuti avevo già fatto l'acquisto.
      </p>

      <p>
        Nei giorni successivi ho costruito una quantità
        impressionante di giustificazioni per dimostrare
        che quella cosa mi serviva davvero.
      </p>

      <p>
        Non mi serviva.
      </p>

      <p>
        Però ormai era mia.
      </p>
    `
  },


  {
    id: "DOC-06",

    title: "Una sera che doveva essere tranquilla",

    category: "Memorie",

    mood: "Vergognoso",

    access: {
      type: "experience",
      required: 4
    },

    readingTime: "7 min",

    abstract: `
      Una serata normale, un gruppo di persone
      e una decisione che sembrava innocua.
    `,

    content: `
      <p>
        La cosa divertente è che avevo promesso
        a me stessa che quella sera sarei stata tranquilla.
      </p>

      <p>
        Nessuna decisione improvvisa.
        Nessuna situazione strana.
        A casa presto.
      </p>

      <p>
        Ovviamente non è andata così.
      </p>

      <p>
        Il resto della storia coinvolge
        <span class="redacted">una persona</span>,
        <span class="redacted">un messaggio</span>
        e una quantità discutibile di fiducia.
      </p>
    `
  },


  {
    id: "DOC-07",

    title: "Quella telefonata alle due di notte",

    category: "Confessioni",

    mood: "Nostalgico",

    access: {
      type: "wine",
      required: 1
    },

    wineRequired: "1 bicchiere",

    readingTime: "9 min",

    abstract: `
      Una telefonata arrivata nel momento peggiore possibile.
      O forse in quello giusto.
    `,

    content: `
      <p>
        Erano circa le due di notte.
      </p>

      <p>
        Il telefono ha iniziato a squillare.
      </p>

      <p>
        Per qualche secondo ho pensato di ignorarlo.
      </p>

      <p>
        Poi ho visto chi stava chiamando.
      </p>

      <p>
        E ho capito immediatamente che quella notte
        non sarebbe finita come avevo previsto.
      </p>

      <p>
        Il resto preferisco raccontarlo davanti a un bicchiere.
      </p>
    `
  }

];
