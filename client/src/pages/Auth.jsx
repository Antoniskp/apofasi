import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, loginUser } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";
import AuthButtons from "../components/AuthButtons.jsx";

export default function Auth() {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const { user: currentUser, loading: statusLoading, refreshAuth } = useAuth();
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const apiConfigured = Boolean(API_BASE_URL);
  const navigate = useNavigate();

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
      await refreshAuth();
      navigate("/");
    } catch (err) {
      setError(err.message || "Η σύνδεση απέτυχε.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section narrow">
      <p className="pill">Σύνδεση</p>
      <h1 className="section-title">Συνδεθείτε στον λογαριασμό σας</h1>
      <p className="muted">
        Συνδεθείτε με email και κωδικό ή με κοινωνικούς λογαριασμούς για να αποθηκεύετε προτιμήσεις και να συμμετέχετε σε ψηφοφορίες.
      </p>

      <div className="card form-card">
        <h3>Σύνδεση με email</h3>
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
          <button type="submit" className="btn" disabled={submitting || !apiConfigured}>
            {submitting ? "Σύνδεση..." : "Σύνδεση"}
          </button>
        </form>
        {!apiConfigured && (
          <p className="error-text">
            Ρυθμίστε το VITE_API_BASE_URL για να επιτρέψετε τη σύνδεση λογαριασμού.
          </p>
        )}
        <div className="muted small">
          <p>
            Δεν έχετε λογαριασμό; <Link to="/register" className="link">Δημιουργήστε έναν</Link>
          </p>
        </div>
      </div>

      {feedback && <p className="success-text">{feedback}</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="spacer" />
      <AuthButtons />

      <div className="card auth-status">
        {statusLoading && <p className="muted">Έλεγχος συνεδρίας...</p>}
        {!statusLoading && currentUser && (
          <div>
            <p className="pill subtle">Συνδεθήκατε</p>
            <h3>{currentUser.displayName || "Χρήστης"}</h3>
            {currentUser.email && <p className="muted">{currentUser.email}</p>}
            <p className="muted small">Πάροχος: {currentUser.provider}</p>
          </div>
        )}
        {!statusLoading && !currentUser && (
          <p className="muted">Δεν έχει πραγματοποιηθεί σύνδεση ακόμα.</p>
        )}
      </div>
    </div>
  );
}
