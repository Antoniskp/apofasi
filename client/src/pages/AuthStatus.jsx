import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";

const statusMessages = {
  success: {
    title: "Η σύνδεση ολοκληρώθηκε",
    detail: "Επιστρέψτε στην αρχική σελίδα για να συνεχίσετε.",
    tone: "positive"
  },
  error: {
    title: "Η προσπάθεια σύνδεσης απέτυχε",
    detail: "Παρακαλώ δοκιμάστε ξανά ή χρησιμοποιήστε άλλο πάροχο.",
    tone: "negative"
  }
};

export default function AuthStatus({ type = "success" }) {
  const { user, loading, error, refreshAuth } = useAuth();
  const location = useLocation();
  const copy = statusMessages[type] || statusMessages.success;

  useEffect(() => {
    // Refresh auth status when this page loads (after OAuth redirect)
    refreshAuth();
  }, [location.pathname, refreshAuth]);

  return (
    <div className="section narrow">
      <p className="label">Σύνδεση με κοινωνικό δίκτυο</p>
      <h2 className={`auth-heading ${copy.tone}`}>{copy.title}</h2>
      <p className="muted">{copy.detail}</p>

      {!loading && user && type === "success" && (
        <div className="auth-user-card">
          {user.avatar && (
            <img src={user.avatar} alt="Προφίλ" className="auth-avatar" />
          )}
          <div>
            <div className="auth-user-name">{user.displayName || "Χρήστης"}</div>
            {user.email && <div className="muted">{user.email}</div>}
            <div className="pill subtle">Πάροχος: {user.provider}</div>
          </div>
        </div>
      )}

      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !user && !error && (
        <p className="error-text">Δεν εντοπίστηκε ενεργή συνεδρία.</p>
      )}

      <div className="cta-row">
        <Link to="/" className="btn">
          Επιστροφή στην αρχική
        </Link>
        <Link to="/news" className="btn btn-outline">
          Μετάβαση στις ειδήσεις
        </Link>
      </div>
    </div>
  );
}
