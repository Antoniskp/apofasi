import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COUNTRIES, GREEK_JURISDICTION_NAMES, CITIES_BY_JURISDICTION } from "../../../shared/locations.js";
import { API_BASE_URL, createArticle, getAuthStatus } from "../lib/api.js";
import { handlePhotoFile } from "../lib/imageUtils.js";

const uniqueTags = (rawTags = "") =>
  Array.from(
    new Set(
      rawTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  ).slice(0, 10);

const normalizeSources = (rawSources = "") =>
  Array.from(
    new Set(
      rawSources
        .split(/\r?\n/)
        .map((source) => source.trim())
        .filter(Boolean)
    )
  ).slice(0, 10);

export default function NewArticle() {
  const [authState, setAuthState] = useState({ loading: true, user: null, error: null });
  const [formState, setFormState] = useState({
    title: "",
    subtitle: "",
    content: "",
    tags: "",
    sources: "",
    photoUrl: "",
    photo: "",
    locationCountry: "",
    locationJurisdiction: "",
    locationCity: "",
  });
  const [submission, setSubmission] = useState({ submitting: false, success: null, error: null });
  const navigate = useNavigate();

  const availableCities = useMemo(() =>
    formState.locationCountry === "greece" && formState.locationJurisdiction
      ? CITIES_BY_JURISDICTION[formState.locationJurisdiction] || []
      : [],
  [formState.locationCountry, formState.locationJurisdiction]
  );

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

  useEffect(() => {
    loadAuthStatus();
  }, []);

  const handleCountryChange = (value) => {
    setFormState((prev) => ({ 
      ...prev, 
      locationCountry: value, 
      locationJurisdiction: "", 
      locationCity: "" 
    }));
  };

  const handleJurisdictionChange = (value) => {
    setFormState((prev) => ({ 
      ...prev, 
      locationJurisdiction: value, 
      locationCity: "" 
    }));
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    const uploadResult = await handlePhotoFile(file);

    if (!uploadResult.valid) {
      setSubmission((prev) => ({ ...prev, error: uploadResult.error || "Σφάλμα επεξεργασίας φωτογραφίας." }));
      return;
    }

    setFormState((prev) => ({ ...prev, photo: uploadResult.dataUrl, photoUrl: "" }));
    setSubmission((prev) => ({ ...prev, error: null }));
  };

  const handleClearPhoto = () => {
    setFormState((prev) => ({ ...prev, photoUrl: "", photo: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!authState.user) {
      setSubmission({ submitting: false, success: null, error: "Χρειάζεται σύνδεση για να δημιουργήσετε άρθρο." });
      return;
    }

    const trimmedTitle = formState.title.trim();
    const trimmedContent = formState.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setSubmission({ submitting: false, success: null, error: "Συμπληρώστε τίτλο και περιεχόμενο." });
      return;
    }

    const tags = uniqueTags(formState.tags);
    const sources = normalizeSources(formState.sources);

    setSubmission({ submitting: true, success: null, error: null });

    try {
      const result = await createArticle({
        title: trimmedTitle,
        subtitle: formState.subtitle.trim(),
        content: trimmedContent,
        tags,
        sources,
        photoUrl: formState.photoUrl,
        photo: formState.photo,
        locationCountry: formState.locationCountry,
        locationJurisdiction: formState.locationJurisdiction,
        locationCity: formState.locationCity,
      });

      setSubmission({ submitting: false, success: "Το άρθρο δημιουργήθηκε επιτυχώς!", error: null });
      
      setTimeout(() => {
        navigate(`/articles/${result.article.id}`);
      }, 1000);
    } catch (error) {
      setSubmission({
        submitting: false,
        success: null,
        error: error.message || "Δεν ήταν δυνατή η δημιουργία του άρθρου.",
      });
    }
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
        <h1>Νέο Άρθρο</h1>
        <div className="message error">
          Πρέπει να συνδεθείτε για να δημιουργήσετε άρθρο.{" "}
          <Link to="/auth">Σύνδεση</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Νέο Άρθρο</h1>

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
          <label htmlFor="subtitle">Υπότιτλος (προαιρετικό)</label>
          <input
            type="text"
            id="subtitle"
            value={formState.subtitle}
            onChange={(e) => setFormState((prev) => ({ ...prev, subtitle: e.target.value }))}
            placeholder="Μια σύντομη περίληψη ή προμετωπίδα"
            maxLength={240}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Περιεχόμενο *</label>
          <textarea
            id="content"
            value={formState.content}
            onChange={(e) => setFormState((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Γράψτε το περιεχόμενο του άρθρου σας..."
            rows={10}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="photoUrl">Φωτογραφία (προαιρετικό)</label>
          <input
            type="url"
            id="photoUrl"
            value={formState.photoUrl}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, photoUrl: e.target.value, photo: e.target.value ? "" : prev.photo }))
            }
            placeholder="https://..."
          />
          <div className="photo-upload-row" style={{ marginTop: "0.75rem" }}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => handlePhotoUpload(event.target.files?.[0])}
            />
            {(formState.photo || formState.photoUrl) && (
              <span className="muted small">✓ Επιλεγμένη φωτογραφία</span>
            )}
          </div>
          {(formState.photo || formState.photoUrl) && (
            <div className="article-photo-preview">
              <img
                src={formState.photo || formState.photoUrl}
                alt="Προεπισκόπηση φωτογραφίας άρθρου"
              />
              <button type="button" className="button secondary" onClick={handleClearPhoto}>
                Αφαίρεση φωτογραφίας
              </button>
            </div>
          )}
          <small>Μπορείτε να χρησιμοποιήσετε URL HTTPS ή να ανεβάσετε αρχείο.</small>
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
          <label htmlFor="sources">Πηγές (προαιρετικό)</label>
          <textarea
            id="sources"
            value={formState.sources}
            onChange={(e) => setFormState((prev) => ({ ...prev, sources: e.target.value }))}
            placeholder={"https://example.com\nhttps://another-source.gr"}
            rows={4}
          />
          <small>Μία πηγή ανά γραμμή (μέχρι 10)</small>
        </div>

        <div className="form-group">
          <label htmlFor="locationCountry">Χώρα (προαιρετικό)</label>
          <select
            id="locationCountry"
            value={formState.locationCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
          >
            <option value="">-- Επιλέξτε χώρα --</option>
            {COUNTRIES.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        {formState.locationCountry === "greece" && (
          <div className="form-group">
            <label htmlFor="locationJurisdiction">Περιφέρεια (προαιρετικό)</label>
            <select
              id="locationJurisdiction"
              value={formState.locationJurisdiction}
              onChange={(e) => handleJurisdictionChange(e.target.value)}
            >
              <option value="">-- Επιλέξτε περιφέρεια --</option>
              {GREEK_JURISDICTION_NAMES.map((jurisdiction) => (
                <option key={jurisdiction} value={jurisdiction}>
                  {jurisdiction}
                </option>
              ))}
            </select>
          </div>
        )}

        {formState.locationJurisdiction && (
          <div className="form-group">
            <label htmlFor="locationCity">Πόλη ή Κοινότητα (προαιρετικό)</label>
            <select
              id="locationCity"
              value={formState.locationCity}
              onChange={(e) => setFormState((prev) => ({ ...prev, locationCity: e.target.value }))}
            >
              <option value="">-- Επιλέξτε πόλη ή κοινότητα --</option>
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
            {submission.submitting ? "Δημιουργία..." : "Δημιουργία Άρθρου"}
          </button>
          <Link to="/articles" className="button secondary">
            Ακύρωση
          </Link>
        </div>
      </form>

      <style>{`
        .article-form {
          max-width: 800px;
          width: 100%;
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
          box-sizing: border-box;
        }

        .form-group textarea {
          resize: vertical;
        }

        .article-photo-preview {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .article-photo-preview img {
          max-width: 100%;
          max-height: 280px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #ddd;
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
          flex-wrap: wrap;
        }

        .button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          text-align: center;
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

        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .article-form {
            max-width: 100%;
            padding: 0;
          }

          .form-group {
            margin-bottom: 1.25rem;
          }

          .form-group input,
          .form-group textarea,
          .form-group select {
            padding: 0.65rem;
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .form-group small {
            font-size: 0.8rem;
          }

          .form-actions {
            flex-direction: column;
            gap: 0.75rem;
          }

          .button {
            width: 100%;
            padding: 0.875rem 1.25rem;
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .message {
            padding: 0.875rem;
            font-size: 0.95rem;
          }
        }

        /* Extra small mobile devices */
        @media (max-width: 480px) {
          .form-group {
            margin-bottom: 1rem;
          }

          .form-group input,
          .form-group textarea,
          .form-group select {
            padding: 0.6rem;
          }

          .button {
            padding: 0.75rem 1rem;
          }
        }

        /* Tablet and small desktop */
        @media (min-width: 769px) and (max-width: 1024px) {
          .article-form {
            max-width: 700px;
          }
        }
      `}</style>
    </div>
  );
}
