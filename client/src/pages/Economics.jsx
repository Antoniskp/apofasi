const economicsContent = {
  hero: {
    eyebrow: "Εκπαίδευση · Οικονομία",
    title: "Οικονομική παιδεία για πιο συνειδητές αποφάσεις",
    subtitle:
      "Η οικονομία επηρεάζει μισθούς, τιμές, δάνεια και τις δημόσιες υπηρεσίες. Με απλές έννοιες, μπορούμε να κατανοήσουμε πώς λειτουργεί και πώς μας επηρεάζει καθημερινά."
  },
  fundamentals: [
    {
      title: "Μικροοικονομία",
      description:
        "Μελετά αποφάσεις νοικοκυριών και επιχειρήσεων: προσφορά, ζήτηση, τιμές και ανταγωνισμό."
    },
    {
      title: "Μακροοικονομία",
      description:
        "Αφορά τη συνολική εικόνα: ΑΕΠ, ανεργία, πληθωρισμός, ανάπτυξη και οικονομικοί κύκλοι."
    },
    {
      title: "Δημόσια οικονομικά",
      description:
        "Φορολογία, δαπάνες, ελλείμματα/πλεονάσματα και πώς το κράτος χρηματοδοτεί πολιτικές."
    },
    {
      title: "Διεθνές εμπόριο",
      description:
        "Εισαγωγές/εξαγωγές, ισοζύγιο τρεχουσών συναλλαγών και πώς επηρεάζει το νόμισμα."
    }
  ],
  indicators: [
    "ΑΕΠ (GDP): η συνολική παραγωγή αγαθών και υπηρεσιών.",
    "Πληθωρισμός (HICP): ο ρυθμός μεταβολής των τιμών.",
    "Ανεργία: πόσο μεγάλο μέρος του εργατικού δυναμικού μένει εκτός αγοράς.",
    "Μισθοί & παραγωγικότητα: δείχνουν την αγοραστική δύναμη και την ανταγωνιστικότητα.",
    "Δημοσιονομικό ισοζύγιο & δημόσιο χρέος: το βάρος του κράτους στην οικονομία.",
    "Πιστωτικές συνθήκες: επιτόκια, πρόσβαση σε δάνεια, διαθέσιμη ρευστότητα.",
    "Δείκτες εμπιστοσύνης: επιχειρηματικές και καταναλωτικές προσδοκίες."
  ],
  euroPolicy: {
    title: "Ευρωζώνη & νομισματική πολιτική",
    body:
      "Η Ευρωπαϊκή Κεντρική Τράπεζα (ΕΚΤ) στοχεύει στη σταθερότητα τιμών και επηρεάζει την οικονομία μέσω επιτοκίων και εργαλείων ρευστότητας.",
    tools: [
      "Βασικά επιτόκια (κύρια αναχρηματοδότηση, αποδοχή καταθέσεων, οριακή χρηματοδότηση).",
      "Αγορές ομολόγων (APP/PEPP) για στήριξη ρευστότητας και μετάδοση πολιτικής.",
      "Πράξεις αναχρηματοδότησης (MRO/TLTRO) για δάνεια προς τράπεζες.",
      "Forward guidance: επικοινωνία για την πορεία της πολιτικής.",
      "Απαιτήσεις αποθεματικών και ρυθμιστικά εργαλεία."
    ],
    impact:
      "Οι αποφάσεις της ΕΚΤ επηρεάζουν επιτόκια δανείων, αποταμιεύσεις, επενδύσεις και τελικά τις τιμές."
  },
  liveEconomy: [
    {
      name: "ECB Statistical Data Warehouse",
      description: "Στατιστικά της ΕΚΤ για επιτόκια, νομισματικά μεγέθη και αγορές.",
      url: "https://sdw.ecb.europa.eu/",
      icon: "fa-solid fa-database"
    },
    {
      name: "ECB Key Interest Rates",
      description: "Επίσημα βασικά επιτόκια της ΕΚΤ σε πραγματικό χρόνο.",
      url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.en.html",
      icon: "fa-solid fa-percent"
    },
    {
      name: "Eurostat Data Browser",
      description: "Κεντρική βάση δεδομένων για ΑΕΠ, πληθωρισμό, ανεργία και άλλα.",
      url: "https://ec.europa.eu/eurostat/web/main/data/database",
      icon: "fa-solid fa-chart-line"
    },
    {
      name: "Euro area inflation (HICP)",
      description: "Τελευταία δεδομένα πληθωρισμού για την Ευρωζώνη.",
      url: "https://ec.europa.eu/eurostat/web/products-datasets/-/prc_hicp_manr",
      icon: "fa-solid fa-arrow-trend-up"
    },
    {
      name: "Euro area unemployment",
      description: "Στατιστικά ανεργίας ανά μήνα από τη Eurostat.",
      url: "https://ec.europa.eu/eurostat/web/products-datasets/-/une_rt_m",
      icon: "fa-solid fa-briefcase"
    },
    {
      name: "EURO STOXX 50",
      description: "Δείκτης μεγάλων ευρωπαϊκών εταιρειών και οικονομικού κλίματος.",
      url: "https://www.stoxx.com/index-details?symbol=SX5E",
      icon: "fa-solid fa-arrow-up-right-dots"
    }
  ],
  cryptoEducation: {
    title: "Κρυπτονομίσματα: βασικές έννοιες",
    body:
      "Τα κρυπτονομίσματα βασίζονται σε blockchain και διακινούνται χωρίς κεντρική τράπεζα. Είναι υψηλού ρίσκου, με μεγάλη μεταβλητότητα, αλλά έχουν χρήση σε πληρωμές, επενδύσεις και υποδομές Web3.",
    points: [
      "Ιδιωτικά κλειδιά & πορτοφόλια: η κατοχή του κλειδιού σημαίνει έλεγχο των κεφαλαίων.",
      "Μεταβλητότητα: οι τιμές αλλάζουν γρήγορα, άρα χρειάζεται διαχείριση ρίσκου.",
      "Stablecoins: ψηφιακά νομίσματα συνδεδεμένα με νόμισμα (π.χ. EUR/USD).",
      "Κανονιστικό πλαίσιο: στην ΕΕ εφαρμόζεται το MiCA με κανόνες για εκδότες/πλατφόρμες.",
      "Ασφάλεια: αποφυγή phishing, αξιόπιστα exchanges και χρήση 2FA."
    ]
  },
  liveCrypto: [
    {
      name: "Bitcoin (BTC/EUR)",
      description: "Ζωντανή ισοτιμία Bitcoin σε ευρώ.",
      url: "https://www.coingecko.com/en/coins/bitcoin/eur",
      icon: "fa-brands fa-bitcoin"
    },
    {
      name: "Ethereum (ETH/EUR)",
      description: "Ζωντανή ισοτιμία Ethereum σε ευρώ.",
      url: "https://www.coingecko.com/en/coins/ethereum/eur",
      icon: "fa-brands fa-ethereum"
    }
  ],
  whatElse: [
    "Δημογραφικές αλλαγές και αγορά εργασίας.",
    "Κλιματικός κίνδυνος και ενεργειακό κόστος.",
    "Γεωπολιτική και εφοδιαστικές αλυσίδες.",
    "Τεχνολογικές αλλαγές και παραγωγικότητα.",
    "Ισοζύγιο τρεχουσών συναλλαγών και συναλλαγματικές ισοτιμίες."
  ]
};

export default function Economics() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">{economicsContent.hero.eyebrow}</p>
          <h1>{economicsContent.hero.title}</h1>
          <p className="muted">{economicsContent.hero.subtitle}</p>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Τι είναι η οικονομία;</h2>
          <p className="section-lead">
            Η οικονομία εξετάζει πώς κατανέμουμε περιορισμένους πόρους. Από τις τιμές
            στο σούπερ μάρκετ μέχρι τα επιτόκια δανείων, όλα συνδέονται με βασικούς
            μηχανισμούς.
          </p>
        </div>
        <div className="grid-2">
          {economicsContent.fundamentals.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Κύριοι οικονομικοί δείκτες</h2>
          <p className="section-lead">
            Αυτοί οι δείκτες δείχνουν τη «θερμοκρασία» της οικονομίας και βοηθούν να
            καταλάβουμε πού κατευθύνεται.
          </p>
        </div>
        <ul className="feature-list">
          {economicsContent.indicators.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section emphasis-card">
        <h2 className="section-title">{economicsContent.euroPolicy.title}</h2>
        <p className="section-lead">{economicsContent.euroPolicy.body}</p>
        <ul className="feature-list">
          {economicsContent.euroPolicy.tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <p className="muted">{economicsContent.euroPolicy.impact}</p>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Ζωντανά δεδομένα & δείκτες</h2>
          <p className="section-lead">
            Επιλεγμένες αξιόπιστες πηγές για ενημερωμένα στοιχεία οικονομίας και
            αγορών.
          </p>
        </div>
        <div className="grid-3 resource-grid">
          {economicsContent.liveEconomy.map((resource) => (
            <a
              key={resource.name}
              className="card resource-card"
              href={resource.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className="resource-icon" aria-hidden>
                <i className={resource.icon} />
              </div>
              <div>
                <h3 className="resource-title">{resource.name}</h3>
                <p>{resource.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Ζωντανά widgets στην σελίδα</h2>
          <p className="section-lead">
            Ενσωματωμένα γραφήματα για να βλέπετε τις βασικές αγορές χωρίς να
            αποχωρήσετε από την πλατφόρμα.
          </p>
        </div>
        <div className="responsive-card-grid">
          <div className="card embed-card">
            <div className="embed-header">
              <h3>EURO STOXX 50</h3>
              <p className="muted small">Δείκτης μεγάλων εταιρειών της Ευρωζώνης.</p>
            </div>
            <div className="embed-frame">
              <iframe
                title="EURO STOXX 50 chart"
                src="https://www.tradingview.com/widgetembed/?symbol=INDEX%3ASX5E&interval=60&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&theme=light&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1&enabledetails=1&hidevolume=1"
                loading="lazy"
                allow="transparency"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </div>
          <div className="card embed-card">
            <div className="embed-header">
              <h3>Bitcoin / EUR</h3>
              <p className="muted small">Ζωντανή ισοτιμία BTC σε ευρώ.</p>
            </div>
            <div className="embed-frame">
              <iframe
                title="Bitcoin to EUR chart"
                src="https://www.tradingview.com/widgetembed/?symbol=BINANCE%3ABTCEUR&interval=60&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&theme=light&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1&enabledetails=1&hidevolume=1"
                loading="lazy"
                allow="transparency"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </div>
          <div className="card embed-card">
            <div className="embed-header">
              <h3>Ethereum / EUR</h3>
              <p className="muted small">Ζωντανή ισοτιμία ETH σε ευρώ.</p>
            </div>
            <div className="embed-frame">
              <iframe
                title="Ethereum to EUR chart"
                src="https://www.tradingview.com/widgetembed/?symbol=BINANCE%3AETHEUR&interval=60&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&theme=light&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1&enabledetails=1&hidevolume=1"
                loading="lazy"
                allow="transparency"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{economicsContent.cryptoEducation.title}</h2>
          <p className="section-lead">{economicsContent.cryptoEducation.body}</p>
        </div>
        <ul className="feature-list">
          {economicsContent.cryptoEducation.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Ζωντανές ισοτιμίες κρυπτονομισμάτων</h2>
          <p className="section-lead">
            Παρακολουθήστε τις ισοτιμίες Bitcoin και Ethereum σε ευρώ από αξιόπιστες
            πηγές δεδομένων.
          </p>
        </div>
        <div className="grid-2 resource-grid">
          {economicsContent.liveCrypto.map((resource) => (
            <a
              key={resource.name}
              className="card resource-card"
              href={resource.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className="resource-icon" aria-hidden>
                <i className={resource.icon} />
              </div>
              <div>
                <h3 className="resource-title">{resource.name}</h3>
                <p>{resource.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section emphasis-card">
        <h2 className="section-title">Τι άλλο να παρακολουθείτε</h2>
        <p className="section-lead">
          Αν θέλετε πιο ολοκληρωμένη εικόνα για την οικονομία, αξίζει να έχετε στο
          ραντάρ και τα παρακάτω.
        </p>
        <ul className="feature-list">
          {economicsContent.whatElse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
