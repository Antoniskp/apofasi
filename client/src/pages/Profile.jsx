import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, logoutUser, updateProfile } from "../lib/api.js";
import { COUNTRIES, GREEK_JURISDICTION_NAMES, CITIES_BY_JURISDICTION } from "../../../shared/locations.js";

export default function Profile() {
  const [status, setStatus] = useState({ loading: true, user: null, error: null });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarPayload, setAvatarPayload] = useState(undefined);
  const [avatarError, setAvatarError] = useState(null);
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false);
  const getCityOptions = (country, jurisdiction) => 
    country === "greece" && jurisdiction ? CITIES_BY_JURISDICTION[jurisdiction] || [] : [];
  const MAX_AVATAR_FILE_BYTES = 4 * 1024 * 1024;
  const MAX_AVATAR_BYTES = 320 * 1024;
  const MAX_AVATAR_DIMENSION = 360;
  const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const optionalFields = [
    { key: "firstName", label: "Όνομα", placeholder: "Δεν έχει προστεθεί ακόμα." },
    { key: "lastName", label: "Επώνυμο", placeholder: "Προσθέστε το επώνυμό σας." },
    { key: "username", label: "Username", placeholder: "Επιλέξτε ένα όνομα χρήστη όταν είναι διαθέσιμο." },
    {
      key: "mobile",
      label: "Κινητό",
      placeholder: "Μπορείτε να δηλώσετε ένα κινητό για ειδοποιήσεις.",
      inputType: "tel",
      inputMode: "tel",
      pattern: "^[+]?\\d{7,15}$",
      title: "Χρησιμοποιήστε μόνο αριθμούς και προαιρετικό πρόθεμα +",
    },
    { key: "occupation", label: "Επάγγελμα", placeholder: "Προαιρετική επαγγελματική πληροφορία." },
    {
      key: "gender",
      label: "Φύλο",
      placeholder: "Επιλέξτε το φύλο σας.",
      type: "select",
      options: ["male", "female", "other", "prefer_not_to_say"],
      optionLabels: {
        male: "Άνδρας",
        female: "Γυναίκα",
        other: "Άλλο",
        prefer_not_to_say: "Προτιμώ να μην πω"
      }
    },
  ];

  const locationFields = [
    {
      key: "locationCountry",
      label: "Χώρα",
      placeholder: "Επιλέξτε χώρα",
      type: "select",
      options: COUNTRIES.map(c => c.value),
      optionLabels: Object.fromEntries(COUNTRIES.map(c => [c.value, c.label])),
    },
    {
      key: "locationJurisdiction",
      label: "Περιφέρεια",
      placeholder: "Επιλέξτε την περιφέρεια",
      type: "select",
      options: GREEK_JURISDICTION_NAMES,
      disabledWhen: (state) => state.locationCountry !== "greece",
    },
    {
      key: "locationCity",
      label: "Πόλη ή Κοινότητα",
      placeholder: "Επιλέξτε πόλη ή κοινότητα",
      type: "select",
      getOptions: (state) => getCityOptions(state.locationCountry, state.locationJurisdiction),
      disabledWhen: (state) => !state.locationJurisdiction,
    },
  ];

  const allProfileFields = [...optionalFields, ...locationFields];

  const buildOptionalState = (userData) => {
    const state = allProfileFields.reduce(
      (acc, field) => ({ ...acc, [field.key]: userData?.[field.key] || "" }),
      {}
    );

    // Validate city against current jurisdiction
    if (state.locationCountry === "greece" && state.locationJurisdiction && state.locationCity) {
      const validCities = getCityOptions(state.locationCountry, state.locationJurisdiction);
      if (!validCities.includes(state.locationCity)) {
        state.locationCity = "";
      }
    }

    return state;
  };

  const [formState, setFormState] = useState(() => buildOptionalState(null));
  const [saveMessage, setSaveMessage] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const getDataUrlSize = (dataUrl) => {
    if (!dataUrl) return 0;
    const base64 = dataUrl.split(",")[1] || "";
    return Math.ceil((base64.length * 3) / 4);
  };

  const resizeAvatarImage = (file) =>
    new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDimension = MAX_AVATAR_DIMENSION;
        const scale = Math.min(1, maxDimension / image.width, maxDimension / image.height);
        const targetWidth = Math.round(image.width * scale);
        const targetHeight = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Δεν ήταν δυνατή η επεξεργασία της εικόνας."));
          return;
        }

        ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
        let quality = 0.88;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        while (getDataUrlSize(dataUrl) > MAX_AVATAR_BYTES && quality > 0.55) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        if (getDataUrlSize(dataUrl) > MAX_AVATAR_BYTES) {
          reject(new Error("Η φωτογραφία είναι πολύ μεγάλη μετά τη συμπίεση."));
          return;
        }

        resolve(dataUrl);
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Δεν ήταν δυνατή η φόρτωση της εικόνας."));
      };

      image.src = objectUrl;
    });

  const loadProfile = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getAuthStatus();
      setStatus({ loading: false, user: data.user, error: null });

      setFormState(buildOptionalState(data.user));
      setAvatarPreview(data.user?.avatar || "");
      setAvatarPayload(undefined);
      setAvatarError(null);
    } catch (error) {
      setStatus({
        loading: false,
        user: null,
        error:
          API_BASE_URL
            ? error.message || "Δεν ήταν δυνατή η φόρτωση προφίλ."
            : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η φόρτωση προφίλ."
      });
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      await loadProfile();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleInputChange = (key, value) => {
    setFormState((prev) => {
      const nextState = { ...prev, [key]: value };

      // Clear dependent fields when parent changes
      if (key === "locationCountry") {
        if (value !== "greece") {
          nextState.locationJurisdiction = "";
          nextState.locationCity = "";
        }
      }

      if (key === "locationJurisdiction") {
        const allowedCities = getCityOptions(nextState.locationCountry, value);
        if (!allowedCities.includes(nextState.locationCity)) {
          nextState.locationCity = "";
        }
      }

      return nextState;
    });
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    try {
      const payload = { ...formState };

      if (avatarPayload !== undefined) {
        payload.avatar = avatarPayload;
      }

      const response = await updateProfile(payload);
      setStatus((prev) => ({ ...prev, user: response.user }));
      setAvatarPayload(undefined);
      setSaveMessage("Τα στοιχεία σας αποθηκεύτηκαν.");
    } catch (error) {
      setSaveError(error.message || "Δεν ήταν δυνατή η ενημέρωση του προφίλ.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError(null);

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError("Επιτρέπονται μόνο JPG, PNG ή WebP αρχεία.");
      return;
    }

    if (file.size > MAX_AVATAR_FILE_BYTES) {
      setAvatarError("Η φωτογραφία πρέπει να είναι έως 4MB.");
      return;
    }

    setIsAvatarProcessing(true);

    try {
      const dataUrl = await resizeAvatarImage(file);
      setAvatarPreview(dataUrl);
      setAvatarPayload(dataUrl);
    } catch (error) {
      setAvatarError(error.message || "Δεν ήταν δυνατή η επεξεργασία της φωτογραφίας.");
    } finally {
      setIsAvatarProcessing(false);
      event.target.value = "";
    }
  };

  const handleAvatarRemove = () => {
    setAvatarPreview("");
    setAvatarPayload(null);
    setAvatarError(null);
  };

  const { loading, user, error } = status;

  const userRole = user?.role
    ? user.role === "admin"
      ? "Διαχειριστής"
      : "Μέλος"
    : null;

  const displayAvatar = avatarPayload === null ? "" : avatarPreview || user?.avatar || "";

  return (
    <div className="section profile-shell">
      <p className="pill">Προφίλ</p>
      <h1 className="section-title">Το προφίλ σας</h1>
      <p className="muted">Προβάλλετε τα στοιχεία σύνδεσης και την κατάσταση της συνεδρίας σας.</p>

      <div className="card auth-card">
        {loading && <p className="muted">Φόρτωση προφίλ...</p>}

        {!loading && user && (
          <div className="stack profile-stack">
            <div className="profile-header">
              <div className="auth-user">
                {displayAvatar && <img src={displayAvatar} alt="Προφίλ" className="auth-avatar" />}
                <div>
                  <div className="auth-user-name">{user.displayName || "Χρήστης"}</div>
                  {(user.firstName || user.lastName) && (
                    <div className="muted">{[user.firstName, user.lastName].filter(Boolean).join(" ")}</div>
                  )}
                  {user.email && <div className="muted">{user.email}</div>}
                  {userRole && <div className="pill subtle">Ρόλος: {userRole}</div>}
                  <div className="pill subtle">Σύνδεση μέσω {user.provider}</div>
                </div>
              </div>

              <div className="profile-meta">
                <p className="label">Κατάσταση συνεδρίας</p>
                <p className="pill positive">Συνδεδεμένος/η</p>
                <p className="muted small">
                  Δείτε τα στοιχεία που έχουμε για εσάς και συμπληρώστε τα προαιρετικά πεδία όταν γίνουν διαθέσιμα.
                </p>
                <div className="cta-row" style={{ marginTop: "1rem" }}>
                  <Link className="btn btn-outline" to="/polls/my-polls">
                    Οι ψηφοφορίες μου
                  </Link>
                </div>
              </div>
            </div>

            <div className="profile-highlight">
              <div>
                <p className="label">User ID</p>
                <p className="muted small mono">{user.id}</p>
              </div>
              <div>
                <p className="label">Πάροχος</p>
                <p className="pill subtle">{user.provider}</p>
              </div>
            </div>

            <div className="profile-section">
              <div>
                <h3>Φωτογραφία προφίλ</h3>
                <p className="muted small">
                  Αναβαθμίστε το προφίλ σας με μια επαγγελματική φωτογραφία. Επιτρέπονται JPG, PNG ή WebP έως 4MB και
                  η εικόνα προσαρμόζεται αυτόματα σε έως {MAX_AVATAR_DIMENSION}px.
                </p>
              </div>
              <div className="profile-avatar-card">
                <div className="profile-avatar-preview">
                  {displayAvatar ? (
                    <img src={displayAvatar} alt="Προεπισκόπηση φωτογραφίας" />
                  ) : (
                    <span className="muted small">Χωρίς φωτογραφία</span>
                  )}
                </div>
                <div className="profile-avatar-content">
                  <p className="label">Μεταφόρτωση φωτογραφίας</p>
                  <p className="muted small">
                    Θα γίνει συμπίεση για ταχύτερη φόρτωση, με τελικό μέγεθος έως περίπου{" "}
                    {Math.round(MAX_AVATAR_BYTES / 1024)}KB.
                  </p>
                  <div className="actions-row profile-actions">
                    <label className="btn btn-outline profile-avatar-upload" htmlFor="profile-avatar-input">
                      {isAvatarProcessing ? "Επεξεργασία..." : "Επιλογή αρχείου"}
                    </label>
                    <input
                      id="profile-avatar-input"
                      type="file"
                      accept={ALLOWED_AVATAR_TYPES.join(",")}
                      onChange={handleAvatarChange}
                      disabled={isAvatarProcessing}
                      className="profile-avatar-input"
                    />
                    {displayAvatar && (
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleAvatarRemove}
                        disabled={isAvatarProcessing}
                      >
                        Αφαίρεση
                      </button>
                    )}
                  </div>
                  {avatarError && <p className="error-text">{avatarError}</p>}
                </div>
              </div>
            </div>

            <div className="profile-section">
              <div>
                <h3>Προαιρετικά στοιχεία</h3>
                <p className="muted small">
                  Εμπλουτίστε το προφίλ σας προσθέτοντας όνομα, στοιχεία επικοινωνίας ή επαγγελματικές πληροφορίες.
                </p>
              </div>
              <form className="profile-grid" onSubmit={handleProfileSave}>
                {optionalFields.map((field) => {
                  const isSelect = field.type === "select";
                  const options = field.getOptions
                    ? field.getOptions(formState)
                    : field.options || [];
                  const disabled = field.disabledWhen?.(formState) || false;

                  return (
                    <div key={field.key} className="profile-field">
                      <div className="profile-field-header">
                        <label className="label" htmlFor={`profile-${field.key}`}>
                          {field.label}
                        </label>
                        <span className="tag">Προαιρετικό</span>
                      </div>
                      {isSelect ? (
                        <select
                          id={`profile-${field.key}`}
                          value={formState[field.key] || ""}
                          onChange={(event) => handleInputChange(field.key, event.target.value)}
                          disabled={disabled}
                        >
                          <option value="">{field.placeholder}</option>
                          {options.map((option) => (
                            <option key={option} value={option}>
                              {field.optionLabels?.[option] || option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={`profile-${field.key}`}
                          type={field.inputType || "text"}
                          value={formState[field.key] || ""}
                          onChange={(event) => handleInputChange(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          pattern={field.pattern}
                          inputMode={field.inputMode}
                          title={field.title}
                        />
                      )}
                      <p className="muted small">{field.placeholder}</p>
                    </div>
                  );
                })}

                <div className="profile-field profile-field-grouped">
                  <div className="profile-field-header">
                    <div>
                      <p className="label">Τοποθεσία</p>
                      <p className="muted small">Συγκεντρωμένα στοιχεία χώρας, περιφέρειας και πόλης για γρήγορη ενημέρωση.</p>
                    </div>
                    <span className="tag">Προαιρετικό</span>
                  </div>
                  <div className="profile-location-grid">
                    {locationFields.map((field) => {
                      const isSelect = field.type === "select";
                      const options = field.getOptions
                        ? field.getOptions(formState)
                        : field.options || [];
                      const disabled = field.disabledWhen?.(formState) || false;

                      return (
                        <div key={field.key} className="profile-subfield">
                          <label className="label small" htmlFor={`profile-${field.key}`}>
                            {field.label}
                          </label>
                          {isSelect ? (
                            <select
                              id={`profile-${field.key}`}
                              value={formState[field.key] || ""}
                              onChange={(event) => handleInputChange(field.key, event.target.value)}
                              disabled={disabled}
                            >
                              <option value="">{field.placeholder}</option>
                              {options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              id={`profile-${field.key}`}
                              type="text"
                              value={formState[field.key] || ""}
                              onChange={(event) => handleInputChange(field.key, event.target.value)}
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="profile-field">
                  <p className="label">Αποθήκευση αλλαγών</p>
                  <div className="actions-row profile-actions">
                    <button type="submit" className="btn" disabled={isSaving}>
                      {isSaving ? "Αποθήκευση..." : "Αποθήκευση προαιρετικών"}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={loadProfile} disabled={loading}>
                      Επαναφορά από προφίλ
                    </button>
                  </div>
                  {saveMessage && <p className="success-text">{saveMessage}</p>}
                  {saveError && <p className="error-text">{saveError}</p>}
                </div>
              </form>
            </div>

            <div className="profile-section">
              <h3>Βασικά στοιχεία επικοινωνίας</h3>
              <div className="profile-grid">
                <div className="profile-field">
                  <p className="label">Email</p>
                  <p className="profile-field-value">{user.email || "Δεν έχει δηλωθεί email"}</p>
                </div>
                <div className="profile-field">
                  <p className="label">Όνομα εμφάνισης</p>
                  <p className="profile-field-value">{user.displayName || "Χρήστης"}</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <div>
                <h3>Ορατότητα προφίλ</h3>
                <p className="muted small">
                  Επιλέξτε αν το προφίλ σας θα είναι ορατό σε άλλους χρήστες της πλατφόρμας.
                </p>
              </div>
              <div className="profile-field">
                <label className="profile-checkbox-label">
                  <input
                    type="checkbox"
                    checked={user.visibleToOtherUsers || false}
                    onChange={async (event) => {
                      const newValue = event.target.checked;
                      setSaveError(null);
                      setSaveMessage(null);
                      setIsSaving(true);
                      try {
                        const response = await updateProfile({ visibleToOtherUsers: newValue });
                        setStatus((prev) => ({ ...prev, user: response.user }));
                        setSaveMessage(
                          newValue
                            ? "Το προφίλ σας είναι τώρα ορατό σε άλλους χρήστες."
                            : "Το προφίλ σας δεν είναι πλέον ορατό σε άλλους χρήστες."
                        );
                      } catch (error) {
                        setSaveError(error.message || "Δεν ήταν δυνατή η ενημέρωση της ορατότητας.");
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    disabled={isSaving}
                  />
                  <span>Το προφίλ μου είναι ορατό σε άλλους χρήστες</span>
                </label>
                <p className="muted small">
                  Όταν ενεργοποιηθεί, το προφίλ σας θα εμφανίζεται στη λίστα χρηστών που μπορούν να δουν άλλοι 
                  συνδεδεμένοι χρήστες. Θα εμφανίζονται μόνο το όνομα, η φωτογραφία και βασικές πληροφορίες σας.
                </p>
                {saveMessage && <p className="success-text">{saveMessage}</p>}
                {saveError && <p className="error-text">{saveError}</p>}
              </div>
            </div>

            <div className="actions-row profile-actions">
              <button type="button" className="btn" onClick={loadProfile} disabled={loading}>
                Ανανέωση
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleLogout}
                disabled={!user || isLoggingOut}
              >
                {isLoggingOut ? "Αποσύνδεση..." : "Αποσύνδεση"}
              </button>
            </div>
          </div>
        )}

        {!loading && !user && (
          <div className="stack">
            <p className="muted">Δεν βρέθηκε ενεργή συνεδρία.</p>
            <Link to="/register" className="menu-auth-btn">
              Δημιουργία λογαριασμού
            </Link>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}
