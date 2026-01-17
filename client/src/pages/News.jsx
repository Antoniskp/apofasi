import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, listArticles } from "../lib/api.js";

const hasEditorAccess = (user) => user && ["reporter", "editor", "admin"].includes(user.role);

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("el-GR", { dateStyle: "medium", timeStyle: "short" });
};

export default function News() {
  const [status, setStatus] = useState({ loading: true, user: null, error: null });
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
      const articlesData = await listArticles();
      
      // Filter articles that are tagged as news and sort by date
      const newsArticles = (articlesData.articles || [])
        .filter(article => article.isNews)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setNewsFeed({ loading: false, news: newsArticles, error: null });
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

  const { user } = status;
  const canManageNews = hasEditorAccess(user);

  return (
    <div className="section">
      <p className="pill">Ειδήσεις</p>
      <h1 className="section-title">Ειδήσεις</h1>
      <p className="muted">
        Οι συντάκτες και οι διαχειριστές μπορούν να επισημαίνουν άρθρα ως ειδήσεις.
        {canManageNews && " Επισκεφθείτε τη σελίδα άρθρων για να δημιουργήσετε νέα άρθρα."}
      </p>

      {canManageNews && (
        <div className="card auth-card stack" style={{ marginTop: "1rem" }}>
          <div className="stack">
            <p className="muted">Έχετε συνδεθεί ως {user.displayName || "χρήστης"}.</p>
            <p>Για να προσθέσετε νέα είδηση:</p>
            <ol style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
              <li>Δημιουργήστε ένα νέο άρθρο στη σελίδα <Link to="/articles">Άρθρα</Link></li>
              <li>Ανοίξτε το άρθρο και επιλέξτε &quot;Επισήμανση ως Είδηση&quot;</li>
            </ol>
            <div className="cta-row">
              <Link className="btn" to="/articles/new">
                ✚ Δημιουργία Νέου Άρθρου
              </Link>
              <Link className="btn btn-outline" to="/articles">
                Προβολή Όλων των Άρθρων
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Πρόσφατες ειδήσεις</h2>
        </div>

        {newsFeed.loading && <p className="muted">Φόρτωση ειδήσεων...</p>}
        {newsFeed.error && <p className="error-text">{newsFeed.error}</p>}

        {!newsFeed.loading && !newsFeed.error && newsFeed.news.length === 0 && (
          <div className="card muted-border">
            <p className="muted">Δεν έχουν επισημανθεί άρθρα ως ειδήσεις ακόμα.</p>
          </div>
        )}

        <div className="responsive-card-grid">
          {newsFeed.news.map((article) => (
            <div key={article.id} className="card compact-card">
              {article.photo || article.photoUrl ? (
                <img
                  src={article.photo || article.photoUrl}
                  alt={article.title}
                  className="article-cover"
                />
              ) : null}
              <div className="story-header">
                <div>
                  <div className="story-title">
                    <Link to={`/articles/${article.id}`}>{article.title}</Link>
                  </div>
                  <div className="muted small">{formatDateTime(article.createdAt)}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {article.author?.displayName && <div className="pill pill-soft">{article.author.displayName}</div>}
                </div>
              </div>
              {article.subtitle && <p className="article-subtitle">{article.subtitle}</p>}
              <p>{article.content.substring(0, 300)}{article.content.length > 300 ? "..." : ""}</p>
              <Link to={`/articles/${article.id}`} style={{ color: "#0066cc", textDecoration: "none" }}>
                Διαβάστε περισσότερα →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
