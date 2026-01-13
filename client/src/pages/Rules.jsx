const rulesContent = {
  hero: {
    eyebrow: "Κανόνες",
    title: "Κανόνες Κοινότητας",
    subtitle:
      "Οι κατευθυντήριες γραμμές που διασφαλίζουν έναν υγιή και εποικοδομητικό διάλογο στην κοινότητά μας."
  },
  rules: [
    "Σέβομαι τις διαφορετικές απόψεις και αποφεύγω τις προσωπικές επιθέσεις",
    "Αποφεύγω το spam και τις επαναλαμβανόμενες αναρτήσεις χωρίς περιεχόμενο",
    "Χρησιμοποιώ επιχειρήματα που βασίζονται σε γεγονότα και όχι σε fake news",
    "Προσπαθώ να καταλαβαίνω την άποψη των άλλων πριν απαντήσω",
    "Δεν μοιράζομαι ευαίσθητα προσωπικά δεδομένα άλλων χρηστών",
    "Αναφέρω περιεχόμενο που παραβιάζει τους κανόνες στους διαχειριστές"
  ],
  encouraged: [
    "Να συμμετέχετε σε εποικοδομητικές συζητήσεις με σεβασμό",
    "Να παρέχετε πηγές και στοιχεία για τις απόψεις σας",
    "Να κάνετε ερωτήσεις που βοηθούν στην κατανόηση",
    "Να μοιράζεστε ιδέες που ενισχύουν τη δημοκρατική συμμετοχή",
    "Να συνεισφέρετε στη βελτίωση της πλατφόρμας με feedback",
    "Να βοηθάτε νέους χρήστες να κατανοήσουν τον τρόπο λειτουργίας"
  ]
};

export default function Rules() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">{rulesContent.hero.eyebrow}</p>
          <h1>{rulesContent.hero.title}</h1>
          <p className="muted">{rulesContent.hero.subtitle}</p>
        </div>
      </header>

      <section className="section">
        <div className="card">
          <h2>Κανόνες</h2>
          <ul className="list">
            {rulesContent.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <h2>Τι ενθαρρύνουμε</h2>
          <ul className="list">
            {rulesContent.encouraged.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
