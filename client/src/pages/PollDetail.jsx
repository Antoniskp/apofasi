import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, getPoll, voteOnPoll, cancelVoteOnPoll, deletePoll, addOptionToPoll, listPendingOptions, approveOption, deleteOption } from "../lib/api.js";

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("el-GR", { dateStyle: "medium", timeStyle: "short" });
};

// Generate a consistent color from a string
const stringToColor = (str) => {
  if (!str) return "hsl(200, 50%, 50%)";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

// Get initials from name
const getInitials = (name) => {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

export default function PollDetail() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({ loading: true, user: null, error: null });
  const [pollState, setPollState] = useState({ loading: true, poll: null, error: null });
  const [voteState, setVoteState] = useState({ submitting: false, error: null });
  const [cancelState, setCancelState] = useState({ cancelling: false, error: null });
  const [deleteState, setDeleteState] = useState({ deleting: false, error: null });
  const [addOptionState, setAddOptionState] = useState({ adding: false, error: null, success: null });
  const [newOption, setNewOption] = useState({ text: "", photoUrl: "", photo: "", profileUrl: "" });
  const [showAddOption, setShowAddOption] = useState(false);
  const [pendingOptions, setPendingOptions] = useState([]);
  const [moderationState, setModerationState] = useState({ loading: false, error: null });

  const totalVotes = useMemo(() => pollState.poll?.totalVotes || 0, [pollState.poll]);

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

  const loadPoll = async () => {
    if (!pollId) return;
    setPollState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getPoll(pollId);
      setPollState({ loading: false, poll: data.poll, error: null });
    } catch (error) {
      setPollState({
        loading: false,
        poll: null,
        error: API_BASE_URL
          ? error.message || "Δεν ήταν δυνατή η φόρτωση της ψηφοφορίας."
          : "Ορίστε το VITE_API_BASE_URL για να φορτώσει η ψηφοφορία.",
      });
    }
  };

  useEffect(() => {
    loadAuthStatus();
    loadPoll();
  }, [pollId]);

  const handleVote = async (optionId) => {
    if (!pollState.poll) return;

    if (!optionId || typeof optionId !== "string") {
      setVoteState({ submitting: false, error: "Επιλέξτε μία από τις διαθέσιμες απαντήσεις." });
      return;
    }

    if (!pollState.poll.anonymousResponses && !authState.user) {
      setVoteState({ submitting: false, error: "Χρειάζεται σύνδεση για να ψηφίσετε." });
      return;
    }

    setVoteState({ submitting: true, error: null });

    try {
      const response = await voteOnPoll(pollState.poll.id, optionId);
      setPollState((prev) => ({ ...prev, poll: response.poll }));
      setVoteState({ submitting: false, error: null });
    } catch (error) {
      setVoteState({
        submitting: false,
        error: error.message || "Η ψήφος δεν καταχωρήθηκε.",
      });
    }
  };

  const handleCancelVote = async () => {
    if (!pollState.poll) return;

    setCancelState({ cancelling: true, error: null });

    try {
      const response = await cancelVoteOnPoll(pollState.poll.id);
      setPollState((prev) => ({ ...prev, poll: response.poll }));
      setCancelState({ cancelling: false, error: null });
      setVoteState({ submitting: false, error: null });
    } catch (error) {
      setCancelState({
        cancelling: false,
        error: error.message || "Η ακύρωση της ψήφου απέτυχε.",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την ψηφοφορία;")) {
      return;
    }

    setDeleteState({ deleting: true, error: null });

    try {
      await deletePoll(pollId);
      navigate("/polls");
    } catch (error) {
      setDeleteState({
        deleting: false,
        error: error.message || "Η διαγραφή απέτυχε.",
      });
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;

    const MAX_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setAddOptionState({ adding: false, error: "Η φωτογραφία είναι πολύ μεγάλη (μέγιστο 4MB).", success: null });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setAddOptionState({ adding: false, error: "Μη έγκυρος τύπος φωτογραφίας.", success: null });
      return;
    }

    try {
      const dataUrl = await resizeImage(file, 360, 320 * 1024);
      setNewOption((prev) => ({ ...prev, photo: dataUrl }));
    } catch (error) {
      setAddOptionState({ adding: false, error: error.message || "Σφάλμα επεξεργασίας φωτογραφίας.", success: null });
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

        const getDataUrlSize = (url) => {
          if (!url) return 0;
          const base64 = url.split(",")[1] || "";
          return Math.ceil((base64.length * 3) / 4);
        };

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

  const handleAddOption = async () => {
    if (!pollState.poll) return;

    setAddOptionState({ adding: true, error: null, success: null });

    try {
      const response = await addOptionToPoll(pollState.poll.id, newOption);
      setPollState((prev) => ({ ...prev, poll: response.poll }));
      setAddOptionState({ adding: false, error: null, success: response.message || "Η επιλογή προστέθηκε επιτυχώς." });
      setNewOption({ text: "", photoUrl: "", photo: "", profileUrl: "" });
      setShowAddOption(false);
      
      // Reload pending options if creator
      if (pollState.poll.isCreatorOrAdmin && pollState.poll.userOptionApproval === "creator") {
        loadPendingOptions();
      }
    } catch (error) {
      setAddOptionState({
        adding: false,
        error: error.message || "Δεν ήταν δυνατή η προσθήκη της επιλογής.",
        success: null
      });
    }
  };

  const loadPendingOptions = async () => {
    if (!pollState.poll?.isCreatorOrAdmin) return;
    
    setModerationState({ loading: true, error: null });
    try {
      const data = await listPendingOptions(pollId);
      setPendingOptions(data.options || []);
      setModerationState({ loading: false, error: null });
    } catch (error) {
      setModerationState({ loading: false, error: error.message });
    }
  };

  const handleApproveOption = async (optionId) => {
    setModerationState({ loading: true, error: null });
    try {
      const response = await approveOption(pollId, optionId);
      setPollState((prev) => ({ ...prev, poll: response.poll }));
      await loadPendingOptions();
      setModerationState({ loading: false, error: null });
    } catch (error) {
      setModerationState({ loading: false, error: error.message });
    }
  };

  const handleDeleteOption = async (optionId) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την επιλογή;")) {
      return;
    }

    setModerationState({ loading: true, error: null });
    try {
      const response = await deleteOption(pollId, optionId);
      setPollState((prev) => ({ ...prev, poll: response.poll }));
      await loadPendingOptions();
      setModerationState({ loading: false, error: null });
    } catch (error) {
      setModerationState({ loading: false, error: error.message });
    }
  };

  useEffect(() => {
    if (pollState.poll?.isCreatorOrAdmin && pollState.poll.userOptionApproval === "creator") {
      loadPendingOptions();
    }
  }, [pollState.poll?.isCreatorOrAdmin, pollState.poll?.userOptionApproval]);

  const { loading: authLoading, user, error: authError } = authState;
  const { loading: pollLoading, poll, error: pollError } = pollState;

  return (
    <div className="section narrow">
      <p className="pill">Ψηφοφορίες</p>
      <div className="section-header">
        <h1 className="section-title">Λεπτομέρειες ψηφοφορίας</h1>
        <div className="cta-row">
          <Link className="btn btn-outline" to="/polls">
            Πίσω στις ψηφοφορίες
          </Link>
        </div>
      </div>

      {authLoading && <p className="muted">Φόρτωση συνεδρίας...</p>}
      {!authLoading && authError && <p className="error-text">{authError}</p>}

      {pollLoading && <p className="muted">Φόρτωση ψηφοφορίας...</p>}
      {!pollLoading && pollError && <p className="error-text">{pollError}</p>}

      {!pollLoading && !pollError && poll && (
        <div className="card poll-card modern-card">
          <div className="poll-header-row">
            <div className="pill pill-soft">Ψηφοφορία</div>
            <div className="muted small">{formatDateTime(poll.createdAt)}</div>
          </div>

          <h3 className="poll-question">{poll.question}</h3>

          <div className="poll-meta-row">
            <span className="muted small">
              {poll.isAnonymousCreator ? "Ανώνυμος δημιουργός" : `Δημιουργός: ${poll.createdBy?.displayName || "—"}`}
            </span>
            {poll.anonymousResponses && <span className="pill pill-ghost">Ανώνυμες ψήφοι</span>}
          </div>

          {poll.tags?.length > 0 && (
            <div className="chips">
              {poll.tags.map((tag) => (
                <span key={tag} className="chip">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {(poll.region || poll.cityOrVillage) && (
            <p className="muted small">
              Τοποθεσία: {[poll.region, poll.cityOrVillage].filter(Boolean).join(" • ")}
            </p>
          )}

          {poll.anonymousResponses && (
            <p className="muted small">Οι ψήφοι καταγράφονται ανώνυμα — μία συμμετοχή ανά συσκευή.</p>
          )}

          <div className="poll-options-list">
            {poll.options.map((option) => {
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              const disabled = voteState.submitting || cancelState.cancelling;
              const isVotedOption = poll.votedOptionId === option.id;
              const isPending = option.status === "pending";

              if (poll.optionsArePeople) {
                // Render person card
                const photoSrc = option.photo || option.photoUrl;
                const backgroundColor = stringToColor(option.text);
                const initials = getInitials(option.text);
                
                return (
                  <div key={option.id} className={`poll-option person-option ${isPending ? "pending" : ""}`}>
                    {photoSrc ? (
                      <img src={photoSrc} alt={option.text} className="person-photo" />
                    ) : (
                      <div className="person-photo-placeholder" style={{ backgroundColor }}>
                        {initials}
                      </div>
                    )}
                    <div className="poll-option-content">
                      <div className="poll-option-header">
                        <div className="poll-option-title">
                          {option.text}
                          {isPending && <span className="pending-badge">Εκκρεμεί</span>}
                          {isVotedOption && <span className="muted"> (Η ψήφος σας)</span>}
                        </div>
                        <div className="muted small">
                          {option.votes} ψήφοι {totalVotes > 0 ? `• ${percentage}%` : ""}
                        </div>
                      </div>
                      {option.profileUrl && (
                        <a href={option.profileUrl} target="_blank" rel="noopener noreferrer" className="person-link">
                          {option.profileUrl}
                        </a>
                      )}
                      <div className="progress-track" aria-hidden>
                        <div className="progress-bar" style={{ width: `${percentage}%` }} />
                      </div>
                      {!isPending && (poll.hasVoted ? (
                        !isVotedOption && (
                          <button
                            className="btn btn-outline"
                            type="button"
                            disabled={disabled}
                            onClick={() => handleVote(option.id)}
                          >
                            {voteState.submitting ? "Αλλαγή..." : "Αλλαγή ψήφου"}
                          </button>
                        )
                      ) : (
                        <button
                          className="btn btn-outline"
                          type="button"
                          disabled={disabled}
                          onClick={() => handleVote(option.id)}
                        >
                          {voteState.submitting ? "Καταχώρηση..." : "Ψήφισε"}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              // Normal mode rendering
              return (
                <div key={option.id} className="poll-option">
                  <div className="poll-option-header">
                    <div className="poll-option-title">
                      {option.text}
                      {isPending && <span className="pending-badge">Εκκρεμεί</span>}
                      {isVotedOption && <span className="muted"> (Η ψήφος σας)</span>}
                    </div>
                    <div className="muted small">
                      {option.votes} ψήφοι {totalVotes > 0 ? `• ${percentage}%` : ""}
                    </div>
                  </div>
                  <div className="progress-track" aria-hidden>
                    <div className="progress-bar" style={{ width: `${percentage}%` }} />
                  </div>
                  {!isPending && (poll.hasVoted ? (
                    !isVotedOption && (
                      <button
                        className="btn btn-outline"
                        type="button"
                        disabled={disabled}
                        onClick={() => handleVote(option.id)}
                      >
                        {voteState.submitting ? "Αλλαγή..." : "Αλλαγή ψήφου"}
                      </button>
                    )
                  ) : (
                    <button
                      className="btn btn-outline"
                      type="button"
                      disabled={disabled}
                      onClick={() => handleVote(option.id)}
                    >
                      {voteState.submitting ? "Καταχώρηση..." : "Ψήφισε"}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          {poll.hasVoted && (
            <div>
              <p className="positive-text small">Έχετε ήδη ψηφίσει.</p>
              <button
                className="btn btn-subtle"
                type="button"
                disabled={cancelState.cancelling || voteState.submitting}
                onClick={handleCancelVote}
              >
                {cancelState.cancelling ? "Ακύρωση..." : "Ακύρωση ψήφου"}
              </button>
            </div>
          )}
          {voteState.error && <p className="error-text">{voteState.error}</p>}
          {cancelState.error && <p className="error-text">{cancelState.error}</p>}

          {poll.allowUserOptions && (!poll.anonymousResponses ? user : true) && (
            <div className="add-option-card">
              <div className="stack">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p className="label" style={{ margin: 0 }}>Προσθήκη νέας επιλογής</p>
                  <button
                    className="btn btn-outline btn-sm"
                    type="button"
                    onClick={() => setShowAddOption(!showAddOption)}
                  >
                    {showAddOption ? "Ακύρωση" : "Προσθήκη"}
                  </button>
                </div>

                {showAddOption && (
                  <div className="add-option-form">
                    <input
                      className="input-modern"
                      type="text"
                      value={newOption.text}
                      onChange={(e) => setNewOption((prev) => ({ ...prev, text: e.target.value }))}
                      placeholder={poll.optionsArePeople ? "Όνομα προσώπου" : "Κείμενο επιλογής"}
                    />

                    {poll.optionsArePeople && (
                      <>
                        <input
                          className="input-modern"
                          type="url"
                          value={newOption.photoUrl}
                          onChange={(e) => setNewOption((prev) => ({ ...prev, photoUrl: e.target.value }))}
                          placeholder="URL φωτογραφίας (https://...)"
                        />
                        <div className="photo-upload-row">
                          <label className="btn btn-outline btn-sm">
                            Ή ανέβασμα φωτογραφίας
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                              style={{ display: "none" }}
                            />
                          </label>
                          {newOption.photo && <span className="muted small">✓ Ανέβηκε</span>}
                        </div>
                        <input
                          className="input-modern"
                          type="url"
                          value={newOption.profileUrl}
                          onChange={(e) => setNewOption((prev) => ({ ...prev, profileUrl: e.target.value }))}
                          placeholder="URL προφίλ/social (https://...)"
                        />
                      </>
                    )}

                    <button
                      className="btn"
                      type="button"
                      disabled={addOptionState.adding || !newOption.text.trim()}
                      onClick={handleAddOption}
                    >
                      {addOptionState.adding ? "Προσθήκη..." : "Προσθήκη επιλογής"}
                    </button>

                    {addOptionState.error && <p className="error-text">{addOptionState.error}</p>}
                    {addOptionState.success && <p className="positive-text">{addOptionState.success}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {poll.isCreatorOrAdmin && pendingOptions.length > 0 && (
            <div className="moderation-panel">
              <p className="label">Εκκρεμείς επιλογές προς έγκριση</p>
              <div className="moderation-options-list">
                {pendingOptions.map((option) => (
                  <div key={option.id} className="moderation-option">
                    <div>
                      <div className="poll-option-title">{option.text}</div>
                      {poll.optionsArePeople && option.profileUrl && (
                        <a href={option.profileUrl} target="_blank" rel="noopener noreferrer" className="person-link small">
                          {option.profileUrl}
                        </a>
                      )}
                    </div>
                    <div className="moderation-actions">
                      <button
                        className="btn btn-outline btn-sm"
                        type="button"
                        disabled={moderationState.loading}
                        onClick={() => handleApproveOption(option.id)}
                      >
                        Έγκριση
                      </button>
                      <button
                        className="btn btn-subtle btn-sm"
                        type="button"
                        disabled={moderationState.loading}
                        onClick={() => handleDeleteOption(option.id)}
                      >
                        Διαγραφή
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {moderationState.error && <p className="error-text">{moderationState.error}</p>}
            </div>
          )}

          <div className="cta-row" style={{ marginTop: "1rem" }}>
            <Link className="btn btn-outline" to={`/polls/${pollId}/statistics`}>
              Στατιστικά
            </Link>
            {user && poll.createdBy && poll.createdBy.email === user.email && (
              <button
                className="btn btn-subtle"
                type="button"
                disabled={deleteState.deleting}
                onClick={handleDelete}
              >
                {deleteState.deleting ? "Διαγραφή..." : "Διαγραφή ψηφοφορίας"}
              </button>
            )}
          </div>
          {deleteState.error && <p className="error-text">{deleteState.error}</p>}
        </div>
      )}
    </div>
  );
}
