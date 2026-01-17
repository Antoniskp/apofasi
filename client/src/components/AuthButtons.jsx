import { useEffect, useState } from "react";
import { API_BASE_URL, getAuthStatus, logoutUser } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

const providers = [
  {
    id: "google",
    label: "Σύνδεση με Google",
    className: "auth-btn google",
    iconClass: "fa-brands fa-google"
  },
  {
    id: "facebook",
    label: "Σύνδεση με Facebook",
    className: "auth-btn facebook",
    iconClass: "fa-brands fa-facebook-f"
  },
  {
    id: "github",
    label: "Σύνδεση με GitHub",
    className: "auth-btn github",
    iconClass: "fa-brands fa-github"
  }
];

export default function AuthButtons() {
  const { user: authUser, refreshAuth } = useAuth();
  const [status, setStatus] = useState({
    loading: true,
    error: null,
    providers: {}
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadStatus = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getAuthStatus();
      setStatus({
        loading: false,
        error: null,
        providers: data.providers || {}
      });
    } catch (error) {
      setStatus({
        loading: false,
        error:
          API_BASE_URL
            ? error.message || "Αποτυχία ελέγχου κατάστασης. Ελέγξτε ότι ο server τρέχει."
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
      await logoutUser();
      await refreshAuth();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const hasEnabledProviders = Object.values(status.providers || {}).some(Boolean);

  return (
    <div className="card auth-card">
      <div className="auth-card-header">
        <div>
          <p className="label">Εναλλακτική σύνδεση</p>
          <h3>Είσοδος με κοινωνικούς λογαριασμούς</h3>
          <p className="muted">
            Μπορείτε επίσης να συνδεθείτε με Google, Facebook ή GitHub για να αποθηκεύσετε συμμετοχές και προτιμήσεις.
          </p>
          {!hasEnabledProviders && (
            <p className="muted small">Θα ενεργοποιηθεί μόλις προστεθούν τα κλειδιά OAuth.</p>
          )}
        </div>
        {authUser && (
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
              aria-label={provider.label}
              title={isEnabled ? provider.label : "Θα είναι διαθέσιμο όταν ενεργοποιηθούν τα κλειδιά."}
              onClick={() => {
                if (isEnabled) {
                  window.location.href = `${API_BASE_URL}/auth/${provider.id}`;
                }
              }}
            >
              <span className="auth-btn-icon" aria-hidden>
                <i className={provider.iconClass}></i>
              </span>
              <span className="sr-only">{provider.label}</span>
            </button>
          );
        })}
      </div>

      {authUser && (
        <div className="auth-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Αποσύνδεση..." : "Αποσύνδεση"}
          </button>
        </div>
      )}

      {status.error && <p className="error-text small">{status.error}</p>}
    </div>
  );
}
