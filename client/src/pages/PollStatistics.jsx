import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, getPoll, getPollStatistics } from "../lib/api.js";

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("el-GR", { dateStyle: "medium", timeStyle: "short" });
};

const genderLabels = {
  male: "Άνδρας",
  female: "Γυναίκα",
  other: "Άλλο",
  prefer_not_to_say: "Προτιμώ να μην πω",
  unknown: "Άγνωστο"
};

export default function PollStatistics() {
  const { pollId } = useParams();
  const [authState, setAuthState] = useState({ loading: true, user: null, error: null });
  const [pollState, setPollState] = useState({ loading: true, poll: null, error: null });
  const [statsState, setStatsState] = useState({ loading: true, statistics: null, error: null });

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

  const loadStatistics = async () => {
    if (!pollId) return;
    setStatsState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getPollStatistics(pollId);
      setStatsState({ loading: false, statistics: data.statistics, error: null });
    } catch (error) {
      setStatsState({
        loading: false,
        statistics: null,
        error: API_BASE_URL
          ? error.message || "Δεν ήταν δυνατή η ανάκτηση στατιστικών."
          : "Ορίστε το VITE_API_BASE_URL για να φορτώσουν τα στατιστικά.",
      });
    }
  };

  useEffect(() => {
    loadAuthStatus();
    loadPoll();
    loadStatistics();
  }, [pollId]);

  const { loading: authLoading, error: authError } = authState;
  const { loading: pollLoading, poll, error: pollError } = pollState;
  const { loading: statsLoading, statistics, error: statsError } = statsState;

  return (
    <div className="section narrow">
      <p className="pill">Στατιστικά</p>
      <div className="section-header">
        <h1 className="section-title">Στατιστικά ψηφοφορίας</h1>
        <div className="cta-row">
          <Link className="btn btn-outline" to={`/polls/${pollId}`}>
            Πίσω στην ψηφοφορία
          </Link>
          <Link className="btn btn-outline" to="/polls">
            Όλες οι ψηφοφορίες
          </Link>
        </div>
      </div>

      {authLoading && <p className="muted">Φόρτωση συνεδρίας...</p>}
      {!authLoading && authError && <p className="error-text">{authError}</p>}

      {pollLoading && <p className="muted">Φόρτωση ψηφοφορίας...</p>}
      {!pollLoading && pollError && <p className="error-text">{pollError}</p>}

      {!pollLoading && !pollError && poll && (
        <div className="card modern-card">
          <h3 className="poll-question">{poll.question}</h3>
          <div className="poll-meta-row">
            <span className="muted small">
              {poll.isAnonymousCreator ? "Ανώνυμος δημιουργός" : `Δημιουργός: ${poll.createdBy?.displayName || "—"}`}
            </span>
            <span className="muted small">{formatDateTime(poll.createdAt)}</span>
          </div>
        </div>
      )}

      {statsLoading && <p className="muted">Φόρτωση στατιστικών...</p>}
      {!statsLoading && statsError && <p className="error-text">{statsError}</p>}

      {!statsLoading && !statsError && statistics && (
        <>
          {statistics.message && (
            <div className="card modern-card">
              <p className="muted">{statistics.message}</p>
              <p className="muted small">Σύνολο ψήφων: {statistics.totalVotes}</p>
            </div>
          )}

          {!statistics.message && (
            <>
              <div className="card modern-card">
                <h2 className="section-title">Συνολικά στατιστικά</h2>
                <p className="muted">Σύνολο ψήφων: {statistics.totalVotes}</p>
              </div>

              {statistics.byGender && Object.keys(statistics.byGender).length > 0 && (
                <div className="card modern-card">
                  <h2 className="section-title">Στατιστικά ανά φύλο</h2>
                  <div className="stack">
                    {Object.entries(statistics.byGender).map(([option, genderData]) => (
                      <div key={option} className="stack">
                        <h3 className="poll-option-title">{option}</h3>
                        <div className="info-grid">
                          {Object.entries(genderData).map(([gender, count]) => (
                            count > 0 && (
                              <div key={gender}>
                                <p className="label">{genderLabels[gender] || gender}</p>
                                <p className="muted">{count} {count === 1 ? "ψήφος" : "ψήφοι"}</p>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {statistics.byUser && statistics.byUser.length > 0 && (
                <div className="card modern-card">
                  <h2 className="section-title">Ψήφοι ανά χρήστη</h2>
                  <div className="stack">
                    {statistics.byUser.map((vote, index) => (
                      <div key={index} className="muted-border" style={{ padding: "0.5rem", borderRadius: "4px" }}>
                        <p className="muted small">
                          <strong>{vote.user.displayName || vote.user.username || vote.user.email}</strong>
                        </p>
                        <p className="muted small">Ψήφισε: {vote.option}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
