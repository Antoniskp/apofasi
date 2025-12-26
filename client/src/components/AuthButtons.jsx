import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const providers = [
  {
    id: "google",
    label: "Σύνδεση με Google",
    description: "Χρησιμοποιήστε τον Google λογαριασμό σας",
    className: "auth-btn google"
  },
  {
    id: "facebook",
    label: "Σύνδεση με Facebook",
    description: "Χρησιμοποιήστε τον Facebook λογαριασμό σας",
    className: "auth-btn facebook"
  }
];

export default function AuthButtons() {
  const [status, setStatus] = useState({
    loading: true,
    user: null,
    error: null,
    providers: {}
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadStatus = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setStatus({
        loading: false,
        user: data.user,
        error: null,
        providers: data.providers || {}
      });
    } catch (error) {
      setStatus({
        loading: false,
        user: null,
        error:
          API_BASE_URL
            ? "Αποτυχία ελέγχου κατάστασης. Ελέγξτε ότι ο server τρέχει."
            : "Ορίστε το VITE_API_BASE_URL για να ενεργοποιήσετε τα κουμπιά σύνδεσης.",
        providers: {}
      });
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        credentials: "include"
      });
      await loadStatus();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="card auth-card">
      <div className="auth-card-header">
        <div>
          <p className="label">Σύνδεση χρήστη</p>
          <h3>Είσοδος με κοινωνικούς λογαριασμούς</h3>
          <p className="muted">
            Ξεκινήστε με Google ή Facebook για να αποθηκεύσετε συμμετοχές και προτιμήσεις.
          </p>
          {!Object.values(status.providers || {}).some(Boolean) && (
            <p className="muted small">Θα ενεργοποιηθεί μόλις προστεθούν τα κλειδιά OAuth.</p>
          )}
        </div>
        {status.user && (
          <div className="auth-badge">
            Συνδεδεμένος/η
          </div>
        )}
      </div>

      <div className="auth-actions">
        {providers.map((provider) => {
          const isEnabled = status.providers?.[provider.id];

          return (
            <button
              key={provider.id}
              type="button"
              className={provider.className}
              disabled={!isEnabled}
              onClick={() => {
                if (isEnabled) {
                  window.location.href = `${API_BASE_URL}/auth/${provider.id}`;
                }
              }}
            >
              <span className="auth-btn-label">{provider.label}</span>
              <span className="auth-btn-desc">
                {isEnabled
                  ? provider.description
                  : "Θα είναι διαθέσιμο όταν ενεργοποιηθούν τα κλειδιά."}
              </span>
            </button>
          );
        })}
      </div>

      <div className="auth-status">
        {status.loading && <p className="muted">Έλεγχος σύνδεσης...</p>}
        {!status.loading && status.user && (
          <div className="auth-user">
            {status.user.avatar && (
              <img src={status.user.avatar} alt="Προφίλ" className="auth-avatar" />
            )}
            <div>
              <div className="auth-user-name">{status.user.displayName || "Χρήστης"}</div>
              {status.user.email && <div className="muted">{status.user.email}</div>}
              <div className="pill subtle">Σύνδεση μέσω {status.user.provider}</div>
            </div>
          </div>
        )}
        {!status.loading && !status.user && (
          <p className="muted">Δεν έχετε συνδεθεί ακόμη.</p>
        )}
        {status.error && <p className="error-text">{status.error}</p>}
      </div>

      <div className="auth-footer">
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleLogout}
          disabled={!status.user || isLoggingOut}
        >
          {isLoggingOut ? "Αποσύνδεση..." : "Αποσύνδεση"}
        </button>
        <p className="muted">
          Χρησιμοποιούμε ασφαλή cookie συνεδρίας για να διατηρήσουμε τη σύνδεσή σας.
        </p>
      </div>
    </div>
  );
}
