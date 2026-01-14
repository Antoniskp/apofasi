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

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="section">
      <p className="pill">Άρθρα</p>
      <h1 className="section-title">Άρθρα</h1>
      <p className="muted">Διαβάστε και δημιουργήστε άρθρα σχετικά με θέματα επικαιρότητας.</p>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Όλα τα άρθρα</h2>
        </div>

        <div className="toolbar-container">
          <div className="toolbar-right ml-auto">
            {authState.user && (
              <>
                <Link to="/articles/new" className="btn btn-primary">
                  ✚ Νέο Άρθρο
                </Link>
                <Link to="/articles/my-articles" className="btn btn-outline">
                  Τα Άρθρα μου
                </Link>
              </>
            )}
          </div>
        </div>

        {articlesState.loading && <p className="muted">Φόρτωση άρθρων...</p>}
      
        {articlesState.error && (
          <div className="card compact-card error-text">{articlesState.error}</div>
        )}

        {!articlesState.loading && !articlesState.error && articlesState.articles.length === 0 && (
          <div className="card compact-card">
            <p className="muted">Δεν υπάρχουν άρθρα ακόμα.</p>
          </div>
        )}

        {!articlesState.loading && articlesState.articles.length > 0 && (
          <div className="responsive-card-grid">
            {articlesState.articles.map((article) => (
              <div key={article.id} className="card compact-card">
                {article.thumbnail && (
                  <div className="article-thumbnail">
                    <img src={article.thumbnail} alt={article.title} />
                  </div>
                )}
                
                <div className="article-header-row">
                  <div className="pill pill-soft">Άρθρο</div>
                  <div className="muted small">{formatDate(article.createdAt)}</div>
                </div>
              
                <h3 className="article-title">
                  <Link to={`/articles/${article.id}`}>{article.title}</Link>
                </h3>
              
                <div className="article-meta-row">
                  <span className="muted small">
                  Συγγραφέας: {article.author?.displayName || "Άγνωστος"}
                  </span>
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
                  Τοποθεσία: {[article.region, article.cityOrVillage].filter(Boolean).join(" • ")}
                  </p>
                )}

                <p className="article-preview">
                  {stripHtml(article.content).substring(0, 200)}
                  {stripHtml(article.content).length > 200 && "..."}
                </p>

                <Link to={`/articles/${article.id}`} className="link-primary">
                Διαβάστε περισσότερα →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
