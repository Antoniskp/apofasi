import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, getPoll, voteOnPoll, cancelVoteOnPoll } from "../lib/api.js";

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("el-GR", { dateStyle: "medium", timeStyle: "short" });
};

export default function PollDetail() {
  const { pollId } = useParams();
  const [authState, setAuthState] = useState({ loading: true, user: null, error: null });
  const [pollState, setPollState] = useState({ loading: true, poll: null, error: null });
  const [voteState, setVoteState] = useState({ submitting: false, error: null });
  const [cancelState, setCancelState] = useState({ cancelling: false, error: null });

  const totalVotes = useMemo(() => pollState.poll?.totalVotes || 0, [pollState.poll]);

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

  const loadPoll = async () => {
    if (!pollId) return;
    setPollState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getPoll(pollId);
      setPollState({ loading: false, poll: data.poll, error: null });
    } catch (error) {
      setPollState({
        loading: false,
        poll: null,
        error: API_BASE_URL
          ? error.message || "Δεν ήταν δυνατή η φόρτωση της ψηφοφορίας."
          : "Ορίστε το VITE_API_BASE_URL για να φορτώσει η ψηφοφορία.",
      });
    }
  };

  useEffect(() => {
    loadAuthStatus();
    loadPoll();
  }, [pollId]);

  const handleVote = async (optionId) => {
    if (!pollState.poll) return;

    if (!optionId || typeof optionId !== "string") {
      setVoteState({ submitting: false, error: "Επιλέξτε μία από τις διαθέσιμες απαντήσεις." });
      return;
    }

    if (!pollState.poll.anonymousResponses && !authState.user) {
      setVoteState({ submitting: false, error: "Χρειάζεται σύνδεση για να ψηφίσετε." });
      return;
    }

    setVoteState({ submitting: true, error: null });

    try {
      const response = await voteOnPoll(pollState.poll.id, optionId);
      setPollState((prev) => ({ ...prev, poll: response.poll }));
      setVoteState({ submitting: false, error: null });
    } catch (error) {
      setVoteState({
        submitting: false,
        error: error.message || "Η ψήφος δεν καταχωρήθηκε.",
      });
    }
  };

  const handleCancelVote = async () => {
    if (!pollState.poll) return;

    setCancelState({ cancelling: true, error: null });

    try {
      const response = await cancelVoteOnPoll(pollState.poll.id);
      setPollState((prev) => ({ ...prev, poll: response.poll }));
      setCancelState({ cancelling: false, error: null });
      setVoteState({ submitting: false, error: null });
    } catch (error) {
      setCancelState({
        cancelling: false,
        error: error.message || "Η ακύρωση της ψήφου απέτυχε.",
      });
    }
  };

  const { loading: authLoading, error: authError } = authState;
  const { loading: pollLoading, poll, error: pollError } = pollState;

  return (
    <div className="section narrow">
      <p className="pill">Ψηφοφορίες</p>
      <div className="section-header">
        <h1 className="section-title">Λεπτομέρειες ψηφοφορίας</h1>
        <div className="cta-row">
          <Link className="btn btn-outline" to="/polls">
            Πίσω στις ψηφοφορίες
          </Link>
        </div>
      </div>

      {authLoading && <p className="muted">Φόρτωση συνεδρίας...</p>}
      {!authLoading && authError && <p className="error-text">{authError}</p>}

      {pollLoading && <p className="muted">Φόρτωση ψηφοφορίας...</p>}
      {!pollLoading && pollError && <p className="error-text">{pollError}</p>}

      {!pollLoading && !pollError && poll && (
        <div className="card poll-card modern-card">
          <div className="poll-header-row">
            <div className="pill pill-soft">Ψηφοφορία</div>
            <div className="muted small">{formatDateTime(poll.createdAt)}</div>
          </div>

          <h3 className="poll-question">{poll.question}</h3>

          <div className="poll-meta-row">
            <span className="muted small">
              {poll.isAnonymousCreator ? "Ανώνυμος δημιουργός" : `Δημιουργός: ${poll.createdBy?.displayName || "—"}`}
            </span>
            {poll.anonymousResponses && <span className="pill pill-ghost">Ανώνυμες ψήφοι</span>}
          </div>

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
              const disabled = voteState.submitting || cancelState.cancelling;
              const isVotedOption = poll.votedOptionId === option.id;

              return (
                <div key={option.id} className="poll-option">
                  <div className="poll-option-header">
                    <div className="poll-option-title">
                      {option.text}
                      {isVotedOption && <span className="muted"> (Η ψήφος σας)</span>}
                    </div>
                    <div className="muted small">
                      {option.votes} ψήφοι {totalVotes > 0 ? `• ${percentage}%` : ""}
                    </div>
                  </div>
                  <div className="progress-track" aria-hidden>
                    <div className="progress-bar" style={{ width: `${percentage}%` }} />
                  </div>
                  {poll.hasVoted ? (
                    !isVotedOption && (
                      <button
                        className="btn btn-outline"
                        type="button"
                        disabled={disabled}
                        onClick={() => handleVote(option.id)}
                      >
                        {voteState.submitting ? "Αλλαγή..." : "Αλλαγή ψήφου"}
                      </button>
                    )
                  ) : (
                    <button
                      className="btn btn-outline"
                      type="button"
                      disabled={disabled}
                      onClick={() => handleVote(option.id)}
                    >
                      {voteState.submitting ? "Καταχώρηση..." : "Ψήφισε"}
                    </button>
                  )}
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
                disabled={cancelState.cancelling || voteState.submitting}
                onClick={handleCancelVote}
              >
                {cancelState.cancelling ? "Ακύρωση..." : "Ακύρωση ψήφου"}
              </button>
            </div>
          )}
          {voteState.error && <p className="error-text">{voteState.error}</p>}
          {cancelState.error && <p className="error-text">{cancelState.error}</p>}
        </div>
      )}
    </div>
  );
}
