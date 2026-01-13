import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, registerUser } from "../lib/api.js";
import AuthButtons from "../components/AuthButtons.jsx";

export default function Register() {
  const [registerForm, setRegisterForm] = useState({
    displayName: "",
    email: "",
    password: ""
  });
  const [status, setStatus] = useState({ loading: true, user: null });
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const apiConfigured = Boolean(API_BASE_URL);
  const navigate = useNavigate();

  const loadStatus = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));
    setError("");
    setFeedback("");
    try {
      const data = await getAuthStatus();
      setStatus({ loading: false, user: data.user });
    } catch (err) {
      setStatus({ loading: false, user: null });
      setError(
        API_BASE_URL
          ? err.message || "Δεν ήταν δυνατή η φόρτωση της κατάστασης."
          : "Ορίστε το VITE_API_BASE_URL για να γίνει η σύνδεση με τον server."
      );
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleRegister = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setFeedback("");

    try {
      if (!apiConfigured) {
        throw new Error("Δεν έχει ρυθμιστεί το VITE_API_BASE_URL για το API.");
      }

      const data = await registerUser(registerForm);
      setStatus({ loading: false, user: data.user });
      setFeedback("Η εγγραφή ολοκληρώθηκε! Συνδεθήκατε αυτόματα.");
      setRegisterForm({
        displayName: "",
        email: "",
        password: "",
      });
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Η εγγραφή απέτυχε. Δοκιμάστε ξανά.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentUser = status.user;

  return (
    <div className="section narrow">
      <p className="pill">Εγγραφή</p>
      <h1 className="section-title">Δημιουργήστε νέο λογαριασμό</h1>
      <p className="muted">
        Δημιουργήστε λογαριασμό με email και κωδικό ή με κοινωνικούς λογαριασμούς για να αποθηκεύετε προτιμήσεις και να συμμετέχετε σε ψηφοφορίες.
      </p>

      <div className="card form-card">
        <h3>Νέα εγγραφή με email</h3>
        <p className="muted small">Οι κωδικοί αποθηκεύονται με ασφαλή κρυπτογράφηση.</p>
        <form className="stack" onSubmit={handleRegister}>
          <label className="field">
            <span>Όνομα εμφάνισης</span>
            <input
              type="text"
              name="displayName"
              placeholder="Π.χ. Μαρία"
              value={registerForm.displayName}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, displayName: e.target.value }))
              }
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              required
              value={registerForm.email}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="name@example.com"
            />
          </label>
          <label className="field">
            <span>Κωδικός (τουλάχιστον 8 χαρακτήρες)</span>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              value={registerForm.password}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </label>
          <button type="submit" className="btn" disabled={submitting || !apiConfigured}>
            {submitting ? "Αποστολή..." : "Εγγραφή"}
          </button>
        </form>
        {!apiConfigured && (
          <p className="error-text">
            Ορίστε το VITE_API_BASE_URL για να ενεργοποιηθεί η εγγραφή χρήστη.
          </p>
        )}
        <div className="muted small">
          <p>
            Έχετε ήδη λογαριασμό; <Link to="/auth" className="link">Συνδεθείτε</Link>
          </p>
        </div>
      </div>

      {feedback && <p className="success-text">{feedback}</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="spacer" />
      <AuthButtons />

      <div className="card auth-status">
        {status.loading && <p className="muted">Έλεγχος συνεδρίας...</p>}
        {!status.loading && currentUser && (
          <div>
            <p className="pill subtle">Συνδεθήκατε</p>
            <h3>{currentUser.displayName || "Χρήστης"}</h3>
            {currentUser.email && <p className="muted">{currentUser.email}</p>}
            <p className="muted small">Πάροχος: {currentUser.provider}</p>
          </div>
        )}
        {!status.loading && !currentUser && (
          <p className="muted">Δεν έχει πραγματοποιηθεί σύνδεση ακόμα.</p>
        )}
      </div>
    </div>
  );
}
