import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COUNTRIES, GREEK_JURISDICTION_NAMES, CITIES_BY_JURISDICTION } from "../../../shared/locations.js";
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
    locationCountry: "",
    locationJurisdiction: "",
    locationCity: "",
    isAnonymousCreator: false,
    anonymousResponses: false,
    allowUserOptions: false,
    userOptionApproval: "auto",
    optionsArePeople: false,
    linkPolicyMode: "any",
    linkPolicyDomains: "",
    voteClosingDate: "",
    restrictToLocation: false,
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

  const handleOptionChange = (index, field, value) => {
    setFormState((prev) => {
      const nextOptions = [...prev.options];
      if (prev.optionsArePeople) {
        // In people mode, options are objects
        nextOptions[index] = {
          ...(typeof nextOptions[index] === "object" ? nextOptions[index] : { text: nextOptions[index] || "" }),
          [field]: value,
        };
      } else {
        // In normal mode, options are strings
        nextOptions[index] = value;
      }
      return { ...prev, options: nextOptions };
    });
  };

  const addOptionField = () => {
    setFormState((prev) => ({
      ...prev,
      options: [...prev.options, prev.optionsArePeople ? { text: "", photoUrl: "", photo: "", profileUrl: "" } : ""],
    }));
  };

  const removeOptionField = (index) => {
    setFormState((prev) => {
      const minOptions = prev.allowUserOptions ? 0 : 2;
      if (prev.options.length <= minOptions) return prev;
      const nextOptions = prev.options.filter((_, idx) => idx !== index);
      return { ...prev, options: nextOptions };
    });
  };

  const handlePhotoUpload = async (index, file) => {
    if (!file) return;

    const MAX_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setSubmission({ submitting: false, success: null, error: "Η φωτογραφία είναι πολύ μεγάλη (μέγιστο 4MB)." });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setSubmission({ submitting: false, success: null, error: "Μη έγκυρος τύπος φωτογραφίας." });
      return;
    }

    try {
      const dataUrl = await resizeImage(file, 360, 320 * 1024);
      handleOptionChange(index, "photo", dataUrl);
    } catch (error) {
      setSubmission({ submitting: false, success: null, error: error.message || "Σφάλμα επεξεργασίας φωτογραφίας." });
    }
  };

  const resizeImage = (file, maxDimension, maxBytes) =>
    new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
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

        while (getDataUrlSize(dataUrl) > maxBytes && quality > 0.55) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        if (getDataUrlSize(dataUrl) > maxBytes) {
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

  const getDataUrlSize = (dataUrl) => {
    if (!dataUrl) return 0;
    const base64 = dataUrl.split(",")[1] || "";
    return Math.ceil((base64.length * 3) / 4);
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!authState.user) {
      setSubmission({ submitting: false, success: null, error: "Χρειάζεται σύνδεση για να καταχωρήσετε ψηφοφορία." });
      return;
    }

    const trimmedQuestion = formState.question.trim();
    
    let processedOptions;
    if (formState.optionsArePeople) {
      // People mode: validate and process options as objects
      processedOptions = formState.options
        .map((opt) => {
          if (typeof opt === "object") {
            return {
              text: opt.text?.trim() || "",
              photoUrl: opt.photoUrl?.trim() || "",
              photo: opt.photo || "",
              profileUrl: opt.profileUrl?.trim() || "",
            };
          }
          return null;
        })
        .filter((opt) => opt && opt.text);
    } else {
      // Normal mode: process as strings
      const cleanedOptions = formState.options
        .map((opt) => (typeof opt === "string" ? opt : opt?.text || ""))
        .map((text) => text?.trim())
        .filter(Boolean);
      processedOptions = cleanedOptions;
    }

    const distinctOptions = Array.from(
      new Map(
        processedOptions.map((opt) => {
          const key = typeof opt === "string" ? opt : opt.text;
          return [key, opt];
        })
      ).values()
    );

    // Validate based on allowUserOptions setting
    if (!trimmedQuestion) {
      setSubmission({ submitting: false, success: null, error: "Συμπληρώστε ερώτηση." });
      return;
    }
    
    // When allowUserOptions is true, minOptionsRequired is 0 (no minimum)
    // When allowUserOptions is false, minOptionsRequired is 2 (existing behavior)
    const minOptionsRequired = formState.allowUserOptions ? 0 : 2;
    if (distinctOptions.length < minOptionsRequired) {
      // This only executes when allowUserOptions is false and we have < 2 options
      setSubmission({ submitting: false, success: null, error: "Συμπληρώστε τουλάχιστον δύο μοναδικές επιλογές." });
      return;
    }

    // Basic client-side validation for people mode - photo and profileUrl are now optional
    if (formState.optionsArePeople) {
      for (const option of distinctOptions) {
        if (!option.text?.trim()) {
          setSubmission({ submitting: false, success: null, error: "Το όνομα είναι υποχρεωτικό για όλα τα πρόσωπα." });
          return;
        }
        // Photo and profileUrl validations removed - they are now optional
      }
    }

    const tags = uniqueTags(formState.tags);

    // Build link policy
    const linkPolicy = {
      mode: formState.linkPolicyMode,
      allowedDomains: formState.linkPolicyMode === "allowlist" 
        ? formState.linkPolicyDomains.split(",").map((d) => d.trim()).filter(Boolean)
        : []
    };

    setSubmission({ submitting: true, success: null, error: null });

    try {
      const response = await createPoll({
        question: trimmedQuestion,
        options: distinctOptions,
        tags,
        locationCountry: formState.locationCountry,
        locationJurisdiction: formState.locationJurisdiction,
        locationCity: formState.locationCity,
        isAnonymousCreator: formState.isAnonymousCreator,
        anonymousResponses: formState.anonymousResponses,
        allowUserOptions: formState.allowUserOptions,
        userOptionApproval: formState.userOptionApproval,
        optionsArePeople: formState.optionsArePeople,
        linkPolicy,
        voteClosingDate: formState.voteClosingDate || null,
        restrictToLocation: formState.restrictToLocation,
      });

      setSubmission({ submitting: false, success: "Η ψηφοφορία δημοσιεύτηκε.", error: null });
      setFormState({
        question: "",
        options: DEFAULT_OPTIONS,
        tags: "",
        locationCountry: "",
        locationJurisdiction: "",
        locationCity: "",
        isAnonymousCreator: false,
        anonymousResponses: false,
        allowUserOptions: false,
        userOptionApproval: "auto",
        optionsArePeople: false,
        linkPolicyMode: "any",
        linkPolicyDomains: "",
        voteClosingDate: "",
        restrictToLocation: false,
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
                {formState.options.map((option, index) => {
                  const optionText = typeof option === "string" ? option : option.text || "";
                  const optionPhotoUrl = typeof option === "object" ? option.photoUrl || "" : "";
                  const optionPhoto = typeof option === "object" ? option.photo || "" : "";
                  const optionProfileUrl = typeof option === "object" ? option.profileUrl || "" : "";

                  return (
                    <div key={index} className={formState.optionsArePeople ? "option-row-people" : "option-row option-row-modern"}>
                      {formState.optionsArePeople ? (
                        <div className="people-option-fields">
                          <input
                            className="input-modern"
                            type="text"
                            value={optionText}
                            onChange={(event) => handleOptionChange(index, "text", event.target.value)}
                            placeholder="Όνομα προσώπου"
                          />
                          <input
                            className="input-modern"
                            type="url"
                            value={optionPhotoUrl}
                            onChange={(event) => handleOptionChange(index, "photoUrl", event.target.value)}
                            placeholder="URL φωτογραφίας (https://...)"
                          />
                          <div className="photo-upload-row">
                            <label className="btn btn-outline btn-sm">
                              Ή ανέβασμα φωτογραφίας
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(event) => handlePhotoUpload(index, event.target.files?.[0])}
                                style={{ display: "none" }}
                              />
                            </label>
                            {optionPhoto && <span className="muted small">✓ Ανέβηκε</span>}
                          </div>
                          <input
                            className="input-modern"
                            type="url"
                            value={optionProfileUrl}
                            onChange={(event) => handleOptionChange(index, "profileUrl", event.target.value)}
                            placeholder="URL προφίλ/social (https://...)"
                          />
                          {formState.options.length > (formState.allowUserOptions ? 0 : 2) && (
                            <button
                              type="button"
                              className="btn btn-subtle btn-sm"
                              onClick={() => removeOptionField(index)}
                              aria-label="Αφαίρεση επιλογής"
                            >
                              Αφαίρεση
                            </button>
                          )}
                        </div>
                      ) : (
                        <>
                          <input
                            className="input-modern"
                            type="text"
                            value={optionText}
                            onChange={(event) => handleOptionChange(index, "text", event.target.value)}
                            placeholder={`Επιλογή ${index + 1}`}
                          />
                          {formState.options.length > (formState.allowUserOptions ? 0 : 2) && (
                            <button
                              type="button"
                              className="btn btn-subtle"
                              onClick={() => removeOptionField(index)}
                              aria-label="Αφαίρεση επιλογής"
                            >
                              Αφαίρεση
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
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
                <p className="label">Χώρα (προαιρετικό)</p>
                <select
                  className="input-modern"
                  value={formState.locationCountry}
                  onChange={(event) => handleCountryChange(event.target.value)}
                >
                  <option value="">Χωρίς τοποθεσία</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <p className="muted small">αν επιλέξετε τοποθεσία, μπορείτε να περιορίσετε τις ψήφους μόνο σε χρήστες από αυτή την περιοχή</p>
              </div>
              {formState.locationCountry === "greece" && (
                <div>
                  <p className="label">Περιφέρεια (προαιρετικό)</p>
                  <select
                    className="input-modern"
                    value={formState.locationJurisdiction}
                    onChange={(event) => handleJurisdictionChange(event.target.value)}
                  >
                    <option value="">Χωρίς επιλογή</option>
                    {GREEK_JURISDICTION_NAMES.map((jurisdiction) => (
                      <option key={jurisdiction} value={jurisdiction}>
                        {jurisdiction}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {formState.locationJurisdiction && (
                <div>
                  <p className="label">Πόλη ή Κοινότητα (προαιρετικό)</p>
                  <select
                    className="input-modern"
                    value={formState.locationCity}
                    onChange={(event) => setFormState((prev) => ({ ...prev, locationCity: event.target.value }))}
                  >
                    <option value="">Χωρίς επιλογή</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {(formState.locationCountry || formState.locationJurisdiction || formState.locationCity) && (
              <label className="privacy-tile">
                <div className="privacy-toggle">
                  <input
                    type="checkbox"
                    checked={formState.restrictToLocation}
                    disabled={formState.anonymousResponses}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, restrictToLocation: event.target.checked }))
                    }
                  />
                  <span className="toggle-visual" aria-hidden />
                </div>
                <div>
                  <p className="label">Περιορισμός ψηφοφορίας βάσει τοποθεσίας</p>
                  <p className="muted small">
                    Μόνο χρήστες από την επιλεγμένη τοποθεσία θα μπορούν να ψηφίσουν.
                    {formState.anonymousResponses && " (Μη διαθέσιμο με ανώνυμη συμμετοχή)"}
                  </p>
                </div>
              </label>
            )}

            <div className="privacy-grid">
              <label className="privacy-tile">
                <div className="privacy-toggle">
                  <input
                    type="checkbox"
                    checked={formState.allowUserOptions}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, allowUserOptions: event.target.checked }))
                    }
                  />
                  <span className="toggle-visual" aria-hidden />
                </div>
                <div>
                  <p className="label">Επιτρέπονται επιλογές χρηστών</p>
                  <p className="muted small">Οι χρήστες μπορούν να προσθέσουν τις δικές τους απαντήσεις.</p>
                </div>
              </label>

              <label className="privacy-tile">
                <div className="privacy-toggle">
                  <input
                    type="checkbox"
                    checked={formState.optionsArePeople}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, optionsArePeople: event.target.checked }))
                    }
                  />
                  <span className="toggle-visual" aria-hidden />
                </div>
                <div>
                  <p className="label">Λειτουργία προσώπων</p>
                  <p className="muted small">Οι επιλογές αντιπροσωπεύουν πρόσωπα με φωτογραφία και προφίλ.</p>
                </div>
              </label>
            </div>

            {formState.allowUserOptions && (
              <div>
                <p className="label">Έγκριση επιλογών χρηστών</p>
                <select
                  className="input-modern"
                  value={formState.userOptionApproval}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, userOptionApproval: event.target.value }))
                  }
                >
                  <option value="auto">Αυτόματη έγκριση</option>
                  <option value="creator">Έγκριση από δημιουργό</option>
                </select>
                <p className="muted small">
                  Επιλέξτε αν οι νέες επιλογές θα εγκρίνονται αυτόματα ή θα χρειάζεται η έγκρισή σας.
                </p>
              </div>
            )}

            {formState.optionsArePeople && (
              <div>
                <p className="label">Πολιτική συνδέσμων</p>
                <select
                  className="input-modern"
                  value={formState.linkPolicyMode}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, linkPolicyMode: event.target.value }))
                  }
                >
                  <option value="any">Οποιοδήποτε HTTPS URL</option>
                  <option value="allowlist">Μόνο επιτρεπόμενα domains</option>
                </select>
                {formState.linkPolicyMode === "allowlist" && (
                  <>
                    <input
                      className="input-modern"
                      type="text"
                      value={formState.linkPolicyDomains}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, linkPolicyDomains: event.target.value }))
                      }
                      placeholder="π.χ. facebook.com, instagram.com, linkedin.com"
                    />
                    <p className="muted small">
                      Χωρίστε με κόμμα τα επιτρεπόμενα domains.
                    </p>
                  </>
                )}
              </div>
            )}

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
                      setFormState((prev) => ({ 
                        ...prev, 
                        anonymousResponses: event.target.checked,
                        // Disable location restriction when anonymous responses is enabled
                        restrictToLocation: event.target.checked ? false : prev.restrictToLocation
                      }))
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

            <div>
              <p className="label">Ημερομηνία και ώρα λήξης ψηφοφορίας (προαιρετικό)</p>
              <input
                className="input-modern"
                type="datetime-local"
                value={formState.voteClosingDate}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, voteClosingDate: event.target.value }))
                }
              />
              <p className="muted small">
                Ορίστε πότε θα κλείσει η ψηφοφορία. Αφήστε κενό για απεριόριστη διάρκεια.
              </p>
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
