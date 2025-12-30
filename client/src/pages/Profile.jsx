import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, logoutUser } from "../lib/api.js";

export default function Profile() {
  const [status, setStatus] = useState({ loading: true, user: null, error: null });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const optionalFields = [
    { key: "firstName", label: "Όνομα", placeholder: "Δεν έχει προστεθεί ακόμα." },
    { key: "lastName", label: "Επώνυμο", placeholder: "Προσθέστε το επώνυμό σας." },
    { key: "username", label: "Username", placeholder: "Επιλέξτε ένα όνομα χρήστη όταν είναι διαθέσιμο." },
    { key: "mobile", label: "Κινητό", placeholder: "Μπορείτε να δηλώσετε ένα κινητό για ειδοποιήσεις." },
    { key: "country", label: "Χώρα", placeholder: "Προσθέστε τη χώρα διαμονής σας." },
    { key: "occupation", label: "Επάγγελμα", placeholder: "Προαιρετική επαγγελματική πληροφορία." }
  ];

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

  const renderOptionalField = (field) => {
    const value = user?.[field.key];
    return (
      <div key={field.key} className={`profile-field ${value ? "" : "profile-field-empty"}`}>
        <div className="profile-field-header">
          <p className="label">{field.label}</p>
          {!value && <span className="tag">Προαιρετικό</span>}
        </div>
        <p className={`profile-field-value ${value ? "" : "muted"}`}>{value || field.placeholder}</p>
      </div>
    );
  };

  return (
    <div className="section narrow">
      <p className="pill">Προφίλ</p>
      <h1 className="section-title">Το προφίλ σας</h1>
      <p className="muted">Προβάλλετε τα στοιχεία σύνδεσης και την κατάσταση της συνεδρίας σας.</p>

      <div className="card auth-card">
        {loading && <p className="muted">Φόρτωση προφίλ...</p>}

        {!loading && user && (
          <div className="stack profile-stack">
            <div className="profile-header">
              <div className="auth-user">
                {user.avatar && <img src={user.avatar} alt="Προφίλ" className="auth-avatar" />}
                <div>
                  <div className="auth-user-name">{user.displayName || "Χρήστης"}</div>
                  {(user.firstName || user.lastName) && (
                    <div className="muted">{[user.firstName, user.lastName].filter(Boolean).join(" ")}</div>
                  )}
                  {user.email && <div className="muted">{user.email}</div>}
                  <div className="pill subtle">Σύνδεση μέσω {user.provider}</div>
                </div>
              </div>

              <div className="profile-meta">
                <p className="label">Κατάσταση συνεδρίας</p>
                <p className="pill positive">Συνδεδεμένος/η</p>
                <p className="muted small">
                  Δείτε τα στοιχεία που έχουμε για εσάς και συμπληρώστε τα προαιρετικά πεδία όταν γίνουν διαθέσιμα.
                </p>
              </div>
            </div>

            <div className="profile-highlight">
              <div>
                <p className="label">User ID</p>
                <p className="muted small mono">{user.id}</p>
              </div>
              <div>
                <p className="label">Πάροχος</p>
                <p className="pill subtle">{user.provider}</p>
              </div>
            </div>

            <div className="profile-section">
              <div>
                <h3>Προαιρετικά στοιχεία</h3>
                <p className="muted small">
                  Εμπλουτίστε το προφίλ σας προσθέτοντας όνομα, στοιχεία επικοινωνίας ή επαγγελματικές πληροφορίες.
                </p>
              </div>
              <div className="profile-grid">{optionalFields.map(renderOptionalField)}</div>
            </div>

            <div className="profile-section">
              <h3>Βασικά στοιχεία επικοινωνίας</h3>
              <div className="profile-grid">
                <div className="profile-field">
                  <p className="label">Email</p>
                  <p className="profile-field-value">{user.email || "Δεν έχει δηλωθεί email"}</p>
                </div>
                <div className="profile-field">
                  <p className="label">Όνομα εμφάνισης</p>
                  <p className="profile-field-value">{user.displayName || "Χρήστης"}</p>
                </div>
              </div>
            </div>

            <div className="actions-row profile-actions">
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
