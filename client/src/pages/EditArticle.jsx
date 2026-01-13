import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CITIES_BY_REGION, REGION_NAMES } from "../../../shared/locations.js";
import { API_BASE_URL, getArticle, updateArticle, getAuthStatus } from "../lib/api.js";

const uniqueTags = (rawTags = "") =>
  Array.from(
    new Set(
      rawTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  ).slice(0, 10);

export default function EditArticle() {
  const { articleId } = useParams();
  const [authState, setAuthState] = useState({ loading: true, user: null, error: null });
  const [articleState, setArticleState] = useState({ loading: true, article: null, error: null });
  const [formState, setFormState] = useState({
    title: "",
    content: "",
    tags: "",
    region: "",
    cityOrVillage: "",
  });
  const [submission, setSubmission] = useState({ submitting: false, success: null, error: null });
  const navigate = useNavigate();

  const availableCities = useMemo(() => CITIES_BY_REGION[formState.region] || [], [formState.region]);

  const loadAuthStatus = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getAuthStatus();
      setAuthState({ loading: false, user: data.user, error: null });
    } catch (error) {
      setAuthState({
        loading: false,
        user: null,
        error:
          API_BASE_URL
            ? error.message || "Δεν ήταν δυνατή η ανάκτηση συνεδρίας."
            : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η ανάκτηση συνεδρίας.",
      });
    }
  };

  const loadArticle = async () => {
    setArticleState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getArticle(articleId);
      const article = data.article;
      
      setArticleState({ loading: false, article, error: null });
      setFormState({
        title: article.title || "",
        content: article.content || "",
        tags: article.tags ? article.tags.join(", ") : "",
        region: article.region || "",
        cityOrVillage: article.cityOrVillage || "",
      });
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

  const handleRegionChange = (value) => {
    setFormState((prev) => ({ ...prev, region: value, cityOrVillage: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!authState.user) {
      setSubmission({ submitting: false, success: null, error: "Χρειάζεται σύνδεση για να επεξεργαστείτε άρθρο." });
      return;
    }

    const trimmedTitle = formState.title.trim();
    const trimmedContent = formState.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setSubmission({ submitting: false, success: null, error: "Συμπληρώστε τίτλο και περιεχόμενο." });
      return;
    }

    const tags = uniqueTags(formState.tags);

    setSubmission({ submitting: true, success: null, error: null });

    try {
      await updateArticle(articleId, {
        title: trimmedTitle,
        content: trimmedContent,
        tags,
        region: formState.region,
        cityOrVillage: formState.cityOrVillage,
      });

      setSubmission({ submitting: false, success: "Το άρθρο ενημερώθηκε επιτυχώς!", error: null });

      setTimeout(() => {
        navigate(`/articles/${articleId}`);
      }, 1000);
    } catch (error) {
      setSubmission({
        submitting: false,
        success: null,
        error: error.message || "Δεν ήταν δυνατή η ενημέρωση του άρθρου.",
      });
    }
  };

  if (authState.loading || articleState.loading) {
    return (
      <div className="container">
        <p>Φόρτωση...</p>
      </div>
    );
  }

  if (articleState.error) {
    return (
      <div className="container">
        <h1>Επεξεργασία Άρθρου</h1>
        <div className="message error">{articleState.error}</div>
        <Link to="/articles" className="button">
          Επιστροφή στα Άρθρα
        </Link>
      </div>
    );
  }

  if (!authState.user) {
    return (
      <div className="container">
        <h1>Επεξεργασία Άρθρου</h1>
        <div className="message error">
          Πρέπει να συνδεθείτε για να επεξεργαστείτε άρθρο.{" "}
          <Link to="/auth">Σύνδεση</Link>
        </div>
      </div>
    );
  }

  const article = articleState.article;
  const isAuthor = authState.user && article.author?.id === authState.user.id;

  if (!isAuthor) {
    return (
      <div className="container">
        <h1>Επεξεργασία Άρθρου</h1>
        <div className="message error">
          Δεν έχετε δικαίωμα να επεξεργαστείτε αυτό το άρθρο.
        </div>
        <Link to={`/articles/${articleId}`} className="button">
          Επιστροφή στο Άρθρο
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Επεξεργασία Άρθρου</h1>

      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label htmlFor="title">Τίτλος *</label>
          <input
            type="text"
            id="title"
            value={formState.title}
            onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Εισάγετε τον τίτλο του άρθρου"
            maxLength={200}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Περιεχόμενο *</label>
          <textarea
            id="content"
            value={formState.content}
            onChange={(e) => setFormState((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Γράψτε το περιεχόμενο του άρθρου σας..."
            rows={15}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Ετικέτες (χωρισμένες με κόμμα)</label>
          <input
            type="text"
            id="tags"
            value={formState.tags}
            onChange={(e) => setFormState((prev) => ({ ...prev, tags: e.target.value }))}
            placeholder="πχ. πολιτική, οικονομία, τεχνολογία"
          />
          <small>Μέχρι 10 ετικέτες</small>
        </div>

        <div className="form-group">
          <label htmlFor="region">Περιφέρεια (προαιρετικό)</label>
          <select
            id="region"
            value={formState.region}
            onChange={(e) => handleRegionChange(e.target.value)}
          >
            <option value="">-- Επιλέξτε περιφέρεια --</option>
            {REGION_NAMES.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {formState.region && (
          <div className="form-group">
            <label htmlFor="cityOrVillage">Πόλη ή Χωριό (προαιρετικό)</label>
            <select
              id="cityOrVillage"
              value={formState.cityOrVillage}
              onChange={(e) => setFormState((prev) => ({ ...prev, cityOrVillage: e.target.value }))}
            >
              <option value="">-- Επιλέξτε πόλη ή χωριό --</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}

        {submission.error && (
          <div className="message error">{submission.error}</div>
        )}

        {submission.success && (
          <div className="message success">{submission.success}</div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={submission.submitting} className="button primary">
            {submission.submitting ? "Αποθήκευση..." : "Αποθήκευση Αλλαγών"}
          </button>
          <Link to={`/articles/${articleId}`} className="button secondary">
            Ακύρωση
          </Link>
        </div>
      </form>

      <style>{`
        .article-form {
          max-width: 800px;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
        }

        .form-group textarea {
          resize: vertical;
        }

        .form-group small {
          display: block;
          margin-top: 0.25rem;
          color: #666;
          font-size: 0.85rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }

        .button.primary {
          background: #0066cc;
          color: white;
        }

        .button.primary:hover:not(:disabled) {
          background: #0052a3;
        }

        .button.primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .button.secondary {
          background: #f5f5f5;
          color: #333;
        }

        .button.secondary:hover {
          background: #e0e0e0;
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

        .message.success {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #66bb6a;
        }
      `}</style>
    </div>
  );
}
