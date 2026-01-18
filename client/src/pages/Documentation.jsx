const documentationContent = {
  hero: {
    eyebrow: "Τεκμηρίωση",
    title: "Οδηγός για τη δομή και το περιεχόμενο του Apofasi",
    subtitle:
      "Συνοπτικός οδηγός τύπου README για να βρίσκετε εύκολα τις σελίδες, τα modules και τα κείμενα που χρειάζονται αλλαγές καθώς εξελίσσεται το project."
  },
  structure: [
    {
      title: "Frontend (client)",
      body:
        "Οι σελίδες βρίσκονται στον φάκελο client/src/pages και οργανώνονται ανά route. Τα κοινά UI modules (π.χ. μενού, footer, κάρτες) ζουν στο client/src/components, ενώ τα API helpers στο client/src/lib."
    },
    {
      title: "Backend (server)",
      body:
        "Τα endpoints ορίζονται στο server/server.js, ενώ τα data models είναι στον φάκελο server/models. Το αρχείο docs/DB_SCHEMA.md είναι η ανθρώπινη περιγραφή του schema."
    },
    {
      title: "Shared",
      body:
        "Οτιδήποτε χρειάζεται και τα δύο μέρη (π.χ. κοινά constants) μπαίνει στον φάκελο shared ώστε να διατηρείται μια ενιαία πηγή αλήθειας."
    }
  ],
  updateGuides: [
    {
      title: "Κείμενα σελίδων",
      body:
        "Οι περισσότερες στατικές σελίδες κρατούν το κείμενο σε αντικείμενα στην κορυφή κάθε αρχείου (π.χ. client/src/pages/Home.jsx, Mission.jsx, About.jsx)."
    },
    {
      title: "Ροές περιεχομένου",
      body:
        "Τα δυναμικά δεδομένα (ειδήσεις, ψηφοφορίες) προέρχονται από τη βάση δεδομένων. Τα forms και η διαχείριση περιεχομένου είναι στα client/src/pages/News.jsx και client/src/pages/Polls.jsx."
    },
    {
      title: "Πλοήγηση & menu",
      body:
        "Οι διαδρομές ενημερώνονται στο client/src/App.jsx, ενώ το footer menu ρυθμίζεται στο client/src/components/Footer.jsx."
    }
  ],
  schemaNotes: [
    {
      title: "Users",
      body: "Λογαριασμοί χρηστών με στοιχεία προφίλ, ρόλους και provider."
    },
    {
      title: "Polls",
      body: "Ψηφοφορίες με επιλογές, ψήφους και συσχετίσεις χρηστών."
    },
    {
      title: "News",
      body: "Ειδήσεις με τίτλο, περιεχόμενο και author."
    },
    {
      title: "ContactMessages",
      body: "Μηνύματα επικοινωνίας, metadata και status."
    }
  ]
};

export default function Documentation() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">{documentationContent.hero.eyebrow}</p>
          <h1>{documentationContent.hero.title}</h1>
          <p className="muted">{documentationContent.hero.subtitle}</p>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Γρήγορη πλοήγηση</h2>
          <p className="section-lead">
            Χρησιμοποιήστε τα anchors για να μεταβείτε στα βασικά σημεία ενημέρωσης.
          </p>
        </div>
        <div className="grid-3">
          <div className="card">
            <h3>Δομή έργου</h3>
            <ul className="list">
              <li>
                <a className="footer-link" href="#structure">
                  Πού βρίσκονται pages & modules
                </a>
              </li>
              <li>
                <a className="footer-link" href="#content-updates">
                  Πού αλλάζουν τα κείμενα
                </a>
              </li>
            </ul>
          </div>
          <div className="card">
            <h3>Χάρτης σελίδων</h3>
            <ul className="list">
              <li>
                <a className="footer-link" href="#sitemap">
                  Sitemap
                </a>
              </li>
              <li>
                <a className="footer-link" href="#routes-notes">
                  Σημειώσεις routes
                </a>
              </li>
            </ul>
          </div>
          <div className="card">
            <h3>Δεδομένα</h3>
            <ul className="list">
              <li>
                <a className="footer-link" href="#db-schema">
                  DB schema
                </a>
              </li>
              <li>
                <a className="footer-link" href="#data-sources">
                  Πηγές δεδομένων
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="structure" className="section">
        <div className="section-header">
          <h2 className="section-title">Οργάνωση pages & modules</h2>
          <p className="section-lead">
            Η βασική δομή παραμένει σταθερή ώστε να μπορείτε να προσθέτετε νέες σελίδες
            χωρίς να αναζητάτε πολύπλοκες εξαρτήσεις.
          </p>
        </div>
        <div className="grid-3">
          {documentationContent.structure.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p className="muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="content-updates" className="section">
        <div className="section-header">
          <h2 className="section-title">Πού ενημερώνουμε κείμενα και περιεχόμενο</h2>
          <p className="section-lead">
            Χρησιμοποιήστε τους παρακάτω οδηγούς για να βρείτε γρήγορα το σημείο που
            χρειάζεται αλλαγή.
          </p>
        </div>
        <div className="grid-3">
          {documentationContent.updateGuides.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p className="muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sitemap" className="section">
        <div className="section-header">
          <h2 className="section-title">Sitemap (routes)</h2>
          <p className="section-lead">
            Ο χάρτης σελίδων βασίζεται στο client/src/App.jsx. Κάθε νέο route πρέπει
            να προστεθεί εκεί και να εμφανίζεται εδώ.
          </p>
        </div>
        <div className="card">
          <ul className="list-tight">
            <li>/</li>
            <li>/mission</li>
            <li>/news</li>
            <li>/polls</li>
            <li>/polls/new</li>
            <li>/polls/:pollId</li>
            <li>/contribute</li>
            <li>/contact</li>
            <li>/about</li>
            <li>/how-we-do-it</li>
            <li>/bounties</li>
            <li>/education</li>
            <li>/education/economics</li>
            <li>/education/government-apps</li>
            <li>/education/government-statistics</li>
            <li>/education/greek-law-system</li>
            <li>/social</li>
            <li>/recommendations</li>
            <li>/top-choices</li>
            <li>/auth</li>
            <li>/register</li>
            <li>/profile</li>
            <li>/admin/users</li>
            <li>/auth/success</li>
            <li>/auth/error</li>
            <li>/documentation</li>
          </ul>
        </div>
      </section>

      <section id="routes-notes" className="section">
        <div className="section-header">
          <h2 className="section-title">Σημειώσεις για νέες σελίδες</h2>
        </div>
        <div className="card">
          <ul className="list">
            <li>Προσθέστε νέο component στο client/src/pages.</li>
            <li>Δηλώστε το route στο client/src/App.jsx.</li>
            <li>Προσθέστε link στο footer ή στο κύριο menu αν χρειάζεται.</li>
            <li>Ενημερώστε το sitemap παραπάνω για να παραμένει πλήρες.</li>
          </ul>
        </div>
      </section>

      <section id="db-schema" className="section">
        <div className="section-header">
          <h2 className="section-title">DB schema (σύνοψη)</h2>
          <p className="section-lead">
            Η πλήρης περιγραφή βρίσκεται στο docs/DB_SCHEMA.md και στα server/models.
          </p>
        </div>
        <div className="grid-2">
          {documentationContent.schemaNotes.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p className="muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="data-sources" className="section">
        <div className="section-header">
          <h2 className="section-title">Πηγές δεδομένων & ενημέρωση</h2>
        </div>
        <div className="card">
          <ul className="list">
            <li>Το MongoDB schema περιγράφεται στο docs/DB_SCHEMA.md.</li>
            <li>Τα μοντέλα Mongoose είναι στο server/models.</li>
            <li>Οι φόρμες περιεχομένου επικοινωνούν με τα endpoints στο server/server.js.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
