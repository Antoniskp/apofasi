import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, getMyPolls, deletePoll } from "../lib/api.js";

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("el-GR", { dateStyle: "medium", timeStyle: "short" });
};

const getTotalVotes = (poll) => {
  if (typeof poll.totalVotes === "number") return poll.totalVotes;
  return (poll.options || []).reduce((sum, option) => sum + (option.votes || 0), 0);
};

export default function MyPolls() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({ loading: true, user: null, error: null });
  const [pollsState, setPollsState] = useState({ loading: true, polls: [], error: null });
  const [deleteState, setDeleteState] = useState({});

  const loadAuthStatus = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getAuthStatus();
      setAuthState({ loading: false, user: data.user, error: null });
      if (!data.user) {
        navigate("/auth");
      }
    } catch (error) {
      setAuthState({
        loading: false,
        user: null,
        error:
          API_BASE_URL
            ? error.message || "Δεν ήταν δυνατή η ανάκτηση συνεδρίας."
            : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η ανάκτηση συνεδρίας.",
      });
      navigate("/auth");
    }
  };

  const loadMyPolls = async () => {
    setPollsState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getMyPolls();
      setPollsState({ loading: false, polls: data.polls || [], error: null });
    } catch (error) {
      setPollsState({
        loading: false,
        polls: [],
        error: API_BASE_URL
          ? error.message || "Δεν ήταν δυνατή η φόρτωση των ψηφοφοριών σας."
          : "Ορίστε το VITE_API_BASE_URL για να φορτώσουν οι ψηφοφορίες.",
      });
    }
  };

  useEffect(() => {
    loadAuthStatus();
  }, []);

  useEffect(() => {
    if (authState.user) {
      loadMyPolls();
    }
  }, [authState.user]);

  const handleDelete = async (pollId) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την ψηφοφορία;")) {
      return;
    }

    setDeleteState((prev) => ({ ...prev, [pollId]: { deleting: true, error: null } }));

    try {
      await deletePoll(pollId);
      setPollsState((prev) => ({
        ...prev,
        polls: prev.polls.filter((poll) => poll.id !== pollId),
      }));
      setDeleteState((prev) => ({ ...prev, [pollId]: { deleting: false, error: null } }));
    } catch (error) {
      setDeleteState((prev) => ({
        ...prev,
        [pollId]: { deleting: false, error: error.message || "Η διαγραφή απέτυχε." },
      }));
    }
  };

  const { loading: authLoading, user, error: authError } = authState;
  const { loading: pollsLoading, polls, error: pollsError } = pollsState;

  return (
    <div className="section narrow">
      <p className="pill">Ψηφοφορίες</p>
      <div className="section-header">
        <h1 className="section-title">Οι ψηφοφορίες μου</h1>
        <div className="cta-row">
          <Link className="btn" to="/polls/new">
            Νέα ψηφοφορία
          </Link>
          <Link className="btn btn-outline" to="/polls">
            Όλες οι ψηφοφορίες
          </Link>
        </div>
      </div>

      {authLoading && <p className="muted">Φόρτωση...</p>}
      {!authLoading && authError && <p className="error-text">{authError}</p>}

      {!authLoading && user && (
        <>
          {pollsLoading && <p className="muted">Φόρτωση ψηφοφοριών...</p>}
          {pollsError && <p className="error-text">{pollsError}</p>}

          {!pollsLoading && !pollsError && polls.length === 0 && (
            <div className="card muted-border">
              <p className="muted">Δεν έχετε δημιουργήσει καμία ψηφοφορία ακόμα.</p>
            </div>
          )}

          <div className="responsive-card-grid">
            {polls.map((poll) => {
              const totalVotes = getTotalVotes(poll);
              const delStatus = deleteState[poll.id] || {};

              return (
                <div key={poll.id} className="card poll-card modern-card">
                  <div className="poll-header-row">
                    <div className="pill pill-soft">Ψηφοφορία</div>
                    <div className="muted small">{formatDateTime(poll.createdAt)}</div>
                  </div>

                  <h3 className="poll-question">{poll.question}</h3>

                  <div className="poll-meta-row">
                    <span className="muted small">Σύνολο ψήφων: {totalVotes}</span>
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

                  <div className="poll-options-list">
                    {poll.options.map((option) => {
                      const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

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
                        </div>
                      );
                    })}
                  </div>

                  <div className="cta-row">
                    <Link className="btn btn-outline" to={`/polls/${poll.id}`}>
                      Λεπτομέρειες
                    </Link>
                    <Link className="btn btn-outline" to={`/polls/${poll.id}/statistics`}>
                      Στατιστικά
                    </Link>
                    <button
                      className="btn btn-subtle"
                      type="button"
                      disabled={delStatus.deleting}
                      onClick={() => handleDelete(poll.id)}
                    >
                      {delStatus.deleting ? "Διαγραφή..." : "Διαγραφή"}
                    </button>
                  </div>
                  {delStatus.error && <p className="error-text">{delStatus.error}</p>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
