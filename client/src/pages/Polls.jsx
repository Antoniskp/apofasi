import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, listPolls, voteOnPoll, cancelVoteOnPoll } from "../lib/api.js";

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("el-GR", { dateStyle: "medium", timeStyle: "short" });
};

const getTotalVotes = (poll) => {
  if (typeof poll.totalVotes === "number") return poll.totalVotes;
  return (poll.options || []).reduce((sum, option) => sum + (option.votes || 0), 0);
};

export default function Polls() {
  const [authState, setAuthState] = useState({ loading: true, user: null, error: null });
  const [pollsState, setPollsState] = useState({ loading: true, polls: [], error: null });
  const [voteState, setVoteState] = useState({});
  const [cancelState, setCancelState] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

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

  const handleCancelVote = async (poll) => {
    setCancelState((prev) => ({ ...prev, [poll.id]: { cancelling: true, error: null } }));

    try {
      const response = await cancelVoteOnPoll(poll.id);
      setPollsState((prev) => ({
        ...prev,
        polls: prev.polls.map((item) => (item.id === poll.id ? response.poll : item)),
      }));
      setCancelState((prev) => ({ ...prev, [poll.id]: { cancelling: false, error: null } }));
      setVoteState((prev) => ({ ...prev, [poll.id]: { submitting: false, error: null } }));
    } catch (error) {
      setCancelState((prev) => ({
        ...prev,
        [poll.id]: { cancelling: false, error: error.message || "Η ακύρωση της ψήφου απέτυχε." },
      }));
    }
  };

  const { loading: authLoading, user, error: authError } = authState;
  const { loading: pollsLoading, polls, error: pollsError } = pollsState;
  const filteredPolls = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const searched = query
      ? polls.filter((poll) => {
        const question = poll.question?.toLowerCase() || "";
        const tags = (poll.tags || []).join(" ").toLowerCase();
        const creator = poll.createdBy?.displayName?.toLowerCase() || "";
        return question.includes(query) || tags.includes(query) || creator.includes(query);
      })
      : polls;

    const sorted = [...searched].sort((a, b) => {
      if (sortOption === "popular") {
        return getTotalVotes(b) - getTotalVotes(a);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [polls, searchTerm, sortOption]);

  const showAuthCard = authLoading || authError || !user;

  return (
    <div className="section">
      <p className="pill">Ψηφοφορίες</p>
      <h1 className="section-title">Δημόσιες ψηφοφορίες</h1>
      <p className="muted">Δημιουργήστε και ψηφίστε σε θέματα επικαιρότητας με ετικέτες, προαιρετική τοποθεσία και έμφαση στην ιδιωτικότητα.</p>

      {showAuthCard && (
        <div className="card auth-card stack">
          {authLoading && <p className="muted">Φόρτωση συνεδρίας...</p>}

          {!authLoading && authError && <p className="error-text">{authError}</p>}

          {!authLoading && !authError && !user && (
            <div className="stack">
              <p className="muted">
                Χρειάζεται σύνδεση για να ψηφίσετε σε ψηφοφορίες που δεν είναι ανώνυμες για τους ψηφοφόρους.
              </p>
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
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Πρόσφατες ψηφοφορίες</h2>
        </div>

        <div className="toolbar-container">
          <div className="toolbar-left">
            <input
              className="input-modern compact"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="🔍 Αναζήτηση σε ερώτηση, ετικέτες, δημιουργό..."
            />
            <select
              className="input-modern compact"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
            >
              <option value="newest">Πιο πρόσφατες</option>
              <option value="popular">Πιο δημοφιλείς</option>
            </select>
          </div>
          <div className="toolbar-right">
            <Link className="btn btn-primary" to="/polls/new">
              ✚ Νέα ψηφοφορία
            </Link>
            {user && (
              <Link className="btn btn-outline" to="/polls/my-polls">
                Οι ψηφοφορίες μου
              </Link>
            )}
          </div>
        </div>

        {pollsLoading && <p className="muted">Φόρτωση ψηφοφοριών...</p>}
        {pollsError && <p className="error-text">{pollsError}</p>}

        {!pollsLoading && !pollsError && filteredPolls.length === 0 && (
          <div className="card muted-border">
            <p className="muted">Δεν βρέθηκαν ψηφοφορίες. Δοκιμάστε άλλη αναζήτηση ή δημοσιεύστε νέα.</p>
          </div>
        )}

        <div className="responsive-card-grid">
          {filteredPolls.map((poll) => {
            const totalVotes = getTotalVotes(poll);
            const voteStatus = voteState[poll.id] || {};
            const cancelStatus = cancelState[poll.id] || {};

            return (
              <div key={poll.id} className="card poll-card compact-card">
                <div className="poll-header-row">
                  <div className="pill pill-soft">Ψηφοφορία</div>
                  <div className="muted small">{formatDateTime(poll.createdAt)}</div>
                </div>

                <h3 className="poll-question">
                  <Link to={`/polls/${poll.id}`}>{poll.question}</Link>
                </h3>

                <div className="poll-meta-row">
                  <span className="muted small">
                    {poll.isAnonymousCreator
                      ? "Ανώνυμος δημιουργός"
                      : `Δημιουργός: ${poll.createdBy?.displayName || "—"}`}
                  </span>
                  {poll.anonymousResponses && <span className="pill pill-ghost">Ανώνυμες ψήφοι</span>}
                </div>

                {(poll.allowUserOptions || poll.voteClosingDate) && (
                  <div className="poll-meta-row">
                    {poll.allowUserOptions && <span className="pill pill-ghost">Ανοικτό για νέες επιλογές</span>}
                    {poll.voteClosingDate && (
                      <span className="pill pill-ghost">
                        Λήξη: {formatDateTime(poll.voteClosingDate)}
                      </span>
                    )}
                  </div>
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

                {(poll.region || poll.cityOrVillage) && (
                  <p className="muted small">
                    Τοποθεσία: {[poll.region, poll.cityOrVillage].filter(Boolean).join(" • ")}
                  </p>
                )}

                {poll.anonymousResponses && (
                  <p className="muted small">Οι ψήφοι καταγράφονται ανώνυμα — μία συμμετοχή ανά συσκευή.</p>
                )}

                <div className="poll-options-list">
                  {poll.options.map((option) => {
                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                    const disabled = voteStatus.submitting || cancelStatus.cancelling;
                    const isVotedOption = poll.votedOptionId === option.id;
                    const isPending = option.status === "pending";

                    if (poll.optionsArePeople) {
                      // Render person card
                      const photoSrc = option.photo || option.photoUrl;
                      return (
                        <div key={option.id} className={`poll-option person-option ${isPending ? "pending" : ""}`}>
                          {photoSrc && <img src={photoSrc} alt={option.text} className="person-photo" />}
                          <div className="poll-option-content">
                            <div className="poll-option-header">
                              <div className="poll-option-title">
                                {option.text}
                                {isPending && <span className="pending-badge">Εκκρεμεί</span>}
                                {isVotedOption && <span className="muted"> (Η ψήφος σας)</span>}
                              </div>
                              <div className="muted small">
                                {option.votes} ψήφοι {totalVotes > 0 ? `• ${percentage}%` : ""}
                              </div>
                            </div>
                            {option.profileUrl && (
                              <a href={option.profileUrl} target="_blank" rel="noopener noreferrer" className="person-link">
                                {option.profileUrl}
                              </a>
                            )}
                            <div className="progress-track" aria-hidden>
                              <div className="progress-bar" style={{ width: `${percentage}%` }} />
                            </div>
                            {!isPending && (poll.hasVoted ? (
                              !isVotedOption && (
                                <button
                                  className="btn btn-outline"
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => handleVote(poll, option.id)}
                                >
                                  {voteStatus.submitting ? "Αλλαγή..." : "Αλλαγή ψήφου"}
                                </button>
                              )
                            ) : (
                              <button
                                className="btn btn-outline"
                                type="button"
                                disabled={disabled}
                                onClick={() => handleVote(poll, option.id)}
                              >
                                {voteStatus.submitting ? "Καταχώρηση..." : "Ψήφισε"}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    // Normal mode rendering
                    return (
                      <div key={option.id} className="poll-option">
                        <div className="poll-option-header">
                          <div className="poll-option-title">
                            {option.text}
                            {isPending && <span className="pending-badge">Εκκρεμεί</span>}
                            {isVotedOption && <span className="muted"> (Η ψήφος σας)</span>}
                          </div>
                          <div className="muted small">
                            {option.votes} ψήφοι {totalVotes > 0 ? `• ${percentage}%` : ""}
                          </div>
                        </div>
                        <div className="progress-track" aria-hidden>
                          <div className="progress-bar" style={{ width: `${percentage}%` }} />
                        </div>
                        {!isPending && (poll.hasVoted ? (
                          !isVotedOption && (
                            <button
                              className="btn btn-outline"
                              type="button"
                              disabled={disabled}
                              onClick={() => handleVote(poll, option.id)}
                            >
                              {voteStatus.submitting ? "Αλλαγή..." : "Αλλαγή ψήφου"}
                            </button>
                          )
                        ) : (
                          <button
                            className="btn btn-outline"
                            type="button"
                            disabled={disabled}
                            onClick={() => handleVote(poll, option.id)}
                          >
                            {voteStatus.submitting ? "Καταχώρηση..." : "Ψήφισε"}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {poll.hasVoted && (
                  <div>
                    <p className="positive-text small">Έχετε ήδη ψηφίσει.</p>
                    <button
                      className="btn btn-subtle"
                      type="button"
                      disabled={cancelStatus.cancelling || voteStatus.submitting}
                      onClick={() => handleCancelVote(poll)}
                    >
                      {cancelStatus.cancelling ? "Ακύρωση..." : "Ακύρωση ψήφου"}
                    </button>
                  </div>
                )}
                {voteStatus.error && <p className="error-text">{voteStatus.error}</p>}
                {cancelStatus.error && <p className="error-text">{cancelStatus.error}</p>}
                
                <Link to={`/polls/${poll.id}`} className="link-primary">
                  Προβολή λεπτομερειών και στατιστικών →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
