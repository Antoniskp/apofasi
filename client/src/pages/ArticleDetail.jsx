import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getArticle, getAuthStatus, deleteArticle, tagArticleAsNews, untagArticleAsNews, API_BASE_URL } from "../lib/api.js";

export default function ArticleDetail() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({ loading: true, user: null });
  const [articleState, setArticleState] = useState({ loading: true, article: null, error: null });
  const [deleteState, setDeleteState] = useState({ deleting: false, error: null });
  const [tagState, setTagState] = useState({ tagging: false, error: null });

  const loadAuthStatus = async () => {
    try {
      const data = await getAuthStatus();
      setAuthState({ loading: false, user: data.user });
    } catch {
      setAuthState({ loading: false, user: null });
    }
  };

  const loadArticle = async () => {
    setArticleState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getArticle(articleId);
      setArticleState({ loading: false, article: data.article, error: null });
    } catch (error) {
      setArticleState({
        loading: false,
        article: null,
        error: API_BASE_URL
          ? error.message || "Δεν ήταν δυνατή η ανάκτηση του άρθρου."
          : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η ανάκτηση άρθρου.",
      });
    }
  };

  useEffect(() => {
    loadAuthStatus();
    loadArticle();
  }, [articleId]);

  const handleDelete = async () => {
    if (!window.confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το άρθρο;")) {
      return;
    }

    setDeleteState({ deleting: true, error: null });

    try {
      await deleteArticle(articleId);
      navigate("/articles/my-articles");
    } catch (error) {
      setDeleteState({
        deleting: false,
        error: error.message || "Δεν ήταν δυνατή η διαγραφή του άρθρου.",
      });
    }
  };

  const handleToggleNews = async () => {
    const article = articleState.article;
    if (!article) return;

    setTagState({ tagging: true, error: null });

    try {
      if (article.isNews) {
        const data = await untagArticleAsNews(articleId);
        setArticleState((prev) => ({ ...prev, article: data.article }));
      } else {
        const data = await tagArticleAsNews(articleId);
        setArticleState((prev) => ({ ...prev, article: data.article }));
      }
      setTagState({ tagging: false, error: null });
    } catch (error) {
      setTagState({
        tagging: false,
        error: error.message || "Δεν ήταν δυνατή η ενημέρωση της κατάστασης ειδήσεων.",
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("el-GR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (articleState.loading) {
    return (
      <div className="container">
        <p>Φόρτωση άρθρου...</p>
      </div>
    );
  }

  if (articleState.error) {
    return (
      <div className="container">
        <div className="message error">{articleState.error}</div>
        <Link to="/articles" className="button">
          Επιστροφή στα Άρθρα
        </Link>
      </div>
    );
  }

  const article = articleState.article;
  const isAuthor = authState.user && article.author?.id === authState.user.id;
  const isAdmin = authState.user?.role === "admin";
  const canEdit = isAuthor;
  const canDelete = isAuthor || isAdmin;
  const canTagAsNews = authState.user && (authState.user.role === "reporter" || authState.user.role === "editor" || authState.user.role === "admin");

  return (
    <div className="container">
      <div className="article-detail">
        <div className="article-header">
          <h1>{article.title}</h1>

          <div className="article-meta">
            <span>
              Συγγραφέας: {article.author?.displayName || "Άγνωστος"}
            </span>
            {" • "}
            <span>{formatDate(article.createdAt)}</span>
            {article.updatedAt !== article.createdAt && (
              <>
                {" • "}
                <span>Ενημερώθηκε: {formatDate(article.updatedAt)}</span>
              </>
            )}
          </div>

          {article.isNews && (
            <div className="news-badge-large">
              📰 Αυτό το άρθρο έχει επισημανθεί ως είδηση
              {article.taggedAsNewsBy && (
                <div className="tagged-by">
                  από {article.taggedAsNewsBy.displayName} στις {formatDate(article.taggedAsNewsAt)}
                </div>
              )}
            </div>
          )}

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
        </div>

        <div className="article-content">
          {article.content.split("\n").map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {(canEdit || canDelete || canTagAsNews) && (
          <div className="article-actions">
            {canEdit && (
              <Link to={`/articles/${articleId}/edit`} className="button">
                Επεξεργασία
              </Link>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={deleteState.deleting}
                className="button danger"
              >
                {deleteState.deleting ? "Διαγραφή..." : "Διαγραφή"}
              </button>
            )}

            {canTagAsNews && (
              <button
                onClick={handleToggleNews}
                disabled={tagState.tagging}
                className="button secondary"
              >
                {tagState.tagging
                  ? "Επεξεργασία..."
                  : article.isNews
                    ? "Αφαίρεση από Ειδήσεις"
                    : "Επισήμανση ως Είδηση"}
              </button>
            )}
          </div>
        )}

        {deleteState.error && (
          <div className="message error">{deleteState.error}</div>
        )}

        {tagState.error && (
          <div className="message error">{tagState.error}</div>
        )}

        <div style={{ marginTop: "2rem" }}>
          <Link to="/articles" className="back-link">
            ← Επιστροφή στα Άρθρα
          </Link>
        </div>
      </div>

      <style>{`
        .article-detail {
          max-width: 800px;
          margin: 0 auto;
        }

        .article-header {
          margin-bottom: 2rem;
        }

        .article-header h1 {
          margin: 0 0 1rem 0;
          font-size: 2rem;
          line-height: 1.3;
        }

        .article-meta {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .news-badge-large {
          background: #fff3e0;
          border-left: 4px solid #ff9800;
          padding: 1rem;
          margin: 1rem 0;
          font-weight: bold;
          color: #d32f2f;
        }

        .tagged-by {
          font-weight: normal;
          font-size: 0.9rem;
          color: #666;
          margin-top: 0.5rem;
        }

        .article-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
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
          font-size: 0.95rem;
          margin: 0.5rem 0;
        }

        .article-content {
          line-height: 1.8;
          font-size: 1.1rem;
          color: #333;
          margin: 2rem 0;
        }

        .article-content p {
          margin-bottom: 1rem;
        }

        .article-actions {
          display: flex;
          gap: 1rem;
          margin: 2rem 0;
          padding-top: 2rem;
          border-top: 1px solid #e0e0e0;
        }

        .button {
          padding: 0.75rem 1.5rem;
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
          border: 1px solid #ddd;
        }

        .button.secondary:hover:not(:disabled) {
          background: #e0e0e0;
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

        .back-link {
          color: #0066cc;
          text-decoration: none;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .message {
          padding: 1rem;
          border-radius: 4px;
          margin: 1rem 0;
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
