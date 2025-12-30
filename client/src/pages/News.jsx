import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, createNews, getAuthStatus } from "../lib/api.js";

const hasReporterAccess = (user) => user && ["reporter", "admin"].includes(user.role);

export default function News() {
  const [status, setStatus] = useState({ loading: true, user: null, error: null });
  const [form, setForm] = useState({ title: "", content: "" });
  const [submission, setSubmission] = useState({ submitting: false, success: null, error: null });

  const loadSession = async () => {
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
            ? error.message || "Δεν ήταν δυνατή η ανάκτηση συνεδρίας."
            : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η ανάκτηση συνεδρίας.",
      });
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasReporterAccess(status.user)) {
      setSubmission({ submitting: false, success: null, error: "Δεν έχετε δικαίωμα προσθήκης ειδήσεων." });
      return;
    }

    const trimmedTitle = form.title.trim();
    const trimmedContent = form.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setSubmission({ submitting: false, success: null, error: "Συμπληρώστε τίτλο και περιεχόμενο." });
      return;
    }

    setSubmission({ submitting: true, success: null, error: null });

    try {
      await createNews({ title: trimmedTitle, content: trimmedContent });
      setSubmission({ submitting: false, success: "Η είδηση προστέθηκε με επιτυχία.", error: null });
      setForm({ title: "", content: "" });
    } catch (error) {
      setSubmission({
        submitting: false,
        success: null,
        error: error.message || "Δεν ήταν δυνατή η προσθήκη της είδησης.",
      });
    }
  };

  const { loading, user, error } = status;
  const canSubmitNews = hasReporterAccess(user);

  return (
    <div className="section narrow">
      <p className="pill">Ειδήσεις</p>
      <h1 className="section-title">Διαχείριση περιεχομένου</h1>
      <p className="muted">Οι συντάκτες και οι διαχειριστές μπορούν να καταχωρήσουν νέες ειδήσεις.</p>

      <div className="card auth-card stack">
        {loading && <p className="muted">Φόρτωση συνεδρίας...</p>}

        {!loading && error && <p className="error-text">{error}</p>}

        {!loading && !error && !user && (
          <div className="stack">
            <p className="muted">Χρειάζεται σύνδεση για να καταχωρήσετε ειδήσεις.</p>
            <div className="cta-row">
              <Link className="btn" to="/auth">
                Σύνδεση
              </Link>
              <Link className="btn btn-outline" to="/register">
                Δημιουργία λογαριασμού
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && user && !canSubmitNews && (
          <div className="stack">
            <p className="muted">Έχετε συνδεθεί ως {user.displayName || "χρήστης"}.</p>
            <p className="error-text">Ο ρόλος σας δεν επιτρέπει την προσθήκη ειδήσεων.</p>
          </div>
        )}

        {!loading && !error && canSubmitNews && (
          <form className="stack" onSubmit={handleSubmit}>
            <div className="info-grid">
              <div>
                <p className="label">Τίτλος</p>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="Προσθέστε έναν περιγραφικό τίτλο"
                />
              </div>
              <div>
                <p className="label">Περιεχόμενο</p>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Γράψτε το κείμενο της είδησης"
                />
              </div>
            </div>

            {submission.error && <p className="error-text">{submission.error}</p>}
            {submission.success && <p className="positive-text">{submission.success}</p>}

            <div className="actions-row">
              <button type="button" className="btn btn-outline" onClick={loadSession} disabled={loading}>
                Ανανέωση συνεδρίας
              </button>
              <button type="submit" className="btn" disabled={submission.submitting}>
                {submission.submitting ? "Καταχώρηση..." : "Καταχώρηση είδησης"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
