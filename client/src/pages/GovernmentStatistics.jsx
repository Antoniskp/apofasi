const governmentStatisticsContent = {
  hero: {
    eyebrow: "Στατιστικά Δημοσίου",
    title: "Πώς αποτυπώνεται το μέγεθος του ελληνικού κράτους",
    subtitle:
      "Συνοπτική εικόνα για το ανθρώπινο δυναμικό, τη διοικητική διάρθρωση και βασικούς αριθμούς που περιγράφουν τη λειτουργία της δημόσιας διοίκησης."
  },
  publicServants: [
    {
      title: "Δημόσιοι υπάλληλοι",
      value: "≈ 670.000",
      description:
        "Ενδεικτικός αριθμός μόνιμων και συμβασιούχων εργαζομένων σε κεντρική διοίκηση, ΟΤΑ και δημόσιους φορείς."
    },
    {
      title: "Μερίδιο στον πληθυσμό",
      value: "≈ 6-7%",
      description:
        "Αναλογία δημοσίων υπαλλήλων επί του συνολικού πληθυσμού (περίπου 6 έως 7 άτομα ανά 100 κατοίκους)."
    },
    {
      title: "Μερίδιο στην απασχόληση",
      value: "≈ 12-14%",
      description:
        "Ποσοστό δημοσίων υπαλλήλων στο ενεργό εργατικό δυναμικό, υπολογισμένο ως κλάσμα της συνολικής απασχόλησης."
    }
  ],
  clergy: [
    {
      title: "Ιερείς",
      value: "≈ 10.000",
      description:
        "Ενδεικτικός αριθμός εφημερίων και λοιπών κληρικών που μισθοδοτούνται ή υπηρετούν σε ενορίες και μητροπόλεις."
    },
    {
      title: "Μερίδιο στον πληθυσμό",
      value: "≈ 0,1%",
      description:
        "Αναλογία ιερέων ως προς τον συνολικό πληθυσμό, περίπου 1 ανά 1.000 κατοίκους."
    },
    {
      title: "Μερίδιο στην απασχόληση",
      value: "≈ 0,2%",
      description:
        "Ποσοστό του κλήρου επί της συνολικής απασχόλησης, ενδεικτικά κάτω από 1 στους 500 εργαζόμενους."
    }
  ],
  salaries: [
    {
      title: "Μέσος καθαρός μισθός δημοσίου",
      value: "≈ €1.050-€1.250",
      description:
        "Ενδεικτικό εύρος μηνιαίων καθαρών αποδοχών, με διαφοροποίηση ανά βαθμίδα, προϋπηρεσία και ειδικότητα."
    },
    {
      title: "Μέσος καθαρός μισθός ιερέων",
      value: "≈ €900-€1.100",
      description:
        "Ενδεικτικές μηνιαίες αποδοχές κληρικών που μισθοδοτούνται από το δημόσιο, με διαφοροποιήσεις ανά έτη υπηρεσίας."
    },
    {
      title: "Επίδραση επιδομάτων",
      value: "Μεταβλητή",
      description:
        "Επιδόματα, οικογενειακή κατάσταση και πρόσθετες παροχές μπορούν να ανεβάσουν ή να μειώσουν το τελικό καθαρό ποσό."
    }
  ],
  governance: [
    {
      title: "Διοικητική δομή",
      description:
        "13 περιφέρειες και 332 δήμοι συγκροτούν την τοπική αυτοδιοίκηση, με αποκεντρωμένες αρμοδιότητες και δικά τους συμβούλια."
    },
    {
      title: "Δημόσιο χρέος",
      description:
        "Το χρέος της γενικής κυβέρνησης κινείται σταθερά πάνω από το 150% του ΑΕΠ, επηρεάζοντας τον σχεδιασμό πολιτικής και επενδύσεων."
    },
    {
      title: "Κοινωνικές δαπάνες",
      description:
        "Υγεία, παιδεία και κοινωνική προστασία απορροφούν το μεγαλύτερο μέρος των πρωτογενών δαπανών του κράτους."
    },
    {
      title: "Ψηφιακές υπηρεσίες",
      description:
        "Το gov.gr συγκεντρώνει πάνω από 1.500 υπηρεσίες, μειώνοντας χρόνο και κόστος εξυπηρέτησης πολιτών."
    }
  ],
  notes: [
    "Τα μεγέθη είναι ενδεικτικά και χρησιμοποιούνται για εκπαιδευτικούς σκοπούς.",
    "Οι αναλογίες διαφοροποιούνται ανάλογα με το έτος, τη μέθοδο μέτρησης και την πηγή.",
    "Οι αποδοχές βασίζονται σε τυπικά κλιμάκια και δεν αντικαθιστούν επίσημους πίνακες μισθοδοσίας.",
    "Για επίσημα στοιχεία, προτείνεται αναζήτηση σε ΕΛΣΤΑΤ, ΑΑΔΕ, Υπουργείο Εσωτερικών και Υπουργείο Παιδείας & Θρησκευμάτων."
  ]
};

export default function GovernmentStatistics() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">{governmentStatisticsContent.hero.eyebrow}</p>
          <h1>{governmentStatisticsContent.hero.title}</h1>
          <p className="muted">{governmentStatisticsContent.hero.subtitle}</p>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Ανθρώπινο δυναμικό του δημοσίου</h2>
          <p className="section-lead">
            Τα παρακάτω μεγέθη αποτυπώνουν πόσο μεγάλο είναι το ανθρώπινο αποτύπωμα του κράτους
            σε σχέση με τον πληθυσμό και την απασχόληση.
          </p>
        </div>
        <div className="grid-3">
          {governmentStatisticsContent.publicServants.map((stat) => (
            <div key={stat.title} className="card">
              <p className="eyebrow">{stat.title}</p>
              <h3>{stat.value}</h3>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Στατιστικά κλήρου</h2>
          <p className="section-lead">
            Συνοπτικά μεγέθη για τους ιερείς σε σχέση με τον πληθυσμό και την εργασία στην Ελλάδα.
          </p>
        </div>
        <div className="grid-3">
          {governmentStatisticsContent.clergy.map((stat) => (
            <div key={stat.title} className="card">
              <p className="eyebrow">{stat.title}</p>
              <h3>{stat.value}</h3>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Μισθολογικές ενδείξεις</h2>
          <p className="section-lead">
            Ενδεικτικά εύρη αποδοχών για δημόσιους υπαλλήλους και ιερείς που μισθοδοτούνται
            από το κράτος.
          </p>
        </div>
        <div className="grid-3">
          {governmentStatisticsContent.salaries.map((stat) => (
            <div key={stat.title} className="card muted-border">
              <p className="eyebrow">{stat.title}</p>
              <h3>{stat.value}</h3>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Άλλοι βασικοί δείκτες κράτους</h2>
          <p className="section-lead">
            Συγκεντρωτικά στοιχεία που βοηθούν να κατανοήσουμε τον ρόλο του κράτους στην οικονομία
            και στη δημόσια διοίκηση.
          </p>
        </div>
        <div className="grid-2">
          {governmentStatisticsContent.governance.map((stat) => (
            <div key={stat.title} className="card muted-border">
              <h3>{stat.title}</h3>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section emphasis-card">
        <h2 className="section-title">Σημειώσεις</h2>
        <ul className="feature-list">
          {governmentStatisticsContent.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
