import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listVisibleUsers } from "../lib/api.js";
import UserStatistics from "../components/UserStatistics.jsx";

export default function Users() {
  const [status, setStatus] = useState({ 
    loading: true, 
    users: [], 
    error: null,
    pagination: null 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  const loadUsers = async (page = 1) => {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const data = await listVisibleUsers(page, perPage);
      setStatus({ 
        loading: false, 
        users: data.users || [], 
        error: null,
        pagination: data.pagination || null
      });
      setCurrentPage(page);
    } catch (error) {
      setStatus({
        loading: false,
        users: [],
        error: error.message || "Δεν ήταν δυνατή η φόρτωση χρηστών.",
        pagination: null
      });
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  const handlePageChange = (newPage) => {
    loadUsers(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { loading, users, error, pagination } = status;

  return (
    <div className="section">
      <p className="pill">Χρήστες</p>
      <h1 className="section-title">Λίστα χρηστών</h1>
      <p className="muted">
        Προβολή χρηστών που έχουν επιλέξει να είναι ορατοί στην κοινότητα.
      </p>

      <UserStatistics />

      <div className="card" style={{ marginTop: "2rem" }}>
        {loading && <p className="muted">Φόρτωση χρηστών...</p>}

        {error && (
          <div className="stack">
            <p className="error-text">{error}</p>
            <button className="btn btn-outline" onClick={() => loadUsers(currentPage)}>
              Προσπάθεια ξανά
            </button>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <p className="muted">Δεν υπάρχουν ορατοί χρήστες αυτή τη στιγμή.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <>
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

            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="btn btn-outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                >
                  <i className="fa-solid fa-chevron-left" /> Προηγούμενη
                </button>
                
                <span className="pagination-info">
                  Σελίδα {pagination.page} από {pagination.totalPages} 
                  ({pagination.totalCount} χρήστες συνολικά)
                </span>
                
                <button 
                  className="btn btn-outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Επόμενη <i className="fa-solid fa-chevron-right" />
                </button>
              </div>
            )}
          </>
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
