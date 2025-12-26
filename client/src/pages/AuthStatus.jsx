import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const messages = {
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
  const [status, setStatus] = useState({ loading: true, user: null });
  const location = useLocation();
  const copy = messages[type] || messages.success;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/status`, {
          credentials: "include"
        });
        const data = await response.json();
        setStatus({ loading: false, user: data.user });
      } catch (error) {
        setStatus({ loading: false, user: null });
      }
    };

    fetchStatus();
  }, [location.pathname]);

  return (
    <div className="section narrow">
      <p className="label">Σύνδεση με κοινωνικό δίκτυο</p>
      <h2 className={`auth-heading ${copy.tone}`}>{copy.title}</h2>
      <p className="muted">{copy.detail}</p>

      {!status.loading && status.user && type === "success" && (
        <div className="auth-user-card">
          {status.user.avatar && (
            <img src={status.user.avatar} alt="Προφίλ" className="auth-avatar" />
          )}
          <div>
            <div className="auth-user-name">{status.user.displayName || "Χρήστης"}</div>
            {status.user.email && <div className="muted">{status.user.email}</div>}
            <div className="pill subtle">Πάροχος: {status.user.provider}</div>
          </div>
        </div>
      )}

      {!status.loading && !status.user && (
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
