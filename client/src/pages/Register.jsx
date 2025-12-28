import { useEffect, useState } from "react";
import { API_BASE_URL, getAuthStatus, loginUser, registerUser } from "../lib/api.js";
import { useNavigate } from "../lib/router.jsx";

export default function Register() {
  const [registerForm, setRegisterForm] = useState({ displayName: "", email: "", password: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
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
      setRegisterForm({ displayName: "", email: "", password: "" });
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Η εγγραφή απέτυχε. Δοκιμάστε ξανά.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setFeedback("");

    try {
      if (!apiConfigured) {
        throw new Error("Δεν έχει ρυθμιστεί το VITE_API_BASE_URL για το API.");
      }

      await loginUser(loginForm);
      setFeedback("Επιτυχής σύνδεση.");
      await loadStatus();
    } catch (err) {
      setError(err.message || "Η σύνδεση απέτυχε.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentUser = status.user;

  return (
    <div className="section narrow">
      <p className="pill">Εγγραφή με email</p>
      <h1 className="section-title">Δημιουργήστε ή συνδεθείτε σε λογαριασμό</h1>
      <p className="muted">
        Προσθέσαμε εγγραφή με email και κωδικό ώστε να μη χρειάζεται κοινωνικός λογαριασμός. Συμπληρώστε τα
        στοιχεία σας για να δημιουργήσετε λογαριασμό ή συνδεθείτε αν έχετε ήδη.
      </p>

      <div className="grid two-cols">
        <div className="card form-card">
          <h3>Νέα εγγραφή</h3>
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
        </div>

        <div className="card form-card">
          <h3>Ήδη εγγεγραμμένος/η;</h3>
          <p className="muted small">Συνδεθείτε με το email που χρησιμοποιήσατε κατά την εγγραφή.</p>
          <form className="stack" onSubmit={handleLogin}>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="name@example.com"
              />
            </label>
            <label className="field">
              <span>Κωδικός</span>
              <input
                type="password"
                name="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </label>
            <button type="submit" className="btn btn-outline" disabled={submitting || !apiConfigured}>
              {submitting ? "Σύνδεση..." : "Σύνδεση"}
            </button>
          </form>
          {!apiConfigured && (
            <p className="error-text">
              Ρυθμίστε το VITE_API_BASE_URL για να επιτρέψετε τη σύνδεση λογαριασμού.
            </p>
          )}
          <div className="muted small">
            <p>Δεν χρησιμοποιούμε τρίτους παρόχους για τη σύνδεση με email.</p>
          </div>
        </div>
      </div>

      {feedback && <p className="success-text">{feedback}</p>}
      {error && <p className="error-text">{error}</p>}

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
