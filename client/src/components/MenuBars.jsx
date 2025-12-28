import { Link } from "react-router-dom";
import { useState } from "react";

const topMenu = [
  { label: "Αρχική", to: "/" },
  { label: "Τι επιδιώκουμε", to: "/mission" },
  { label: "Πώς δουλεύουμε", to: "/how-we-do-it" },
  { label: "Συνεισφέρετε", to: "/contribute" },
  { label: "Επικοινωνία", to: "/contact" }
];

const bottomMenu = [
  { label: "Ειδήσεις", to: "/news" },
  { label: "Ψηφοφορίες", to: "/polls" },
  { label: "LIVE", to: "/news" },
  { label: "Πολιτική" },
  { label: "Οικονομία" },
  { label: "Κοινωνία" },
  { label: "Κόσμος" },
  { label: "Αθλητικά" },
  { label: "Lifestyle" },
  { label: "Auto/Moto" },
  { label: "Science" },
  { label: "Opinions" }
];

export default function MenuBars() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="menu-shell">
      <div className="menu-top">
        <div className="menu-top-inner">
          <div className="menu-left">
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
          </div>

          <nav className={`menu-links ${isOpen ? "open" : ""}`} aria-label="Top navigation">
            {topMenu.map((item) => (
              <Link key={item.label} to={item.to} className="menu-link" onClick={closeMenu}>
                {item.label}
              </Link>
            ))}

            <div className="menu-actions menu-actions-mobile">
              <Link to="/auth" className="menu-auth-btn primary" onClick={closeMenu}>
                <span className="menu-auth-icon" aria-hidden>
                  🔐
                </span>
                <span>Σύνδεση</span>
              </Link>
              <Link to="/register" className="menu-auth-btn" onClick={closeMenu}>
                <span className="menu-auth-icon" aria-hidden>
                  ✏️
                </span>
                <span>Εγγραφή</span>
              </Link>
              <Link to="/profile" className="menu-auth-btn" onClick={closeMenu}>
                <span className="menu-auth-icon" aria-hidden>
                  👤
                </span>
                <span>Προφίλ</span>
              </Link>
            </div>
          </nav>

          <div className="menu-actions menu-actions-desktop">
            <Link to="/auth" className="menu-auth-btn primary" onClick={closeMenu}>
              <span className="menu-auth-icon" aria-hidden>
                🔐
              </span>
              <span>Σύνδεση</span>
            </Link>
            <Link to="/register" className="menu-auth-btn" onClick={closeMenu}>
              <span className="menu-auth-icon" aria-hidden>
                ✏️
              </span>
              <span>Εγγραφή</span>
            </Link>
            <Link to="/profile" className="menu-auth-btn" onClick={closeMenu}>
              <span className="menu-auth-icon" aria-hidden>
                👤
              </span>
              <span>Προφίλ</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="menu-bottom" aria-label="Categories">
        <div className="menu-bottom-inner">
          <div className="menu-bottom-list">
            {bottomMenu.map((item) => (
              item.to ? (
                <Link key={item.label} to={item.to} className="menu-pill" onClick={closeMenu}>
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className="menu-pill">
                  {item.label}
                </span>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
