import { Link } from "react-router-dom";

const demoStory = {
  title: "Παράδειγμα: Η Βουλή συζητά νέα μέτρα",
  sources: ["Kathimerini", "Naftemporiki", "ERT", "Demo Source"],
  updated: "Ενημερώθηκε πριν 15 λεπτά",
  question: "Υποστηρίζετε τα προτεινόμενα μέτρα;",
  options: ["Ναι", "Όχι", "Δεν είμαι σίγουρος/η"],
  totalVotes: 412
};

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-kicker">Απόφαση • Δημόσιο αίσθημα για την επικαιρότητα</div>

          <h1>Καθαρή εικόνα από όλα τα ελληνικά media και μια ψήφος κάτω από κάθε ιστορία.</h1>

          <p className="hero-sub">
            Η «Απόφαση» ομαδοποιεί τίτλους από διαφορετικές πηγές, δείχνει πώς καλύπτουν το ίδιο θέμα και
            καταγράφει τη στάση των αναγνωστών με μικρές, διαφανείς ψηφοφορίες.
          </p>

          <ul className="hero-points">
            <li>
              <span className="point-dot" aria-hidden>
                •
              </span>
              Ομαδοποιούμε τίτλους από εφημερίδες, ενημερωτικά sites και δημόσια ΜΜΕ.
            </li>
            <li>
              <span className="point-dot" aria-hidden>
                •
              </span>
              Προβάλλουμε πώς πλαισιώνεται η ίδια ιστορία με μια ματιά.
            </li>
            <li>
              <span className="point-dot" aria-hidden>
                •
              </span>
              Προσθέτουμε μια απλή ψηφοφορία για να φαίνεται η τάση σε πραγματικό χρόνο.
            </li>
          </ul>

          <div className="hero-buttons">
            <Link to="/news" className="btn">
              Δείτε τις ιστορίες
            </Link>
            <Link to="/polls" className="btn btn-outline">
              Ψηφίστε σε μια ιστορία
            </Link>
            <Link to="/mission" className="btn btn-subtle">
              Μάθετε τι επιδιώκουμε
            </Link>
          </div>

          <div className="hero-meta">
            <span className="pill pill-soft">Ανοιχτός κώδικας</span>
            <span className="pill pill-soft">Χωρίς paywall</span>
            <span className="pill pill-soft">Εστίαση στην Ελλάδα</span>
          </div>

          <p className="hero-disclaimer">
            Διαφάνεια: Οι ψηφοφορίες είναι ενδεικτικές και δεν αποτελούν στατιστικά αντιπροσωπευτικό δείγμα.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Τι είναι η Απόφαση</h2>
          <p className="section-lead">Ένα σημείο αναφοράς για την ελληνική επικαιρότητα, που κρατά τον αναγνώστη στο κέντρο.</p>
        </div>

        <div className="grid-2 feature-grid">
          <div className="card emphasis-card">
            <h3>Ένα σημείο, όλες οι οπτικές</h3>
            <ul className="list-tight">
              <li>Ενιαία προβολή των τίτλων που μιλούν για το ίδιο γεγονός.</li>
              <li>Καθαρό πλαίσιο χωρίς clickbait ή κατακερματισμό.</li>
              <li>Σύντομη ταυτότητα πηγής για να φαίνεται ποιος μιλάει.</li>
            </ul>
          </div>

          <div className="card muted-border">
            <h3>Ποιον βοηθά</h3>
            <p>
              Πολίτες, δημοσιογράφους, φοιτητές και όποιον θέλει να καταλάβει γρήγορα τι συμβαίνει στην Ελλάδα με
              διαφάνεια.
            </p>

            <div className="pill-row">
              <span className="pill pill-soft">Ακρίβεια</span>
              <span className="pill pill-soft">Διαφάνεια</span>
              <span className="pill pill-soft">Συμμετοχή</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Γιατί θα σας αρέσει</h2>
          <p className="section-lead">Σχεδιασμένο για καθαρή ενημέρωση και για να φαίνεται πώς σκέφτεται το κοινό.</p>
        </div>

        <div className="grid-3">
          <div className="card">
            <h3>Όλα τα media μαζί</h3>
            <p>
              Σώστε χρόνο βλέποντας πώς καλύπτουν την ίδια ιστορία διαφορετικά ελληνικά και διεθνή μέσα, χωρίς να
              αλλάζετε tab.
            </p>
          </div>

          <div className="card">
            <h3>Σήμα από τους πολίτες</h3>
            <p>
              Οι ψηφοφορίες δείχνουν την τάση του κοινού. Ψηφίζετε μία φορά, βλέπετε αμέσως τα αποτελέσματα, χωρίς
              θόρυβο.
            </p>
          </div>

          <div className="card">
            <h3>Καθαρή, ελαφριά εμπειρία</h3>
            <p>
              Χωρίς paywall ή pop-ups. Ελαφριά σχεδίαση που αφήνει χώρο στο περιεχόμενο και στο δικό σας συμπέρασμα.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Πώς λειτουργεί</h2>
          <p className="section-lead">Τρία καθαρά βήματα για να φτάσει το γεγονός από την πηγή σε εσάς.</p>
        </div>

        <div className="grid-3">
          <div className="card">
            <h3>1) Συγκέντρωση</h3>
            <p>
              Φέρνουμε τίτλους από πολλές ελληνικές και διεθνείς πηγές και τους κανονικοποιούμε σε ένα καθαρό feed,
              χωρίς διπλοεγγραφές.
            </p>
          </div>

          <div className="card">
            <h3>2) Ομαδοποίηση</h3>
            <p>
              Παρόμοια άρθρα ομαδοποιούνται σε μία «ομάδα ιστορίας» ώστε να βλέπετε την κάλυψη από όλα τα μέσα σε ένα
              μέρος με κοινή περίληψη.
            </p>
          </div>

          <div className="card">
            <h3>3) Ψηφοφορία</h3>
            <p>
              Κάθε ιστορία έχει μια απλή ψηφοφορία. Ψηφίστε μία φορά, δείτε τα αποτελέσματα αμέσως και παρακολουθήστε
              την τάση με τον χρόνο.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Δείγμα ομαδοποίησης & ψηφοφορίας</h2>
          <p className="section-lead">Έτσι θα εμφανίζεται μια ομάδα ιστορίας με τις πηγές της και το απλό widget ψηφοφορίας.</p>
        </div>

        <div className="story">
          <div className="story-header">
            <div>
              <div className="story-title">{demoStory.title}</div>
              <div className="story-meta">{demoStory.updated}</div>
            </div>
            <div className="pill">Ομάδα</div>
          </div>

          <div className="story-sources">
            <div className="label">Πηγές που καλύπτουν αυτή την ιστορία:</div>
            <div className="chips">
              {demoStory.sources.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="poll">
            <div className="label">Ψηφοφορία</div>
            <div className="poll-q">{demoStory.question}</div>

            <div className="poll-options">
              {demoStory.options.map((opt) => (
                <button key={opt} className="poll-btn" type="button">
                  {opt}
                </button>
              ))}
            </div>

            <div className="poll-foot">
              <span>Σύνολο ψήφων: {demoStory.totalVotes}</span>
              <span className="muted">Τα αποτελέσματα εμφανίζονται μετά την ψήφο (κανόνας MVP)</span>
            </div>
          </div>
        </div>

        <div className="cta-row">
          <a className="btn" href="#roadmap">
            Τι ακολουθεί
          </a>
          <a className="btn btn-outline" href="https://github.com/Antoniskp/apofasi" target="_blank" rel="noreferrer">
            Δείτε το project στο GitHub
          </a>
        </div>
      </section>

      <section id="roadmap" className="section">
        <div className="section-header">
          <h2 className="section-title">Οδικός χάρτης (MVP)</h2>
          <p className="section-lead">Σύντομος οδηγός για το πού πηγαίνει το project στους πρώτους κύκλους.</p>
        </div>

        <div className="grid-2">
          <div className="card">
            <h3>Φάση 1</h3>
            <ul className="list">
              <li>Εισαγωγή RSS για ελληνικές πηγές</li>
              <li>Ομαδοποίηση ιστοριών</li>
              <li>Σελίδα ιστορίας + widget ψηφοφορίας</li>
            </ul>
          </div>

          <div className="card">
            <h3>Φάση 2</h3>
            <ul className="list">
              <li>Λογαριασμοί χρηστών (προαιρετική επαλήθευση)</li>
              <li>Έλεγχοι ακεραιότητας ψηφοφορίας (περιορισμοί ρυθμού, αξιολόγηση ρίσκου)</li>
              <li>Σελίδες θεματικών (Πολιτική, Οικονομία, Κοινωνία, Αθλητισμός)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
