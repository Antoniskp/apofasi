import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CITIES_BY_REGION, REGION_NAMES } from "../../../shared/locations.js";
import { API_BASE_URL, createPoll, getAuthStatus, listPolls, voteOnPoll } from "../lib/api.js";

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("el-GR", { dateStyle: "medium", timeStyle: "short" });
};

const uniqueTags = (rawTags = "") =>
  Array.from(
    new Set(
      rawTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  ).slice(0, 10);

const DEFAULT_OPTIONS = ["Ναι", "Όχι"];

export default function Polls() {
  const [authState, setAuthState] = useState({ loading: true, user: null, error: null });
  const [pollsState, setPollsState] = useState({ loading: true, polls: [], error: null });
  const [formState, setFormState] = useState({
    question: "",
    options: DEFAULT_OPTIONS,
    tags: "",
    region: "",
    cityOrVillage: "",
  });
  const [submission, setSubmission] = useState({ submitting: false, success: null, error: null });
  const [voteState, setVoteState] = useState({});

  const availableCities = useMemo(() => CITIES_BY_REGION[formState.region] || [], [formState.region]);

  const loadAuthStatus = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getAuthStatus();
      setAuthState({ loading: false, user: data.user, error: null });
    } catch (error) {
      setAuthState({
        loading: false,
        user: null,
        error:
          API_BASE_URL
            ? error.message || "Δεν ήταν δυνατή η ανάκτηση συνεδρίας."
            : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η ανάκτηση συνεδρίας.",
      });
    }
  };

  const loadPolls = async () => {
    setPollsState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await listPolls();
      setPollsState({ loading: false, polls: data.polls || [], error: null });
    } catch (error) {
      setPollsState({
        loading: false,
        polls: [],
        error: API_BASE_URL
          ? error.message || "Δεν ήταν δυνατή η φόρτωση ψηφοφοριών."
          : "Ορίστε το VITE_API_BASE_URL για να φορτώσουν οι ψηφοφορίες.",
      });
    }
  };

  useEffect(() => {
    loadAuthStatus();
    loadPolls();
  }, []);

  const handleOptionChange = (index, value) => {
    setFormState((prev) => {
      const nextOptions = [...prev.options];
      nextOptions[index] = value;
      return { ...prev, options: nextOptions };
    });
  };

  const addOptionField = () => {
    setFormState((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOptionField = (index) => {
    setFormState((prev) => {
      if (prev.options.length <= 2) return prev;
      const nextOptions = prev.options.filter((_, idx) => idx !== index);
      return { ...prev, options: nextOptions };
    });
  };

  const handleRegionChange = (value) => {
    setFormState((prev) => ({ ...prev, region: value, cityOrVillage: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!authState.user) {
      setSubmission({ submitting: false, success: null, error: "Χρειάζεται σύνδεση για να καταχωρήσετε ψηφοφορία." });
      return;
    }

    const trimmedQuestion = formState.question.trim();
    const cleanedOptions = formState.options.map((opt) => opt.trim()).filter(Boolean);
    const distinctOptions = Array.from(new Set(cleanedOptions));

    if (!trimmedQuestion || distinctOptions.length < 2) {
      setSubmission({ submitting: false, success: null, error: "Συμπληρώστε ερώτηση και τουλάχιστον δύο μοναδικές επιλογές." });
      return;
    }

    const tags = uniqueTags(formState.tags);

    setSubmission({ submitting: true, success: null, error: null });

    try {
      await createPoll({
        question: trimmedQuestion,
        options: distinctOptions,
        tags,
        region: formState.region,
        cityOrVillage: formState.cityOrVillage,
      });

      setSubmission({ submitting: false, success: "Η ψηφοφορία δημοσιεύτηκε.", error: null });
      setFormState({ question: "", options: DEFAULT_OPTIONS, tags: "", region: "", cityOrVillage: "" });
      await loadPolls();
    } catch (error) {
      setSubmission({
        submitting: false,
        success: null,
        error: error.message || "Δεν ήταν δυνατή η δημιουργία ψηφοφορίας.",
      });
    }
  };

  const handleVote = async (pollId, optionId) => {
    if (!authState.user) {
      setVoteState((prev) => ({ ...prev, [pollId]: { error: "Χρειάζεται σύνδεση για να ψηφίσετε." } }));
      return;
    }

    setVoteState((prev) => ({ ...prev, [pollId]: { submitting: true, error: null } }));

    try {
      const response = await voteOnPoll(pollId, optionId);
      setPollsState((prev) => ({
        ...prev,
        polls: prev.polls.map((poll) => (poll.id === pollId ? response.poll : poll)),
      }));
      setVoteState((prev) => ({ ...prev, [pollId]: { submitting: false, error: null } }));
    } catch (error) {
      setVoteState((prev) => ({
        ...prev,
        [pollId]: { submitting: false, error: error.message || "Η ψήφος δεν καταχωρήθηκε." },
      }));
    }
  };

  const { loading: authLoading, user, error: authError } = authState;
  const { loading: pollsLoading, polls, error: pollsError } = pollsState;

  return (
    <div className="section narrow">
      <p className="pill">Ψηφοφορίες</p>
      <h1 className="section-title">Δημόσιες ψηφοφορίες</h1>
      <p className="muted">Δημιουργήστε και ψηφίστε σε θέματα επικαιρότητας με ετικέτες και προαιρετική τοποθεσία.</p>

      <div className="card auth-card stack">
        {authLoading && <p className="muted">Φόρτωση συνεδρίας...</p>}

        {!authLoading && authError && <p className="error-text">{authError}</p>}

        {!authLoading && !authError && !user && (
          <div className="stack">
            <p className="muted">Χρειάζεται σύνδεση για να δημοσιεύσετε ή να ψηφίσετε.</p>
            <div className="cta-row">
              <Link className="btn" to="/auth">
                Σύνδεση
              </Link>
              <Link className="btn btn-outline" to="/register">
                Δημιουργία λογαριασμού
              </Link>
            </div>
          </div>
        )}

        {!authLoading && !authError && user && (
          <form className="stack" onSubmit={handleSubmit}>
            <div className="info-grid">
              <div>
                <p className="label">Ερώτηση</p>
                <input
                  type="text"
                  value={formState.question}
                  onChange={(event) => setFormState((prev) => ({ ...prev, question: event.target.value }))}
                  placeholder="Τι θέλετε να ρωτήσετε το κοινό;"
                />
              </div>
              <div>
                <p className="label">Ετικέτες</p>
                <input
                  type="text"
                  value={formState.tags}
                  onChange={(event) => setFormState((prev) => ({ ...prev, tags: event.target.value }))}
                  placeholder="Χωρίστε με κόμμα (π.χ. οικονομία, υγεία)"
                />
                <p className="muted small">Χρησιμοποιούνται για ομαδοποίηση ψηφοφοριών.</p>
              </div>
            </div>

            <div className="stack">
              <p className="label">Επιλογές απάντησης</p>
              <div className="option-stack">
                {formState.options.map((option, index) => (
                  <div key={index} className="option-row">
                    <input
                      type="text"
                      value={option}
                      onChange={(event) => handleOptionChange(index, event.target.value)}
                      placeholder={`Επιλογή ${index + 1}`}
                    />
                    {formState.options.length > 2 && (
                      <button
                        type="button"
                        className="btn btn-subtle"
                        onClick={() => removeOptionField(index)}
                        aria-label="Αφαίρεση επιλογής"
                      >
                        Αφαίρεση
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={addOptionField}
                disabled={formState.options.length >= 6}
              >
                Προσθήκη επιλογής
              </button>
            </div>

            <div className="info-grid">
              <div>
                <p className="label">Περιφέρεια (προαιρετικό)</p>
                <select value={formState.region} onChange={(event) => handleRegionChange(event.target.value)}>
                  <option value="">Χωρίς τοποθεσία</option>
                  {REGION_NAMES.map((regionName) => (
                    <option key={regionName} value={regionName}>
                      {regionName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="label">Πόλη ή χωριό (προαιρετικό)</p>
                <select
                  value={formState.cityOrVillage}
                  onChange={(event) => setFormState((prev) => ({ ...prev, cityOrVillage: event.target.value }))}
                  disabled={!formState.region}
                >
                  <option value="">Χωρίς επιλογή</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {!formState.region && <p className="muted small">Επιλέξτε πρώτα περιφέρεια για να ενεργοποιηθεί.</p>}
              </div>
            </div>

            {submission.error && <p className="error-text">{submission.error}</p>}
            {submission.success && <p className="positive-text">{submission.success}</p>}

            <div className="actions-row">
              <button type="button" className="btn btn-outline" onClick={loadAuthStatus} disabled={authLoading}>
                Ανανέωση συνεδρίας
              </button>
              <button type="submit" className="btn" disabled={submission.submitting}>
                {submission.submitting ? "Δημοσίευση..." : "Δημοσίευση ψηφοφορίας"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Πρόσφατες ψηφοφορίες</h2>
          <p className="muted">Δείτε τις ψηφοφορίες των χρηστών και ψηφίστε μία φορά ανά λογαριασμό.</p>
        </div>

        {pollsLoading && <p className="muted">Φόρτωση ψηφοφοριών...</p>}
        {pollsError && <p className="error-text">{pollsError}</p>}

        {!pollsLoading && !pollsError && polls.length === 0 && (
          <div className="card muted-border">
            <p className="muted">Δεν υπάρχουν ψηφοφορίες ακόμα. Δημοσιεύστε την πρώτη!</p>
          </div>
        )}

        <div className="stack">
          {polls.map((poll) => {
            const totalVotes = poll.totalVotes || 0;
            const voteStatus = voteState[poll.id] || {};

            return (
              <div key={poll.id} className="card poll-card">
                <div className="poll-header-row">
                  <div className="pill pill-soft">Ψηφοφορία</div>
                  <div className="muted small">{formatDateTime(poll.createdAt)}</div>
                </div>

                <h3 className="poll-question">{poll.question}</h3>

                {poll.tags?.length > 0 && (
                  <div className="chips">
                    {poll.tags.map((tag) => (
                      <span key={tag} className="chip">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {(poll.region || poll.cityOrVillage) && (
                  <p className="muted small">
                    Τοποθεσία: {[poll.region, poll.cityOrVillage].filter(Boolean).join(" • ")}
                  </p>
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
                            onClick={() => handleVote(poll.id, option.id)}
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
