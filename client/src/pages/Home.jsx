import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthStatus, listPolls, voteOnPoll } from "../lib/api";

const getTotalVotes = (poll) => {
  if (typeof poll.totalVotes === "number") return poll.totalVotes;
  return (poll.options || []).reduce((sum, option) => sum + (option.votes || 0), 0);
};

const Home = () => {
  const [authState, setAuthState] = useState({ loading: true, user: null, error: null });
  const [pollsState, setPollsState] = useState({ loading: true, polls: [], error: null });
  const [voteState, setVoteState] = useState({});

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [authData, pollsData] = await Promise.all([getAuthStatus(), listPolls()]);
        if (!isMounted) return;
        setAuthState({ loading: false, user: authData.user, error: null });
        setPollsState({ loading: false, polls: pollsData.polls || [], error: null });
      } catch (error) {
        if (!isMounted) return;
        setAuthState({ loading: false, user: null, error: error.message || "Η φόρτωση απέτυχε." });
        setPollsState({
          loading: false,
          polls: [],
          error: error.message || "Η φόρτωση απέτυχε.",
        });
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const topPolls = useMemo(() => {
    return [...pollsState.polls]
      .sort((a, b) => getTotalVotes(b) - getTotalVotes(a))
      .slice(0, 2);
  }, [pollsState.polls]);

  const handleVote = async (poll, optionId) => {
    if (!optionId || typeof optionId !== "string") {
      setVoteState((prev) => ({
        ...prev,
        [poll.id]: { error: "Επιλέξτε μία από τις διαθέσιμες απαντήσεις." },
      }));
      return;
    }

    if (!poll.anonymousResponses && !authState.user) {
      setVoteState((prev) => ({ ...prev, [poll.id]: { error: "Χρειάζεται σύνδεση για να ψηφίσετε." } }));
      return;
    }

    setVoteState((prev) => ({ ...prev, [poll.id]: { submitting: true, error: null } }));

    try {
      const response = await voteOnPoll(poll.id, optionId);
      setPollsState((prev) => ({
        ...prev,
        polls: prev.polls.map((item) => (item.id === poll.id ? response.poll : item)),
      }));
      setVoteState((prev) => ({ ...prev, [poll.id]: { submitting: false, error: null } }));
    } catch (error) {
      setVoteState((prev) => ({
        ...prev,
        [poll.id]: { submitting: false, error: error.message || "Η ψήφος δεν καταχωρήθηκε." },
      }));
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-grid">
            <div className="hero-copy">
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

            <aside className="hero-panel">
              <div className="hero-panel-header">
                <span className="pill pill-soft">Σήμερα στην Απόφαση</span>
                <h2>Συνοπτική εικόνα σε μία κάρτα.</h2>
                <p className="muted">
                  Οργανώνουμε την επικαιρότητα με σαφήνεια, ώστε να βλέπετε γρήγορα τις τάσεις και τις πηγές.
                </p>
              </div>

              <div className="hero-panel-list">
                <div className="hero-panel-item">
                  <span className="hero-panel-number">Πολλαπλές</span>
                  <span className="muted">πηγές & τίτλοι ανά ιστορία</span>
                </div>
                <div className="hero-panel-item">
                  <span className="hero-panel-number">Ανοιχτές</span>
                  <span className="muted">ψηφοφορίες με άμεση τάση</span>
                </div>
                <div className="hero-panel-item">
                  <span className="hero-panel-number">Καθαρή</span>
                  <span className="muted">ανάγνωση χωρίς clickbait</span>
                </div>
              </div>
            </aside>
          </div>
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
          <h2 className="section-title">Οι δημοφιλέστερες ψηφοφορίες</h2>
          <p className="section-lead">
            Ζωντανά δεδομένα από τις πιο ενεργές ψηφοφορίες. Ψηφίστε και δείτε αμέσως πώς κινείται το κοινό.
          </p>
        </div>

        {pollsState.loading && <p className="muted">Φόρτωση ψηφοφοριών...</p>}
        {pollsState.error && <p className="error-text">{pollsState.error}</p>}

        {!pollsState.loading && !pollsState.error && topPolls.length === 0 && (
          <div className="card muted-border">
            <p className="muted">Δεν υπάρχουν ακόμα ψηφοφορίες. Δημιουργήστε την πρώτη.</p>
          </div>
        )}

        <div className="home-polls-grid">
          {topPolls.map((poll) => {
            const totalVotes = getTotalVotes(poll);
            const voteStatus = voteState[poll.id] || {};

            return (
              <div key={poll.id} className="card poll-card modern-card">
                <div className="poll-header-row">
                  <div className="pill pill-soft">Ψηφοφορία</div>
                  <div className="muted small">{totalVotes} ψήφοι</div>
                </div>

                <h3 className="poll-question">{poll.question}</h3>

                {(poll.region || poll.cityOrVillage) && (
                  <p className="muted small">
                    Τοποθεσία: {[poll.region, poll.cityOrVillage].filter(Boolean).join(" • ")}
                  </p>
                )}

                {poll.tags?.length > 0 && (
                  <div className="chips">
                    {poll.tags.map((tag) => (
                      <span key={tag} className="chip">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="poll-options-list">
                  {poll.options.map((option) => {
                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                    const disabled = poll.hasVoted || voteStatus.submitting;

                    return (
                      <div key={option.id} className="poll-option">
                        <div className="poll-option-header">
                          <div className="poll-option-title">{option.text}</div>
                          <div className="muted small">
                            {option.votes} ψήφοι {totalVotes > 0 ? `• ${percentage}%` : ""}
                          </div>
                        </div>
                        <div className="progress-track" aria-hidden>
                          <div className="progress-bar" style={{ width: `${percentage}%` }} />
                        </div>
                        {!poll.hasVoted && (
                          <button
                            className="btn btn-outline"
                            type="button"
                            disabled={disabled}
                            onClick={() => handleVote(poll, option.id)}
                          >
                            {voteStatus.submitting ? "Καταχώρηση..." : "Ψήφισε"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {poll.hasVoted && <p className="positive-text small">Έχετε ήδη ψηφίσει.</p>}
                {voteStatus.error && <p className="error-text">{voteStatus.error}</p>}
                <Link className="btn btn-subtle" to={`/polls/${poll.id}`}>
                  Δείτε αναλυτικά
                </Link>
              </div>
            );
          })}
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
