import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyArticles, getAuthStatus, deleteArticle, API_BASE_URL } from "../lib/api.js";

export default function MyArticles() {
  const [authState, setAuthState] = useState({ loading: true, user: null });
  const [articlesState, setArticlesState] = useState({ loading: true, articles: [], error: null });
  const [deleteState, setDeleteState] = useState({ deleting: null, error: null });

  const loadAuthStatus = async () => {
    try {
      const data = await getAuthStatus();
      setAuthState({ loading: false, user: data.user });
    } catch {
      setAuthState({ loading: false, user: null });
    }
  };

  const loadMyArticles = async () => {
    setArticlesState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getMyArticles();
      setArticlesState({ loading: false, articles: data.articles || [], error: null });
    } catch (error) {
      setArticlesState({
        loading: false,
        articles: [],
        error: API_BASE_URL
          ? error.message || "Δεν ήταν δυνατή η ανάκτηση των άρθρων σας."
          : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η ανάκτηση άρθρων.",
      });
    }
  };

  useEffect(() => {
    loadAuthStatus();
    loadMyArticles();
  }, []);

  const handleDelete = async (articleId, title) => {
    if (!window.confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε το άρθρο "${title}";`)) {
      return;
    }

    setDeleteState({ deleting: articleId, error: null });

    try {
      await deleteArticle(articleId);
      setArticlesState((prev) => ({
        ...prev,
        articles: prev.articles.filter((a) => a.id !== articleId),
      }));
      setDeleteState({ deleting: null, error: null });
    } catch (error) {
      setDeleteState({
        deleting: null,
        error: error.message || "Δεν ήταν δυνατή η διαγραφή του άρθρου.",
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("el-GR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="section">
      <p className="pill">Άρθρα</p>
      <div className="section-header">
        <h1 className="section-title">Τα Άρθρα μου</h1>
        {authState.user && (
          <div className="cta-row">
            <Link to="/articles/new" className="btn btn-primary">
              ✚ Νέο Άρθρο
            </Link>
            <Link to="/articles" className="btn btn-outline">
              Όλα τα Άρθρα
            </Link>
          </div>
        )}
      </div>

      {authState.loading && <p className="muted">Φόρτωση συνεδρίας...</p>}

      {!authState.loading && !authState.user && (
        <div className="card auth-card stack">
          <p className="muted">Χρειάζεται σύνδεση για να δείτε τα άρθρα σας.</p>
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

      {!authState.loading && authState.user && (
        <>
          {articlesState.loading && <p className="muted">Φόρτωση άρθρων...</p>}

          {articlesState.error && (
            <div className="card compact-card error-text">{articlesState.error}</div>
          )}

          {deleteState.error && (
            <div className="card compact-card error-text">{deleteState.error}</div>
          )}

          {!articlesState.loading && !articlesState.error && articlesState.articles.length === 0 && (
            <div className="card compact-card">
              <p className="muted">Δεν έχετε δημιουργήσει άρθρα ακόμα.</p>
            </div>
          )}

          {!articlesState.loading && articlesState.articles.length > 0 && (
            <div className="responsive-card-grid">
              {articlesState.articles.map((article) => (
                <div key={article.id} className="card compact-card">
                  {article.photo || article.photoUrl ? (
                    <img
                      src={article.photo || article.photoUrl}
                      alt={article.title}
                      className="article-cover"
                    />
                  ) : null}
                  <div className="article-header-row">
                    <div className="pill pill-soft">Άρθρο</div>
                    <div className="muted small">{formatDate(article.createdAt)}</div>
                  </div>

                  <h3 className="article-title">
                    <Link to={`/articles/${article.id}`}>{article.title}</Link>
                  </h3>

                  {article.subtitle && (
                    <p className="article-subtitle">{article.subtitle}</p>
                  )}

                  <div className="article-meta-row">
                    {article.isNews && (
                      <span className="pill pill-ghost">📰 Είδηση</span>
                    )}
                  </div>

                  {article.tags && article.tags.length > 0 && (
                    <div className="chips">
                      {article.tags.map((tag, idx) => (
                        <span key={idx} className="chip">
                      #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {(article.region || article.cityOrVillage) && (
                    <p className="muted small">
                  📍 {[article.region, article.cityOrVillage].filter(Boolean).join(" • ")}
                    </p>
                  )}

                  <p className="article-preview">
                    {article.content.substring(0, 200)}
                    {article.content.length > 200 && "..."}
                  </p>

                  <div className="cta-row">
                    <Link to={`/articles/${article.id}`} className="btn btn-outline">
                  Προβολή
                    </Link>
                    <Link to={`/articles/${article.id}/edit`} className="btn btn-outline">
                  Επεξεργασία
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      disabled={deleteState.deleting === article.id}
                      className="btn btn-subtle"
                    >
                      {deleteState.deleting === article.id ? "Διαγραφή..." : "Διαγραφή"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
