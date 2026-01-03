import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, logoutUser, updateProfile } from "../lib/api.js";
import { CITIES_BY_REGION, REGION_NAMES } from "../../../shared/locations.js";

export default function Profile() {
  const [status, setStatus] = useState({ loading: true, user: null, error: null });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const getCityOptions = (region) => CITIES_BY_REGION[region] || [];
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
  ];

  const locationFields = [
    { key: "country", label: "Χώρα", placeholder: "Προσθέστε τη χώρα διαμονής σας." },
    {
      key: "region",
      label: "Περιφέρεια",
      placeholder: "Επιλέξτε την περιφέρεια κατοικίας σας.",
      type: "select",
      options: REGION_NAMES,
    },
    {
      key: "cityOrVillage",
      label: "Πόλη ή χωριό",
      placeholder: "Επιλέξτε πόλη ή χωριό από την περιφέρειά σας.",
      type: "select",
      getOptions: (state) => getCityOptions(state.region),
      disabledWhen: (state) => !state.region,
    },
  ];

  const allProfileFields = [...optionalFields, ...locationFields];

  const buildOptionalState = (userData) => {
    const state = allProfileFields.reduce(
      (acc, field) => ({ ...acc, [field.key]: userData?.[field.key] || "" }),
      {}
    );

    if (state.region && state.cityOrVillage && !getCityOptions(state.region).includes(state.cityOrVillage)) {
      state.cityOrVillage = "";
    }

    return state;
  };

  const [formState, setFormState] = useState(() => buildOptionalState(null));
  const [saveMessage, setSaveMessage] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const loadProfile = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getAuthStatus();
      setStatus({ loading: false, user: data.user, error: null });

      setFormState(buildOptionalState(data.user));
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

      if (key === "region") {
        const allowedCities = getCityOptions(value);
        if (!allowedCities.includes(nextState.cityOrVillage)) {
          nextState.cityOrVillage = "";
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
      const response = await updateProfile(formState);
      setStatus((prev) => ({ ...prev, user: response.user }));
      setSaveMessage("Τα στοιχεία σας αποθηκεύτηκαν.");
    } catch (error) {
      setSaveError(error.message || "Δεν ήταν δυνατή η ενημέρωση του προφίλ.");
    } finally {
      setIsSaving(false);
    }
  };

  const { loading, user, error } = status;

  return (
    <div className="section narrow">
      <p className="pill">Προφίλ</p>
      <h1 className="section-title">Το προφίλ σας</h1>
      <p className="muted">Προβάλλετε τα στοιχεία σύνδεσης και την κατάσταση της συνεδρίας σας.</p>

      <div className="card auth-card">
        {loading && <p className="muted">Φόρτωση προφίλ...</p>}

        {!loading && user && (
          <div className="stack profile-stack">
            <div className="profile-header">
              <div className="auth-user">
                {user.avatar && <img src={user.avatar} alt="Προφίλ" className="auth-avatar" />}
                <div>
                  <div className="auth-user-name">{user.displayName || "Χρήστης"}</div>
                  {(user.firstName || user.lastName) && (
                    <div className="muted">{[user.firstName, user.lastName].filter(Boolean).join(" ")}</div>
                  )}
                  {user.email && <div className="muted">{user.email}</div>}
                  <div className="pill subtle">Σύνδεση μέσω {user.provider}</div>
                </div>
              </div>

              <div className="profile-meta">
                <p className="label">Κατάσταση συνεδρίας</p>
                <p className="pill positive">Συνδεδεμένος/η</p>
                <p className="muted small">
                  Δείτε τα στοιχεία που έχουμε για εσάς και συμπληρώστε τα προαιρετικά πεδία όταν γίνουν διαθέσιμα.
                </p>
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
                              {option}
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
