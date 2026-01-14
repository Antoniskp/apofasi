import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, createNews, getAuthStatus, listNews, listArticles } from "../lib/api.js";

const hasReporterAccess = (user) => user && ["reporter", "admin"].includes(user.role);

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("el-GR", { dateStyle: "medium", timeStyle: "short" });
};

export default function News() {
  const [status, setStatus] = useState({ loading: true, user: null, error: null });
  const [form, setForm] = useState({ title: "", content: "" });
  const [submission, setSubmission] = useState({ submitting: false, success: null, error: null });
  const [newsFeed, setNewsFeed] = useState({ loading: true, news: [], error: null });

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

  const loadNews = async () => {
    setNewsFeed((prev) => ({ ...prev, loading: true }));

    try {
      const [newsData, articlesData] = await Promise.all([
        listNews(),
        listArticles()
      ]);
      
      // Filter articles that are tagged as news
      const newsArticles = (articlesData.articles || [])
        .filter(article => article.isNews)
        .map(article => ({
          ...article,
          isArticle: true  // Mark as article for rendering
        }));
      
      // Combine and sort by date
      const allNews = [
        ...(newsData.news || []),
        ...newsArticles
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setNewsFeed({ loading: false, news: allNews, error: null });
    } catch (error) {
      setNewsFeed({
        loading: false,
        news: [],
        error:
          API_BASE_URL
            ? error.message || "Δεν ήταν δυνατή η φόρτωση ειδήσεων."
            : "Ορίστε το VITE_API_BASE_URL για να φορτώσουν οι ειδήσεις.",
      });
    }
  };

  useEffect(() => {
    loadSession();
    loadNews();
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
      await loadNews();
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

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Πρόσφατες δημοσιεύσεις</h2>
        </div>

        <div className="toolbar-container">
          <div className="toolbar-right" style={{ marginLeft: "auto" }}>
            {canSubmitNews && (
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => {
                  setForm({ title: "", content: "" });
                  setSubmission({ submitting: false, success: null, error: null });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                ✚ Νέα είδηση
              </button>
            )}
          </div>
        </div>

        {newsFeed.loading && <p className="muted">Φόρτωση ειδήσεων...</p>}
        {newsFeed.error && <p className="error-text">{newsFeed.error}</p>}

        {!newsFeed.loading && !newsFeed.error && newsFeed.news.length === 0 && (
          <div className="card muted-border">
            <p className="muted">Δεν έχουν προστεθεί ειδήσεις ακόμα.</p>
          </div>
        )}

        <div className="compact-list">
          {newsFeed.news.map((item) => (
            <div key={item.id} className="card compact-card">
              <div className="story-header">
                <div>
                  <div className="story-title">
                    {item.isArticle ? (
                      <Link to={`/articles/${item.id}`}>{item.title}</Link>
                    ) : (
                      item.title
                    )}
                  </div>
                  <div className="muted small">{formatDateTime(item.createdAt)}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {item.isArticle && <span className="pill pill-soft" style={{ background: "#e3f2fd", color: "#1976d2" }}>Άρθρο</span>}
                  {item.author?.displayName && <div className="pill pill-soft">{item.author.displayName}</div>}
                </div>
              </div>
              <p>{item.content.substring(0, 300)}{item.content.length > 300 ? "..." : ""}</p>
              {item.isArticle && (
                <Link to={`/articles/${item.id}`} style={{ color: "#0066cc", textDecoration: "none" }}>
                  Διαβάστε περισσότερα →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
