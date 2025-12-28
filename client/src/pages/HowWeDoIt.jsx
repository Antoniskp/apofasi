const pipeline = [
  {
    title: "AI σε λειτουργία research",
    description:
      "Χρησιμοποιούμε AI εργαλεία για να συγκεντρώνουμε ιδέες, να οργανώνουμε δεδομένα και να σχεδιάζουμε γρήγορα πρωτότυπες εμπειρίες.",
    badge: "Βήμα 1"
  },
  {
    title: "Ανοικτός κώδικας στο GitHub",
    description:
      "Κάθε αλλαγή περνάει από pull requests, code review και αυτοματοποιημένα checks ώστε η κοινότητα να βλέπει και να ελέγχει την πορεία.",
    badge: "Βήμα 2"
  },
  {
    title: "Ασφαλής ανάπτυξη στον server",
    description:
      "Μετά την έγκριση, κάνουμε build και deployment στον server παραγωγής ώστε οι ενημερώσεις να φτάνουν στους χρήστες χωρίς διακοπή.",
    badge: "Βήμα 3"
  }
];

const technologies = [
  {
    title: "Frontend",
    items: ["React 18", "React Router", "Vite", "CSS utility layout"]
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "Mongoose", "Passport για OAuth"]
  },
  {
    title: "Data & Auth",
    items: ["MongoDB", "Sessions & cookies", "OAuth providers (Google/Facebook)"]
  },
  {
    title: "DevOps",
    items: ["GitHub για versioning", "CI builds", "Server deployments με περιβάλλοντα .env"]
  }
];

const delivered = [
  {
    title: "Σχεδιασμός και ροή εργασίας",
    description:
      "Καθορίσαμε pipeline με AI ιδέες, GitHub reviews και αυτόματα builds ώστε κάθε αλλαγή να είναι διαφανής και ελεγμένη."
  },
  {
    title: "Βασική στοίβα εφαρμογής",
    description:
      "Στήσαμε React frontend, Express backend και ενσωματώσαμε OAuth στο server ώστε να μπορούμε να ενεργοποιήσουμε κοινωνικά logins."
  },
  {
    title: "Ετοιμότητα για ανάπτυξη",
    description:
      "Διαθέσιμα scripts για build & deploy, μαζί με τεκμηρίωση περιβάλλοντος (.env) και διαδικασία ελέγχου ποιότητας."
  }
];

const upcoming = [
  {
    title: "Σύνδεση DB και ενεργοποίηση auth",
    description:
      "Συνδέουμε τον server στη MongoDB και ενεργοποιούμε την αυθεντικοποίηση χρηστών ώστε να λειτουργεί το sign-in."
  },
  {
    title: "Υλοποίηση ρόλων χρηστών",
    description:
      "Προσθέτουμε ρόλους (π.χ. admin, editor, member) με διαφορετικά δικαιώματα πρόσβασης."
  },
  {
    title: "Δομές για news και polls",
    description:
      "Ορίζουμε τα μοντέλα και τα endpoints για άρθρα και ψηφοφορίες ώστε το περιεχόμενο να αποθηκεύεται και να εμφανίζεται σωστά."
  }
];

export default function HowWeDoIt() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Διαδικασία</p>
          <h1>Πώς δουλεύουμε και τι τεχνολογίες χρησιμοποιούμε</h1>
          <p className="muted">
            Διαφάνεια σε κάθε βήμα: από την έμπνευση με AI, στο GitHub για συνεργασία, μέχρι τον server που
            φιλοξενεί τα builds μας.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="card">
          <h2>Pipeline: AI → GitHub → Server</h2>
          <p className="muted">
            Η ροή εργασίας μας είναι σχεδιασμένη για να κρατά την ποιότητα υψηλά και την κοινότητα μέσα στο
            loop. Δείτε τη διαδρομή που ακολουθεί κάθε νέα δυνατότητα.
          </p>

          <div className="grid-3">
            {pipeline.map((step) => (
              <div key={step.title} className="card muted-border">
                <div className="pill">{step.badge}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid-2">
          <div className="card">
            <h2>Πώς προχωράμε</h2>
            <ul className="feature-list">
              <li>
                <strong>Σχεδιασμός με AI:</strong> Δημιουργούμε mockups, περιγραφές και πλάνα δοκιμών για νέες
                ιδέες πριν γράψουμε κώδικα.
              </li>
              <li>
                <strong>Κώδικας με έλεγχο ποιότητας:</strong> Branches και pull requests στο GitHub, με reviews και
                αυτόματες build δοκιμές.
              </li>
              <li>
                <strong>Deploy χωρίς διακοπή:</strong> Μόλις περάσουν τα checks, κάνουμε release στον server και
                ενημερώνουμε την κοινότητα.
              </li>
            </ul>
          </div>

          <div className="card">
            <h2>Stack & εργαλεία</h2>
            <div className="stack-grid">
              {technologies.map((group) => (
                <div key={group.title} className="stack-card">
                  <p className="eyebrow">{group.title}</p>
                  <ul className="stack-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid-2">
          <div className="card">
            <h2>Τι έχουμε ολοκληρώσει</h2>
            <ul className="feature-list">
              {delivered.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}:</strong> {item.description}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2>Τι έρχεται, με σειρά</h2>
            <ol className="feature-list">
              {upcoming.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}:</strong> {item.description}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
