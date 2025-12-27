import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, logoutUser } from "../lib/api.js";

export default function Profile() {
  const [status, setStatus] = useState({ loading: true, user: null, error: null });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadProfile = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getAuthStatus();
      setStatus({ loading: false, user: data.user, error: null });
    } catch (error) {
      setStatus({
        loading: false,
        user: null,
        error:
          API_BASE_URL
            ? error.message || "Δεν ήταν δυνατή η φόρτωση προφίλ."
            : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η φόρτωση προφίλ."
      });
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      await loadProfile();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const { loading, user, error } = status;

  return (
    <div className="section narrow">
      <p className="pill">Προφίλ</p>
      <h1 className="section-title">Το προφίλ σας</h1>
      <p className="muted">Προβάλλετε τα στοιχεία σύνδεσης και την κατάσταση της συνεδρίας σας.</p>

      <div className="card auth-card">
        {loading && <p className="muted">Φόρτωση προφίλ...</p>}

        {!loading && user && (
          <div className="stack">
            <div className="auth-user">
              {user.avatar && <img src={user.avatar} alt="Προφίλ" className="auth-avatar" />}
              <div>
                <div className="auth-user-name">{user.displayName || "Χρήστης"}</div>
                {user.email && <div className="muted">{user.email}</div>}
                <div className="pill subtle">Πάροχος: {user.provider}</div>
              </div>
            </div>

            <div className="info-grid">
              <div>
                <p className="label">User ID</p>
                <p className="muted small">{user.id}</p>
              </div>
              {user.username && (
                <div>
                  <p className="label">Username</p>
                  <p className="muted small">{user.username}</p>
                </div>
              )}
            </div>

            <div className="actions-row">
              <button type="button" className="btn" onClick={loadProfile} disabled={loading}>
                Ανανέωση
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleLogout}
                disabled={!user || isLoggingOut}
              >
                {isLoggingOut ? "Αποσύνδεση..." : "Αποσύνδεση"}
              </button>
            </div>
          </div>
        )}

        {!loading && !user && (
          <div className="stack">
            <p className="muted">Δεν βρέθηκε ενεργή συνεδρία.</p>
            <Link to="/register" className="menu-auth-btn">
              Δημιουργία λογαριασμού
            </Link>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}
