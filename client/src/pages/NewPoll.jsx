import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CITIES_BY_REGION, REGION_NAMES } from "../../../shared/locations.js";
import { API_BASE_URL, createPoll, getAuthStatus } from "../lib/api.js";

const DEFAULT_OPTIONS = ["Ναι", "Όχι"];

const uniqueTags = (rawTags = "") =>
  Array.from(
    new Set(
      rawTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  ).slice(0, 10);

export default function NewPoll() {
  const [authState, setAuthState] = useState({ loading: true, user: null, error: null });
  const [formState, setFormState] = useState({
    question: "",
    options: DEFAULT_OPTIONS,
    tags: "",
    region: "",
    cityOrVillage: "",
    isAnonymousCreator: false,
    anonymousResponses: false,
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

  useEffect(() => {
    loadAuthStatus();
  }, []);

  const handleOptionChange = (index, value) => {
    setFormState((prev) => {
      const nextOptions = [...prev.options];
      nextOptions[index] = value;
      return { ...prev, options: nextOptions };
    });
  };

  const addOptionField = () => {
    setFormState((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOptionField = (index) => {
    setFormState((prev) => {
      if (prev.options.length <= 2) return prev;
      const nextOptions = prev.options.filter((_, idx) => idx !== index);
      return { ...prev, options: nextOptions };
    });
  };

  const handleRegionChange = (value) => {
    setFormState((prev) => ({ ...prev, region: value, cityOrVillage: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!authState.user) {
      setSubmission({ submitting: false, success: null, error: "Χρειάζεται σύνδεση για να καταχωρήσετε ψηφοφορία." });
      return;
    }

    const trimmedQuestion = formState.question.trim();
    const cleanedOptions = formState.options.map((opt) => opt.trim()).filter(Boolean);
    const distinctOptions = Array.from(new Set(cleanedOptions));

    if (!trimmedQuestion || distinctOptions.length < 2) {
      setSubmission({ submitting: false, success: null, error: "Συμπληρώστε ερώτηση και τουλάχιστον δύο μοναδικές επιλογές." });
      return;
    }

    const tags = uniqueTags(formState.tags);

    setSubmission({ submitting: true, success: null, error: null });

    try {
      const response = await createPoll({
        question: trimmedQuestion,
        options: distinctOptions,
        tags,
        region: formState.region,
        cityOrVillage: formState.cityOrVillage,
        isAnonymousCreator: formState.isAnonymousCreator,
        anonymousResponses: formState.anonymousResponses,
      });

      setSubmission({ submitting: false, success: "Η ψηφοφορία δημοσιεύτηκε.", error: null });
      setFormState({
        question: "",
        options: DEFAULT_OPTIONS,
        tags: "",
        region: "",
        cityOrVillage: "",
        isAnonymousCreator: false,
        anonymousResponses: false,
      });
      if (response?.poll?.id) {
        navigate(`/polls/${response.poll.id}`);
      }
    } catch (error) {
      setSubmission({
        submitting: false,
        success: null,
        error: error.message || "Δεν ήταν δυνατή η δημιουργία ψηφοφορίας.",
      });
    }
  };

  const { loading: authLoading, user, error: authError } = authState;

  return (
    <div className="section narrow">
      <p className="pill">Νέα ψηφοφορία</p>
      <h1 className="section-title">Δημιουργία νέας ψηφοφορίας</h1>
      <p className="muted">Ορίστε μια ερώτηση, προσθέστε επιλογές και δημοσιεύστε τη νέα σας ψηφοφορία.</p>

      <div className="card auth-card stack">
        {authLoading && <p className="muted">Φόρτωση συνεδρίας...</p>}

        {!authLoading && authError && <p className="error-text">{authError}</p>}

        {!authLoading && !authError && !user && (
          <div className="stack">
            <p className="muted">Χρειάζεται σύνδεση για να δημοσιεύσετε νέα ψηφοφορία.</p>
            <div className="cta-row">
              <Link className="btn" to="/auth">
                Σύνδεση
              </Link>
              <Link className="btn btn-outline" to="/register">
                Δημιουργία λογαριασμού
              </Link>
              <Link className="btn btn-subtle" to="/polls">
                Επιστροφή στις ψηφοφορίες
              </Link>
            </div>
          </div>
        )}

        {!authLoading && !authError && user && (
          <form className="stack modern-card" onSubmit={handleSubmit}>
            <div className="info-grid">
              <div>
                <p className="label">Ερώτηση</p>
                <input
                  className="input-modern"
                  type="text"
                  value={formState.question}
                  onChange={(event) => setFormState((prev) => ({ ...prev, question: event.target.value }))}
                  placeholder="Τι θέλετε να ρωτήσετε το κοινό;"
                />
              </div>
              <div>
                <p className="label">Ετικέτες</p>
                <input
                  className="input-modern"
                  type="text"
                  value={formState.tags}
                  onChange={(event) => setFormState((prev) => ({ ...prev, tags: event.target.value }))}
                  placeholder="Χωρίστε με κόμμα (π.χ. οικονομία, υγεία)"
                />
                <p className="muted small">Χρησιμοποιούνται για ομαδοποίηση ψηφοφοριών.</p>
              </div>
            </div>

            <div className="stack">
              <p className="label">Επιλογές απάντησης</p>
              <div className="option-stack">
                {formState.options.map((option, index) => (
                  <div key={index} className="option-row option-row-modern">
                    <input
                      className="input-modern"
                      type="text"
                      value={option}
                      onChange={(event) => handleOptionChange(index, event.target.value)}
                      placeholder={`Επιλογή ${index + 1}`}
                    />
                    {formState.options.length > 2 && (
                      <button
                        type="button"
                        className="btn btn-subtle"
                        onClick={() => removeOptionField(index)}
                        aria-label="Αφαίρεση επιλογής"
                      >
                        Αφαίρεση
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={addOptionField}
                disabled={formState.options.length >= 6}
              >
                Προσθήκη επιλογής
              </button>
            </div>

            <div className="info-grid">
              <div>
                <p className="label">Περιφέρεια (προαιρετικό)</p>
                <select
                  className="input-modern"
                  value={formState.region}
                  onChange={(event) => handleRegionChange(event.target.value)}
                >
                  <option value="">Χωρίς τοποθεσία</option>
                  {REGION_NAMES.map((regionName) => (
                    <option key={regionName} value={regionName}>
                      {regionName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="label">Πόλη ή χωριό (προαιρετικό)</p>
                <select
                  className="input-modern"
                  value={formState.cityOrVillage}
                  onChange={(event) => setFormState((prev) => ({ ...prev, cityOrVillage: event.target.value }))}
                  disabled={!formState.region}
                >
                  <option value="">Χωρίς επιλογή</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {!formState.region && <p className="muted small">Επιλέξτε πρώτα περιφέρεια για να ενεργοποιηθεί.</p>}
              </div>
            </div>

            <div className="privacy-grid">
              <label className="privacy-tile">
                <div className="privacy-toggle">
                  <input
                    type="checkbox"
                    checked={formState.isAnonymousCreator}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, isAnonymousCreator: event.target.checked }))
                    }
                  />
                  <span className="toggle-visual" aria-hidden />
                </div>
                <div>
                  <p className="label">Ανώνυμη ανάρτηση</p>
                  <p className="muted small">Απόκρυψη ονόματος δημιουργού στις λίστες ψηφοφοριών.</p>
                </div>
              </label>

              <label className="privacy-tile">
                <div className="privacy-toggle">
                  <input
                    type="checkbox"
                    checked={formState.anonymousResponses}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, anonymousResponses: event.target.checked }))
                    }
                  />
                  <span className="toggle-visual" aria-hidden />
                </div>
                <div>
                  <p className="label">Ανώνυμη συμμετοχή</p>
                  <p className="muted small">Επιτρέπει μία ψήφο ανά συσκευή χωρίς εμφάνιση στοιχείων χρήστη.</p>
                </div>
              </label>
            </div>

            {submission.error && <p className="error-text">{submission.error}</p>}
            {submission.success && <p className="positive-text">{submission.success}</p>}

            <div className="actions-row">
              <button type="button" className="btn btn-outline" onClick={loadAuthStatus} disabled={authLoading}>
                Ανανέωση συνεδρίας
              </button>
              <button type="submit" className="btn" disabled={submission.submitting}>
                {submission.submitting ? "Δημοσίευση..." : "Δημοσίευση ψηφοφορίας"}
              </button>
              <Link className="btn btn-subtle" to="/polls">
                Ακύρωση
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
