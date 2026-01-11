const greekLawSystemContent = {
  hero: {
    eyebrow: "Ελληνικό νομικό σύστημα",
    title: "Πώς είναι δομημένη η νομοθεσία και πού να βρείτε τις σωστές πηγές",
    subtitle:
      "Ο παρακάτω οδηγός βοηθά τους πολίτες να κατανοήσουν τη δομή του δικαίου στην Ελλάδα, να εντοπίζουν τους νόμους που τους αφορούν και να χρησιμοποιούν αξιόπιστες πηγές πληροφόρησης."
  },
  structure: [
    {
      title: "Σύνταγμα",
      description:
        "Αποτελεί τον ανώτερο κανόνα δικαίου. Καθορίζει τις αρχές του κράτους, τα δικαιώματα των πολιτών και τη λειτουργία των θεσμών."
    },
    {
      title: "Νόμοι & Κώδικες",
      description:
        "Ψηφίζονται από τη Βουλή και οργανώνονται σε θεματικούς κώδικες (π.χ. Αστικός, Ποινικός) για να είναι πιο εύχρηστοι."
    },
    {
      title: "Κανονιστικές πράξεις",
      description:
        "Προεδρικά Διατάγματα, Υπουργικές Αποφάσεις και εγκύκλιοι εξειδικεύουν την εφαρμογή των νόμων."
    },
    {
      title: "Νομολογία",
      description:
        "Οι αποφάσεις των δικαστηρίων ερμηνεύουν τους νόμους και δημιουργούν πρακτικά παραδείγματα εφαρμογής."
    },
    {
      title: "Ευρωπαϊκό δίκαιο",
      description:
        "Κανονισμοί, οδηγίες και αποφάσεις της ΕΕ έχουν άμεση ή έμμεση ισχύ στην Ελλάδα και συχνά υπερισχύουν."
    }
  ],
  institutions: [
    {
      title: "Βουλή των Ελλήνων",
      description:
        "Θεσπίζει και τροποποιεί νόμους, ελέγχει την κυβέρνηση και δημοσιεύει νομοθετικές πρωτοβουλίες."
    },
    {
      title: "Κυβέρνηση & Υπουργεία",
      description:
        "Εφαρμόζουν τους νόμους μέσω κανονιστικών πράξεων και εκδίδουν οδηγίες για την πράξη."
    },
    {
      title: "Δικαστήρια",
      description:
        "Ερμηνεύουν τη νομοθεσία, επιλύουν διαφορές και διαμορφώνουν νομολογία."
    },
    {
      title: "Ανεξάρτητες αρχές",
      description:
        "Εποπτεύουν ειδικούς τομείς (π.χ. προστασία δεδομένων, ανταγωνισμός) και εκδίδουν αποφάσεις."
    }
  ],
  howToFind: {
    title: "Πώς να βρείτε τον νόμο που σας ενδιαφέρει",
    steps: [
      "Ξεκινήστε από το αντικείμενο (π.χ. εργασία, μίσθωση, υγεία) και αναζητήστε τον σχετικό κώδικα ή νόμο.",
      "Ελέγξτε το ΦΕΚ για το επίσημο κείμενο και τις τελευταίες τροποποιήσεις.",
      "Διασταυρώστε εγκυκλίους και υπουργικές αποφάσεις που εξηγούν την εφαρμογή.",
      "Αναζητήστε σχετική νομολογία για να δείτε πώς εφαρμόζεται στην πράξη.",
      "Για ευρωπαϊκά ζητήματα, ελέγξτε κανονισμούς και οδηγίες στο EUR-Lex."
    ]
  },
  resources: [
    {
      name: "Εθνικό Τυπογραφείο (ΦΕΚ)",
      description: "Το επίσημο σημείο δημοσίευσης νόμων, διαταγμάτων και πράξεων.",
      url: "https://www.et.gr/",
      icon: "fa-solid fa-file-lines"
    },
    {
      name: "Διαύγεια",
      description: "Υποχρεωτική δημοσίευση διοικητικών πράξεων όλων των φορέων.",
      url: "https://diavgeia.gov.gr/",
      icon: "fa-solid fa-magnifying-glass"
    },
    {
      name: "Βουλή των Ελλήνων",
      description: "Νομοθετικές πρωτοβουλίες, πρακτικά συνεδριάσεων και πληροφορίες για τους νόμους.",
      url: "https://www.hellenicparliament.gr/",
      icon: "fa-solid fa-landmark"
    },
    {
      name: "gov.gr",
      description: "Επίσημη πύλη του κράτους για υπηρεσίες, οδηγούς και διαδικασίες.",
      url: "https://www.gov.gr/",
      icon: "fa-solid fa-globe"
    },
    {
      name: "Άρειος Πάγος",
      description: "Αναζήτηση αποφάσεων του Αρείου Πάγου για νομολογία ανωτάτου δικαστηρίου.",
      url: "https://www.areiospagos.gr/",
      icon: "fa-solid fa-scale-balanced"
    },
    {
      name: "Συμβούλιο της Επικρατείας",
      description: "Αποφάσεις και ανακοινώσεις του ανώτατου διοικητικού δικαστηρίου.",
      url: "https://www.ste.gr/",
      icon: "fa-solid fa-building-columns"
    },
    {
      name: "EUR-Lex",
      description: "Η βάση δεδομένων της ΕΕ για κανονισμούς, οδηγίες και νομολογία.",
      url: "https://eur-lex.europa.eu/",
      icon: "fa-solid fa-circle-stars"
    }
  ],
  note: {
    title: "Χρήσιμη υπενθύμιση",
    body:
      "Οι πηγές που παρατίθενται προσφέρουν επίσημη ενημέρωση, αλλά δεν υποκαθιστούν εξατομικευμένη νομική συμβουλή. Για σύνθετες υποθέσεις απευθυνθείτε σε δικηγόρο."
  }
};

export default function GreekLawSystem() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">{greekLawSystemContent.hero.eyebrow}</p>
          <h1>{greekLawSystemContent.hero.title}</h1>
          <p className="muted">{greekLawSystemContent.hero.subtitle}</p>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Δομή του ελληνικού δικαίου</h2>
          <p className="section-lead">
            Η νομοθεσία οργανώνεται ιεραρχικά ώστε να υπάρχει σαφήνεια για το τι υπερισχύει και
            ποιος κανόνας εφαρμόζεται.
          </p>
        </div>
        <div className="grid-2">
          {greekLawSystemContent.structure.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Οι βασικοί θεσμοί</h2>
          <p className="section-lead">
            Οι θεσμοί της πολιτείας συνεργάζονται για τη δημιουργία, εφαρμογή και ερμηνεία της
            νομοθεσίας.
          </p>
        </div>
        <div className="grid-2">
          {greekLawSystemContent.institutions.map((item) => (
            <div key={item.title} className="card muted-border">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{greekLawSystemContent.howToFind.title}</h2>
          <p className="section-lead">
            Ακολουθήστε τα παρακάτω βήματα για να εντοπίζετε γρήγορα την πιο επίσημη και πρόσφατη
            πληροφορία.
          </p>
        </div>
        <ul className="feature-list">
          {greekLawSystemContent.howToFind.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Κύριες πηγές για νόμους και νομικά θέματα</h2>
          <p className="section-lead">
            Οι παρακάτω σύνδεσμοι είναι οι πιο χρήσιμοι για επίσημα κείμενα, διοικητικές πράξεις
            και νομολογία.
          </p>
        </div>
        <div className="grid-3 resource-grid">
          {greekLawSystemContent.resources.map((resource) => (
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
        <h2 className="section-title">{greekLawSystemContent.note.title}</h2>
        <p className="section-lead">{greekLawSystemContent.note.body}</p>
      </section>
    </div>
  );
}
