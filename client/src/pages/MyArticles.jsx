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

  if (authState.loading) {
    return (
      <div className="container">
        <p>Φόρτωση...</p>
      </div>
    );
  }

  if (!authState.user) {
    return (
      <div className="container">
        <h1>Τα Άρθρα μου</h1>
        <div className="message error">
          Πρέπει να συνδεθείτε για να δείτε τα άρθρα σας.{" "}
          <Link to="/auth">Σύνδεση</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Τα Άρθρα μου</h1>

      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/articles/new" className="button">
          Νέο Άρθρο
        </Link>
        {" "}
        <Link to="/articles" className="button secondary">
          Όλα τα Άρθρα
        </Link>
      </div>

      {articlesState.loading && <p>Φόρτωση άρθρων...</p>}

      {articlesState.error && (
        <div className="message error">{articlesState.error}</div>
      )}

      {deleteState.error && (
        <div className="message error">{deleteState.error}</div>
      )}

      {!articlesState.loading && !articlesState.error && articlesState.articles.length === 0 && (
        <p>Δεν έχετε δημιουργήσει άρθρα ακόμα.</p>
      )}

      {!articlesState.loading && articlesState.articles.length > 0 && (
        <div className="articles-list">
          {articlesState.articles.map((article) => (
            <div key={article.id} className="article-card">
              <h2>
                <Link to={`/articles/${article.id}`}>{article.title}</Link>
              </h2>

              <div className="article-meta">
                <span>{formatDate(article.createdAt)}</span>
                {article.isNews && (
                  <>
                    {" • "}
                    <span className="news-badge">📰 Είδηση</span>
                  </>
                )}
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="article-tags">
                  {article.tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {(article.region || article.cityOrVillage) && (
                <div className="article-location">
                  📍 {article.cityOrVillage || article.region}
                </div>
              )}

              <p className="article-preview">
                {article.content.substring(0, 200)}
                {article.content.length > 200 && "..."}
              </p>

              <div className="article-actions">
                <Link to={`/articles/${article.id}`} className="button small">
                  Προβολή
                </Link>
                <Link to={`/articles/${article.id}/edit`} className="button small secondary">
                  Επεξεργασία
                </Link>
                <button
                  onClick={() => handleDelete(article.id, article.title)}
                  disabled={deleteState.deleting === article.id}
                  className="button small danger"
                >
                  {deleteState.deleting === article.id ? "Διαγραφή..." : "Διαγραφή"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .articles-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .article-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .article-card h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }

        .article-card h2 a {
          color: #333;
          text-decoration: none;
        }

        .article-card h2 a:hover {
          color: #0066cc;
        }

        .article-meta {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .news-badge {
          color: #d32f2f;
          font-weight: bold;
        }

        .article-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
        }

        .article-location {
          color: #666;
          font-size: 0.9rem;
          margin: 0.5rem 0;
        }

        .article-preview {
          color: #555;
          line-height: 1.6;
          margin: 1rem 0;
        }

        .article-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          background: #0066cc;
          color: white;
        }

        .button:hover:not(:disabled) {
          background: #0052a3;
        }

        .button.secondary {
          background: #f5f5f5;
          color: #333;
        }

        .button.secondary:hover {
          background: #e0e0e0;
        }

        .button.small {
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
        }

        .button.danger {
          background: #d32f2f;
          color: white;
        }

        .button.danger:hover:not(:disabled) {
          background: #b71c1c;
        }

        .button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .message {
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .message.error {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ef5350;
        }
      `}</style>
    </div>
  );
}
