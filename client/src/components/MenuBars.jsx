import { Link } from "react-router-dom";
import { useState } from "react";

const topMenu = [
  { label: "Αρχική", to: "/" },
  { label: "Τι επιδιώκουμε", to: "/mission" },
  { label: "Ειδήσεις", to: "/news" },
  { label: "Ψηφοφορίες", to: "/polls" },
  { label: "LIVE", to: "/news" },
  { label: "Podcasts", to: "/news" }
];

const bottomMenu = [
  "Πολιτική",
  "Οικονομία",
  "Κοινωνία",
  "Κόσμος",
  "Αθλητικά",
  "Lifestyle",
  "Auto/Moto",
  "Science",
  "Opinions"
];

export default function MenuBars() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="menu-shell">
      <div className="menu-top">
        <div className="menu-brand">
          <span className="brand-mark">ap</span>
          <Link to="/" className="brand-wordmark">
            Apofasi
          </Link>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Εναλλαγή μενού"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          ☰
        </button>

        <nav className={`menu-links ${isOpen ? "open" : ""}`} aria-label="Top navigation">
          {topMenu.map((item) => (
            <Link key={item.label} to={item.to} className="menu-link" onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="menu-right">
          <div className="menu-actions">
            <Link to="/auth" className="menu-auth-btn primary" onClick={closeMenu}>
              Σύνδεση
            </Link>
            <Link to="/auth" className="menu-auth-btn" onClick={closeMenu}>
              Εγγραφή
            </Link>
          </div>

          <div className="menu-meta">
            <span className="menu-badge">Beta</span>
            <span className="menu-clock">24/7 ενημέρωση</span>
          </div>
        </div>
      </div>

      <div className="menu-bottom" aria-label="Categories">
        {bottomMenu.map((item) => (
          <span key={item} className="menu-pill">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
