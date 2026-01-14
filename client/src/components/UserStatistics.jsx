import { useEffect, useState } from "react";
import { getUserStatistics } from "../lib/api.js";

export default function UserStatistics() {
  const [status, setStatus] = useState({ loading: true, stats: null, error: null });

  const loadStatistics = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getUserStatistics();
      setStatus({ loading: false, stats: data.statistics, error: null });
    } catch (error) {
      setStatus({
        loading: false,
        stats: null,
        error: error.message || "Δεν ήταν δυνατή η φόρτωση στατιστικών.",
      });
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const { loading, stats, error } = status;

  if (loading) {
    return (
      <div className="card">
        <p className="muted">Φόρτωση στατιστικών...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <p className="error-text">{error}</p>
        <button className="btn btn-outline" onClick={loadStatistics}>
          Προσπάθεια ξανά
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: "1rem" }}>Στατιστικά Χρηστών</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{stats.totalUsers.toLocaleString("el-GR")}</div>
          <div className="stat-label">Σύνολο Χρηστών</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.onlineUsers.toLocaleString("el-GR")}</div>
          <div className="stat-label">Συνδεδεμένοι Τώρα</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.pollsCreated.toLocaleString("el-GR")}</div>
          <div className="stat-label">Ψηφοφορίες που Δημιουργήθηκαν</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.registeredVotes.toLocaleString("el-GR")}</div>
          <div className="stat-label">Ψήφοι από Εγγεγραμμένους</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.anonymousVotes.toLocaleString("el-GR")}</div>
          <div className="stat-label">Ψήφοι Ανώνυμοι</div>
        </div>
      </div>
    </div>
  );
}
