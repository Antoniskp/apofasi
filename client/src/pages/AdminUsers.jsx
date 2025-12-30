import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, listUsers, updateUserRole } from "../lib/api.js";

const roleOptions = [
  { value: "user", label: "Χρήστης" },
  { value: "reporter", label: "Συντάκτης" },
  { value: "admin", label: "Διαχειριστής" }
];

const formatDate = (value) => {
  if (!value) return "–";

  try {
    return new Date(value).toLocaleDateString("el-GR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  } catch (error) {
    return "–";
  }
};

export default function AdminUsers() {
  const [session, setSession] = useState({ loading: true, user: null, error: null });
  const [usersState, setUsersState] = useState({ loading: false, data: [], error: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleDrafts, setRoleDrafts] = useState({});
  const [updates, setUpdates] = useState({});

  const isAdmin = session.user?.role === "admin";

  const loadSession = async () => {
    setSession((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getAuthStatus();
      setSession({ loading: false, user: data.user, error: null });

      if (data.user?.role === "admin") {
        await fetchUsers(searchTerm);
      }
    } catch (error) {
      setSession({
        loading: false,
        user: null,
        error:
          API_BASE_URL
            ? error.message || "Δεν ήταν δυνατή η ανάκτηση συνεδρίας."
            : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η ανάκτηση συνεδρίας.",
      });
    }
  };

  const fetchUsers = async (query = "") => {
    setUsersState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await listUsers(query);
      const users = data.users || [];
      setUsersState({ loading: false, data: users, error: null });
      setRoleDrafts(Object.fromEntries(users.map((user) => [user.id, user.role])));
    } catch (error) {
      setUsersState({
        loading: false,
        data: [],
        error: error.message || "Δεν ήταν δυνατή η ανάκτηση χρηστών.",
      });
    }
  };

  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = (userId, role) => {
    setRoleDrafts((prev) => ({ ...prev, [userId]: role }));
    setUpdates((prev) => ({ ...prev, [userId]: { ...prev[userId], success: null, error: null } }));
  };

  const handleRoleSave = async (userId) => {
    const selectedRole = roleDrafts[userId];

    if (!selectedRole) return;

    setUpdates((prev) => ({ ...prev, [userId]: { saving: true, error: null, success: null } }));

    try {
      const data = await updateUserRole(userId, selectedRole);
      setUsersState((prev) => ({
        ...prev,
        data: prev.data.map((user) =>
          user.id === userId
            ? { ...user, role: data.user.role }
            : user
        ),
      }));
      setUpdates((prev) => ({ ...prev, [userId]: { saving: false, error: null, success: "Ο ρόλος ενημερώθηκε." } }));
    } catch (error) {
      setUpdates((prev) => ({
        ...prev,
        [userId]: { saving: false, success: null, error: error.message || "Η ενημέρωση απέτυχε." },
      }));
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (!isAdmin) return;
    await fetchUsers(searchTerm);
  };

  return (
    <div className="section">
      <p className="pill">Διαχειριστής</p>
      <h1 className="section-title">Διαχείριση χρηστών</h1>
      <p className="muted">Οι διαχειριστές μπορούν να αναζητήσουν χρήστες και να τροποποιήσουν τον ρόλο τους.</p>

      <div className="card auth-card stack">
        {session.loading && <p className="muted">Φόρτωση συνεδρίας...</p>}

        {!session.loading && session.error && <p className="error-text">{session.error}</p>}

        {!session.loading && !session.error && !session.user && (
          <div className="stack">
            <p className="muted">Πρέπει να συνδεθείτε για να δείτε τους χρήστες.</p>
            <div className="cta-row">
              <Link className="btn" to="/auth">
                Σύνδεση
              </Link>
              <Link className="btn btn-outline" to="/register">
                Δημιουργία λογαριασμού
              </Link>
            </div>
          </div>
        )}

        {!session.loading && session.user && !isAdmin && (
          <p className="error-text">Δεν έχετε δικαίωμα πρόσβασης στη διαχείριση χρηστών.</p>
        )}

        {!session.loading && isAdmin && (
          <div className="stack">
            <form className="admin-search" onSubmit={handleSearchSubmit}>
              <div className="admin-search-field">
                <label className="label" htmlFor="search">
                  Αναζήτηση χρήστη
                </label>
                <input
                  id="search"
                  type="search"
                  name="search"
                  placeholder="Email, όνομα, username"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <button className="btn" type="submit" disabled={usersState.loading}>
                {usersState.loading ? "Αναζήτηση..." : "Αναζήτηση"}
              </button>
            </form>

            {usersState.error && <p className="error-text">{usersState.error}</p>}

            {!usersState.loading && usersState.data.length === 0 && !usersState.error && (
              <p className="muted">Δεν βρέθηκαν χρήστες με τα κριτήρια αναζήτησης.</p>
            )}

            {usersState.loading && <p className="muted">Φόρτωση χρηστών...</p>}

            {!usersState.loading && usersState.data.length > 0 && (
              <div className="user-table-wrapper">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Όνομα</th>
                      <th>Email</th>
                      <th>Πάροχος</th>
                      <th>Ρόλος</th>
                      <th>Δημιουργήθηκε</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersState.data.map((user) => {
                      const draftRole = roleDrafts[user.id] || user.role;
                      const updateState = updates[user.id] || {};
                      const roleChanged = draftRole !== user.role;

                      return (
                        <tr key={user.id}>
                          <td>
                            <div className="user-cell-primary">{user.displayName || user.username || "Χρήστης"}</div>
                            {user.username && <div className="muted">@{user.username}</div>}
                          </td>
                          <td>
                            <div className="user-cell-primary">{user.email || "—"}</div>
                          </td>
                          <td>
                            <span className="pill subtle">{user.provider}</span>
                          </td>
                          <td>
                            <div className="role-controls">
                              <select
                                value={draftRole}
                                onChange={(event) => handleRoleChange(user.id, event.target.value)}
                                disabled={updateState.saving}
                              >
                                {roleOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => handleRoleSave(user.id)}
                                disabled={updateState.saving || !roleChanged}
                              >
                                {updateState.saving ? "Αποθήκευση..." : "Αποθήκευση"}
                              </button>
                              {updateState.error && <div className="error-text small">{updateState.error}</div>}
                              {updateState.success && <div className="success-text">{updateState.success}</div>}
                            </div>
                          </td>
                          <td>{formatDate(user.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
