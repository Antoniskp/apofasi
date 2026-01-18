import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAuthStatus, listArticles } from "../lib/api.js";

const hasEditorAccess = (user) => user && ["reporter", "editor", "admin"].includes(user.role);

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("el-GR", { dateStyle: "medium", timeStyle: "short" });
};

export default function News() {
  const [status, setStatus] = useState({ loading: true, user: null, error: null });
  const [newsFeed, setNewsFeed] = useState({ loading: true, news: [], error: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const loadSession = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getAuthStatus();
      setStatus({ loading: false, user: data.user, error: null });
    } catch (error) {
      setStatus({
        loading: false,
        user: null,
        error:
          API_BASE_URL
            ? error.message || "Δεν ήταν δυνατή η ανάκτηση συνεδρίας."
            : "Ορίστε το VITE_API_BASE_URL για να λειτουργήσει η ανάκτηση συνεδρίας.",
      });
    }
  };

  const loadNews = async () => {
    setNewsFeed((prev) => ({ ...prev, loading: true }));

    try {
      const articlesData = await listArticles();
      
      // Filter articles that are tagged as news and sort by date
      const newsArticles = (articlesData.articles || [])
        .filter(article => article.isNews)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setNewsFeed({ loading: false, news: newsArticles, error: null });
    } catch (error) {
      setNewsFeed({
        loading: false,
        news: [],
        error:
          API_BASE_URL
            ? error.message || "Δεν ήταν δυνατή η φόρτωση ειδήσεων."
            : "Ορίστε το VITE_API_BASE_URL για να φορτώσουν οι ειδήσεις.",
      });
    }
  };

  useEffect(() => {
    loadSession();
    loadNews();
  }, []);

  const { user } = status;
  const canManageNews = hasEditorAccess(user);
  const normalizedSearch = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm]);
  const availableRegions = useMemo(() => {
    const regions = new Set(newsFeed.news.map((article) => article.region).filter(Boolean));
    return Array.from(regions).sort((a, b) => a.localeCompare(b, "el-GR"));
  }, [newsFeed.news]);
  const availableCities = useMemo(() => {
    const cities = newsFeed.news
      .filter((article) => !selectedRegion || article.region === selectedRegion)
      .map((article) => article.cityOrVillage)
      .filter(Boolean);
    return Array.from(new Set(cities)).sort((a, b) => a.localeCompare(b, "el-GR"));
  }, [newsFeed.news, selectedRegion]);
  const filteredNews = useMemo(() => newsFeed.news.filter((article) => {
    const matchesRegion = !selectedRegion || article.region === selectedRegion;
    const matchesCity = !selectedCity || article.cityOrVillage === selectedCity;
    const searchTarget = [
      article.title,
      article.subtitle,
      article.content,
      article.author?.displayName,
      article.region,
      article.cityOrVillage,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !normalizedSearch || searchTarget.includes(normalizedSearch);
    return matchesRegion && matchesCity && matchesSearch;
  }), [newsFeed.news, normalizedSearch, selectedCity, selectedRegion]);

  return (
    <div className="section">
      <h1 className="section-title">Ειδήσεις</h1>
      <p className="muted">
        Οι συντάκτες και οι διαχειριστές μπορούν να επισημαίνουν άρθρα ως ειδήσεις.
        {canManageNews && " Επισκεφθείτε τη σελίδα άρθρων για να δημιουργήσετε νέα άρθρα."}
      </p>

      <div className="section">
        <div className="toolbar-container">
          <div className="toolbar-left">
            <input
              className="input-modern compact"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="🔍 Αναζήτηση ειδήσεων..."
            />
            <select
              className="input-modern compact"
              value={selectedRegion}
              onChange={(event) => {
                setSelectedRegion(event.target.value);
                setSelectedCity("");
              }}
            >
              <option value="">Όλες οι περιφέρειες</option>
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <select
              className="input-modern compact"
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
            >
              <option value="">Όλες οι πόλεις / χωριά</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {newsFeed.loading && <p className="muted">Φόρτωση ειδήσεων...</p>}
        {newsFeed.error && <p className="error-text">{newsFeed.error}</p>}

        {!newsFeed.loading && !newsFeed.error && newsFeed.news.length === 0 && (
          <div className="card muted-border">
            <p className="muted">Δεν έχουν επισημανθεί άρθρα ως ειδήσεις ακόμα.</p>
          </div>
        )}

        {!newsFeed.loading && !newsFeed.error && newsFeed.news.length > 0 && filteredNews.length === 0 && (
          <div className="card muted-border">
            <p className="muted">Δεν βρέθηκαν ειδήσεις με τα επιλεγμένα φίλτρα.</p>
          </div>
        )}

        <div className="responsive-card-grid">
          {filteredNews.map((article) => (
            <div key={article.id} className="card compact-card">
              {article.photo || article.photoUrl ? (
                <img
                  src={article.photo || article.photoUrl}
                  alt={article.title}
                  className="article-cover"
                />
              ) : null}
              <div className="story-header">
                <div>
                  <div className="story-title">
                    <Link to={`/articles/${article.id}`}>{article.title}</Link>
                  </div>
                  <div className="muted small">{formatDateTime(article.createdAt)}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {article.author?.displayName && <div className="pill pill-soft">{article.author.displayName}</div>}
                </div>
              </div>
              {article.subtitle && <p className="article-subtitle">{article.subtitle}</p>}
              <p>{article.content.substring(0, 300)}{article.content.length > 300 ? "..." : ""}</p>
              <Link to={`/articles/${article.id}`} style={{ color: "#0066cc", textDecoration: "none" }}>
                Διαβάστε περισσότερα →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
