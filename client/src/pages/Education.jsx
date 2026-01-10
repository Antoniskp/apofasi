const educationContent = {
  hero: {
    eyebrow: "Εκπαίδευση",
    title: "Γιατί η εκπαίδευση είναι το πιο δυνατό σας εργαλείο",
    subtitle:
      "Η γνώση δεν είναι απλώς πληροφορία· είναι ο τρόπος να κατανοούμε τον κόσμο, να χτίζουμε αυτοπεποίθηση και να παίρνουμε αποφάσεις με ευθύνη."
  },
  importance: [
    {
      title: "Προσωπική αυτονομία",
      description:
        "Η εκπαίδευση δίνει τα εργαλεία για να ερμηνεύουμε γεγονότα, να αξιολογούμε πηγές και να παίρνουμε αποφάσεις χωρίς εξαρτήσεις."
    },
    {
      title: "Επαγγελματικές ευκαιρίες",
      description:
        "Ανοίγει δρόμους για εργασία, εξέλιξη και ευελιξία σε μια αγορά που αλλάζει γρήγορα."
    },
    {
      title: "Κοινωνική συνοχή",
      description:
        "Καλλιεργεί ενσυναίσθηση, συνεργασία και κοινές αξίες ώστε οι κοινότητες να λειτουργούν με εμπιστοσύνη."
    },
    {
      title: "Δημοκρατική συμμετοχή",
      description:
        "Ενισχύει την κριτική σκέψη και κάνει τους πολίτες πιο ικανούς να ελέγχουν πληροφορίες και αποφάσεις."
    }
  ],
  lifelong: [
    {
      title: "Παιδική ηλικία",
      description:
        "Οι βασικές δεξιότητες (γλώσσα, αριθμητική, κοινωνικοποίηση) χτίζουν τα θεμέλια για τη μάθηση και την αυτοπεποίθηση."
    },
    {
      title: "Εφηβεία",
      description:
        "Η γνωστική ανάπτυξη κορυφώνεται: η εκπαίδευση ενισχύει την ικανότητα για αφηρημένη σκέψη, επίλυση προβλημάτων και αυτογνωσία."
    },
    {
      title: "Ενήλικη ζωή",
      description:
        "Η κατάρτιση και η συνεχής μάθηση ανανεώνουν δεξιότητες, κρατούν τον εγκέφαλο ενεργό και ενισχύουν την προσαρμοστικότητα."
    },
    {
      title: "Δια βίου μάθηση",
      description:
        "Η νευροπλαστικότητα μας επιτρέπει να μαθαίνουμε σε κάθε ηλικία. Η εκπαίδευση προστατεύει από γνωστική φθορά και κρατά το μυαλό σε εγρήγορση."
    }
  ],
  informedVoting: {
    title: "Γιατί πρέπει να είμαστε ενημερωμένοι πριν ψηφίσουμε",
    body:
      "Οι ψηφοφορίες εκφράζουν συλλογική βούληση. Χωρίς ενημέρωση, οι αποφάσεις βασίζονται σε εντυπώσεις και όχι σε δεδομένα. Ένας ενημερωμένος πολίτης:",
    points: [
      "διασταυρώνει πηγές και καταλαβαίνει το πλαίσιο του θέματος",
      "αποφεύγει παραπληροφόρηση και χειραγώγηση",
      "αξιολογεί επιπτώσεις για την κοινωνία και τον ίδιο",
      "συμβάλλει σε πιο αξιόπιστα αποτελέσματα στις ψηφοφορίες"
    ]
  },
  resources: [
    {
      name: "Wikipedia",
      description: "Ελεύθερη εγκυκλοπαίδεια με εκατομμύρια άρθρα.",
      url: "https://www.wikipedia.org/",
      icon: "fa-brands fa-wikipedia-w"
    },
    {
      name: "Khan Academy",
      description: "Δωρεάν μαθήματα σε μαθηματικά, επιστήμες και πολλά ακόμη.",
      url: "https://www.khanacademy.org/",
      icon: "fa-solid fa-graduation-cap"
    },
    {
      name: "edX",
      description: "Μαθήματα από κορυφαία πανεπιστήμια με δωρεάν πρόσβαση.",
      url: "https://www.edx.org/",
      icon: "fa-solid fa-building-columns"
    },
    {
      name: "MIT OpenCourseWare",
      description: "Ανοιχτό υλικό μαθημάτων από το MIT.",
      url: "https://ocw.mit.edu/",
      icon: "fa-solid fa-university"
    },
    {
      name: "OpenStax",
      description: "Δωρεάν ακαδημαϊκά συγγράμματα υψηλής ποιότητας.",
      url: "https://openstax.org/",
      icon: "fa-solid fa-book-open"
    },
    {
      name: "Coursera",
      description: "Πολλά μαθήματα προσφέρονται δωρεάν σε λειτουργία audit.",
      url: "https://www.coursera.org/",
      icon: "fa-solid fa-laptop"
    }
  ]
};

export default function Education() {
  return (
    <div className="page education-page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">{educationContent.hero.eyebrow}</p>
          <h1>{educationContent.hero.title}</h1>
          <p className="muted">{educationContent.hero.subtitle}</p>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Ο ρόλος της εκπαίδευσης στη ζωή μας</h2>
          <p className="section-lead">
            Η εκπαίδευση είναι η βάση για προσωπική εξέλιξη, κοινωνική συνοχή και
            υπεύθυνη συμμετοχή στα κοινά.
          </p>
        </div>
        <div className="grid-2">
          {educationContent.importance.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Γνωστική ανάπτυξη σε όλη τη ζωή</h2>
          <p className="section-lead">
            Η μάθηση συνοδεύει κάθε στάδιο: από τα πρώτα χρόνια μέχρι τη δια βίου
            καλλιέργεια δεξιοτήτων και ενδιαφερόντων.
          </p>
        </div>
        <div className="grid-2">
          {educationContent.lifelong.map((stage) => (
            <div key={stage.title} className="card muted-border">
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section emphasis-card">
        <h2 className="section-title">{educationContent.informedVoting.title}</h2>
        <p className="section-lead">{educationContent.informedVoting.body}</p>
        <ul className="feature-list">
          {educationContent.informedVoting.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Αξιόπιστες πηγές για δωρεάν μάθηση</h2>
          <p className="section-lead">
            Εξερευνήστε ποιοτικές πλατφόρμες για αυτομόρφωση, έρευνα και συνεχή
            εκπαίδευση.
          </p>
        </div>
        <div className="grid-3 resource-grid">
          {educationContent.resources.map((resource) => (
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
    </div>
  );
}
