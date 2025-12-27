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
          <div className="hero-kicker">Πρώτα η Ελλάδα • Πρώτα ο Ιστός • Επίπεδο δημόσιου αισθήματος</div>

          <h1>Απόφαση: ειδήσεις ομαδοποιημένες από πολλές πηγές, με μια ψηφοφορία κάτω από κάθε ιστορία.</h1>

          <p className="hero-sub">
            Διαβάστε τι συνέβη, συγκρίνετε πώς το καλύπτουν διαφορετικά μέσα και ψηφίστε για να δείξετε πώς
            νιώθει ο κόσμος — σε πραγματικό χρόνο. Φτιαγμένο για την Ελλάδα.
          </p>

          <div className="hero-buttons">
            <Link to="/news" className="btn">
              Δείτε τις Ειδήσεις (σύντομα)
            </Link>
            <Link to="/polls" className="btn btn-outline">
              Δείτε τις Ψηφοφορίες (σύντομα)
            </Link>
            <Link to="/mission" className="btn btn-subtle">
              Μάθετε τι επιδιώκουμε
            </Link>
          </div>

          <p className="hero-disclaimer">
            Διαφάνεια: Οι ψηφοφορίες της πλατφόρμας είναι ενδεικτικές και δεν είναι στατιστικά
            αντιπροσωπευτικές.
          </p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Πώς λειτουργεί</h2>

        <div className="grid-3">
          <div className="card">
            <h3>1) Συγκέντρωση</h3>
            <p>Συγκεντρώνουμε τίτλους από πολλές ελληνικές και διεθνείς πηγές και τους κανονικοποιούμε σε ένα καθαρό feed.</p>
          </div>

          <div className="card">
            <h3>2) Ομαδοποίηση</h3>
            <p>Παρόμοια άρθρα ομαδοποιούνται σε μία «ομάδα ιστορίας» ώστε να βλέπετε την κάλυψη από όλα τα μέσα σε ένα μέρος.</p>
          </div>

          <div className="card">
            <h3>3) Ψηφοφορία</h3>
            <p>Κάθε ιστορία έχει μια απλή ψηφοφορία. Ψηφίστε μία φορά, δείτε τα αποτελέσματα αμέσως και παρακολουθήστε την τάση με τον χρόνο.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Γιατί έχει σημασία</h2>

        <div className="grid-3">
          <div className="card">
            <h3>Διαφάνεια στην ενημέρωση</h3>
            <p>
              Βλέπετε πώς καλύπτει κάθε μέσο την ίδια είδηση, ώστε να σχηματίζετε άποψη
              χωρίς θόρυβο ή αλγόριθμους που κρύβουν πληροφορίες.
            </p>
          </div>

          <div className="card">
            <h3>Συμμετοχή των πολιτών</h3>
            <p>
              Οι ψηφοφορίες κάτω από κάθε ιστορία καταγράφουν το δημόσιο αίσθημα σε
              πραγματικό χρόνο, ενισχύοντας τη φωνή των αναγνωστών.
            </p>
          </div>

          <div className="card">
            <h3>Δημόσιο καλό, ανοιχτός κώδικας</h3>
            <p>
              Το project είναι ανοιχτού κώδικα και χτισμένο για την Ελλάδα. Μπορείτε να
              δείτε τι φτιάχνουμε και να προτείνετε βελτιώσεις.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Τι μπορείτε να κάνετε σήμερα</h2>

        <div className="grid-3">
          <div className="card">
            <h3>Διαβάστε την αποστολή</h3>
            <p>
              Μάθετε γιατί ξεκινήσαμε την «Απόφαση» και πώς θέλουμε να στηρίξουμε την
              ενημέρωση στην Ελλάδα.
            </p>
            <Link className="btn btn-subtle" to="/mission">
              Δείτε την αποστολή
            </Link>
          </div>

          <div className="card">
            <h3>Ζητήστε χαρακτηριστικά</h3>
            <p>
              Έχετε ιδέα για την εμπειρία χρήστη ή για τη συλλογή ειδήσεων; Πείτε μας τι
              θα ήταν πιο χρήσιμο για εσάς.
            </p>
            <Link className="btn btn-subtle" to="/news">
              Μοιραστείτε ανάγκες
            </Link>
          </div>

          <div className="card">
            <h3>Συμβάλετε στον κώδικα</h3>
            <p>
              Αν ασχολείστε με web, data ή σχεδιασμό, ρίξτε μια ματιά στον κώδικα στο
              GitHub και βοηθήστε να πάμε στο επόμενο βήμα.
            </p>
            <a className="btn btn-outline" href="https://github.com/Antoniskp/apofasi" target="_blank" rel="noreferrer">
              Συμμετοχή στο GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Επίδειξη (τι θα δείτε)</h2>

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
        <h2 className="section-title">Οδικός χάρτης (MVP)</h2>

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
