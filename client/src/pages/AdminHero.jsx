import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, getHeroSettings, updateHeroSettings } from "../lib/api.js";

const isValidImageUrl = (url) => {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

export default function AdminHero() {
  const [session, setSession] = useState({ loading: true, user: null, error: null });
  const [settings, setSettings] = useState({ backgroundImageUrl: "", backgroundColor: "#1a2a3a" });
  const [saveState, setSaveState] = useState({ saving: false, success: null, error: null });
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const isAdmin = session.user?.role === "admin";

  useEffect(() => {
    const loadData = async () => {
      try {
        const authData = await getAuthStatus();
        setSession({ loading: false, user: authData.user, error: null });

        if (authData.user?.role === "admin") {
          const heroData = await getHeroSettings();
          setSettings({
            backgroundImageUrl: heroData.backgroundImageUrl || "",
            backgroundColor: heroData.backgroundColor || "#1a2a3a",
          });
        }
      } catch (error) {
        setSession({
          loading: false,
          user: null,
          error: API_BASE_URL
            ? error.message || "Δεν ήταν δυνατή η ανάκτηση συνεδρίας."
            : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η ανάκτηση συνεδρίας.",
        });
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    if (settings.backgroundImageUrl && !isValidImageUrl(settings.backgroundImageUrl)) {
      setSaveState({ saving: false, success: null, error: "Το URL εικόνας πρέπει να ξεκινά με https:// ή http://" });
      return;
    }
    setSaveState({ saving: true, success: null, error: null });
    try {
      const data = await updateHeroSettings(settings);
      setSettings({
        backgroundImageUrl: data.backgroundImageUrl || "",
        backgroundColor: data.backgroundColor || "#1a2a3a",
      });
      setSaveState({ saving: false, success: "Οι ρυθμίσεις αποθηκεύτηκαν.", error: null });
    } catch (error) {
      setSaveState({ saving: false, success: null, error: error.message || "Η αποθήκευση απέτυχε." });
    }
  };

  const handleClearImage = () => {
    setSettings((prev) => ({ ...prev, backgroundImageUrl: "" }));
    setImagePreviewError(false);
    setSaveState({ saving: false, success: null, error: null });
  };

  return (
    <div className="section narrow">
      <p className="pill">Διαχειριστής</p>
      <h1 className="section-title">Ρυθμίσεις Hero</h1>
      <p className="muted">Διαχείριση φόντου της κεντρικής σελίδας.</p>

      <div className="card auth-card stack">
        {session.loading && <p className="muted">Φόρτωση συνεδρίας...</p>}

        {!session.loading && session.error && <p className="error-text">{session.error}</p>}

        {!session.loading && !session.error && !session.user && (
          <div className="stack">
            <p className="muted">Πρέπει να συνδεθείτε για να διαχειριστείτε τις ρυθμίσεις.</p>
            <div className="cta-row">
              <Link className="btn" to="/auth">
                Σύνδεση
              </Link>
            </div>
          </div>
        )}

        {!session.loading && session.user && !isAdmin && (
          <p className="error-text">Δεν έχετε δικαίωμα πρόσβασης σε αυτή τη σελίδα.</p>
        )}

        {!session.loading && isAdmin && (
          <div className="stack">
            <div className="field-group">
              <label className="field-label" htmlFor="bgImageUrl">
                URL Εικόνας Φόντου
              </label>
              <div className="input-row">
                <input
                  id="bgImageUrl"
                  type="url"
                  className="input-modern"
                  placeholder="https://example.com/image.jpg"
                  value={settings.backgroundImageUrl}
                  onChange={(e) => {
                    setSettings((prev) => ({ ...prev, backgroundImageUrl: e.target.value }));
                    setImagePreviewError(false);
                    setSaveState({ saving: false, success: null, error: null });
                  }}
                />
                {settings.backgroundImageUrl && (
                  <button type="button" className="btn btn-outline" onClick={handleClearImage}>
                    Καθαρισμός
                  </button>
                )}
              </div>
              <p className="muted small">
                Αφήστε κενό για να εμφανιστεί μόνο το χρώμα φόντου.
              </p>

              {settings.backgroundImageUrl && !imagePreviewError && (
                <div className="hero-preview-image-wrapper">
                  <img
                    src={settings.backgroundImageUrl}
                    alt="Προεπισκόπηση φόντου"
                    className="hero-preview-image"
                    onError={() => setImagePreviewError(true)}
                  />
                </div>
              )}

              {settings.backgroundImageUrl && imagePreviewError && (
                <p className="error-text small">Η εικόνα δεν φορτώνει — ελέγξτε το URL.</p>
              )}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="bgColor">
                Χρώμα Φόντου (εφεδρικό)
              </label>
              <div className="input-row">
                <input
                  id="bgColor"
                  type="color"
                  className="color-picker-input"
                  value={settings.backgroundColor}
                  onChange={(e) => {
                    setSettings((prev) => ({ ...prev, backgroundColor: e.target.value }));
                    setSaveState({ saving: false, success: null, error: null });
                  }}
                />
                <input
                  type="text"
                  className="input-modern compact"
                  value={settings.backgroundColor}
                  onChange={(e) => {
                    setSettings((prev) => ({ ...prev, backgroundColor: e.target.value }));
                    setSaveState({ saving: false, success: null, error: null });
                  }}
                  placeholder="#1a2a3a"
                />
              </div>
              <p className="muted small">
                Χρησιμοποιείται όταν δεν υπάρχει εικόνα ή αποτυγχάνει η φόρτωσή της.
              </p>
            </div>

            <div className="hero-preview-banner" style={{ backgroundColor: settings.backgroundColor }}>
              <span className="hero-preview-label">Προεπισκόπηση χρώματος</span>
            </div>

            <div className="cta-row">
              <button
                type="button"
                className="btn"
                onClick={handleSave}
                disabled={saveState.saving}
              >
                {saveState.saving ? "Αποθήκευση..." : "Αποθήκευση"}
              </button>
            </div>

            {saveState.success && <p className="success-text">{saveState.success}</p>}
            {saveState.error && <p className="error-text">{saveState.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
