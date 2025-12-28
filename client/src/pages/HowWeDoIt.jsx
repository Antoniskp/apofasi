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
    </div>
  );
}
