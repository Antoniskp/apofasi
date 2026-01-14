import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listVisibleUsers } from "../lib/api.js";

export default function Users() {
  const [status, setStatus] = useState({ loading: true, users: [], error: null });

  const loadUsers = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const data = await listVisibleUsers();
      setStatus({ loading: false, users: data.users || [], error: null });
    } catch (error) {
      setStatus({
        loading: false,
        users: [],
        error: error.message || "Δεν ήταν δυνατή η φόρτωση χρηστών.",
      });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const { loading, users, error } = status;

  return (
    <div className="section">
      <p className="pill">Χρήστες</p>
      <h1 className="section-title">Λίστα χρηστών</h1>
      <p className="muted">
        Προβολή χρηστών που έχουν επιλέξει να είναι ορατοί στην κοινότητα.
      </p>

      <div className="card">
        {loading && <p className="muted">Φόρτωση χρηστών...</p>}

        {error && (
          <div className="stack">
            <p className="error-text">{error}</p>
            <button className="btn btn-outline" onClick={loadUsers}>
              Προσπάθεια ξανά
            </button>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <p className="muted">Δεν υπάρχουν ορατοί χρήστες αυτή τη στιγμή.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  {user.avatar && (
                    <img src={user.avatar} alt={user.displayName} className="user-avatar" />
                  )}
                  {!user.avatar && (
                    <div className="user-avatar-placeholder">
                      <i className="fa-solid fa-user" />
                    </div>
                  )}
                </div>
                <div className="user-card-body">
                  <h3 className="user-card-name">{user.displayName || "Χρήστης"}</h3>
                  {(user.firstName || user.lastName) && (
                    <p className="muted small">
                      {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                    </p>
                  )}
                  {user.username && (
                    <p className="muted small">@{user.username}</p>
                  )}
                  {user.occupation && (
                    <p className="pill subtle">{user.occupation}</p>
                  )}
                  {(user.region || user.cityOrVillage) && (
                    <p className="muted small">
                      <i className="fa-solid fa-location-dot" style={{ marginRight: "0.25rem" }} />
                      {[user.cityOrVillage, user.region].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {user.createdAt && (
                    <p className="muted small">
                      Μέλος από {new Date(user.createdAt).toLocaleDateString("el-GR")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cta-row" style={{ marginTop: "2rem" }}>
        <Link to="/profile" className="btn btn-outline">
          Διαχείριση προφίλ
        </Link>
      </div>
    </div>
  );
}
