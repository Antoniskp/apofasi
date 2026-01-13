import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listArticles, getAuthStatus, API_BASE_URL } from "../lib/api.js";

export default function Articles() {
  const [authState, setAuthState] = useState({ loading: true, user: null });
  const [articlesState, setArticlesState] = useState({ loading: true, articles: [], error: null });

  const loadAuthStatus = async () => {
    try {
      const data = await getAuthStatus();
      setAuthState({ loading: false, user: data.user });
    } catch {
      setAuthState({ loading: false, user: null });
    }
  };

  const loadArticles = async () => {
    setArticlesState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await listArticles();
      setArticlesState({ loading: false, articles: data.articles || [], error: null });
    } catch (error) {
      setArticlesState({
        loading: false,
        articles: [],
        error: API_BASE_URL
          ? error.message || "Δεν ήταν δυνατή η ανάκτηση άρθρων."
          : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η ανάκτηση άρθρων.",
      });
    }
  };

  useEffect(() => {
    loadAuthStatus();
    loadArticles();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("el-GR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container">
      <h1>Άρθρα</h1>
      
      {authState.user && (
        <div style={{ marginBottom: "1.5rem" }}>
          <Link to="/articles/new" className="button">
            Νέο Άρθρο
          </Link>
          {" "}
          <Link to="/articles/my-articles" className="button">
            Τα Άρθρα μου
          </Link>
        </div>
      )}

      {articlesState.loading && <p>Φόρτωση άρθρων...</p>}
      
      {articlesState.error && (
        <div className="message error">{articlesState.error}</div>
      )}

      {!articlesState.loading && !articlesState.error && articlesState.articles.length === 0 && (
        <p>Δεν υπάρχουν άρθρα ακόμα.</p>
      )}

      {!articlesState.loading && articlesState.articles.length > 0 && (
        <div className="articles-list">
          {articlesState.articles.map((article) => (
            <div key={article.id} className="article-card">
              <h2>
                <Link to={`/articles/${article.id}`}>{article.title}</Link>
              </h2>
              
              <div className="article-meta">
                <span>
                  Συγγραφέας: {article.author?.displayName || "Άγνωστος"}
                </span>
                {" • "}
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

              <Link to={`/articles/${article.id}`} className="read-more">
                Διαβάστε περισσότερα →
              </Link>
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

        .read-more {
          color: #0066cc;
          text-decoration: none;
          font-weight: 500;
        }

        .read-more:hover {
          text-decoration: underline;
        }

        .button {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #0066cc;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          border: none;
          cursor: pointer;
        }

        .button:hover {
          background: #0052a3;
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
