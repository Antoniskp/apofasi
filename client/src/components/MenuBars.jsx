import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const topMenu = [
  { label: "Αρχική", to: "/", icon: "fa-house" },
  { label: "Τι επιδιώκουμε", to: "/mission", icon: "fa-bullseye" },
  { label: "Πώς δουλεύουμε", to: "/how-we-do-it", icon: "fa-diagram-project" },
  { label: "Συνεισφέρετε", to: "/contribute", icon: "fa-handshake-simple" },
  { label: "Επικοινωνία", to: "/contact", icon: "fa-envelope-open-text" }
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
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="menu-shell">
      <div className="menu-top">
        <div className="menu-top-inner">
          <div className="menu-left">
            <div className="menu-brand">
              <span className="brand-mark" aria-hidden>
                <i className="fa-solid fa-scale-balanced" />
              </span>
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
              <i
                className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}
                aria-hidden
              />
            </button>
          </div>

          <nav className={`menu-links ${isOpen ? "open" : ""}`} aria-label="Top navigation">
            {topMenu.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`menu-link${location.pathname === item.to ? " active" : ""}`}
                onClick={closeMenu}
              >
                <i className={`fa-solid ${item.icon} menu-link-icon`} aria-hidden />
                {item.label}
              </Link>
            ))}

            <div className="menu-actions menu-actions-mobile">
              <Link
                to="/auth"
                className="menu-auth-btn primary"
                aria-label="Σύνδεση"
                onClick={closeMenu}
              >
                <span className="menu-auth-icon" aria-hidden>
                  <i className="fa-solid fa-right-to-bracket" />
                </span>
                <span className="sr-only">Σύνδεση</span>
              </Link>
              <Link
                to="/register"
                className="menu-auth-btn"
                aria-label="Εγγραφή"
                onClick={closeMenu}
              >
                <span className="menu-auth-icon" aria-hidden>
                  <i className="fa-solid fa-user-plus" />
                </span>
                <span className="sr-only">Εγγραφή</span>
              </Link>
              <Link
                to="/profile"
                className="menu-auth-btn"
                aria-label="Προφίλ"
                onClick={closeMenu}
              >
                <span className="menu-auth-icon" aria-hidden>
                  <i className="fa-solid fa-circle-user" />
                </span>
                <span className="sr-only">Προφίλ</span>
              </Link>
            </div>
          </nav>

          <div className="menu-actions menu-actions-desktop">
            <Link
              to="/auth"
              className="menu-auth-btn primary"
              aria-label="Σύνδεση"
              onClick={closeMenu}
            >
              <span className="menu-auth-icon" aria-hidden>
                <i className="fa-solid fa-right-to-bracket" />
              </span>
              <span className="sr-only">Σύνδεση</span>
            </Link>
            <Link
              to="/register"
              className="menu-auth-btn"
              aria-label="Εγγραφή"
              onClick={closeMenu}
            >
              <span className="menu-auth-icon" aria-hidden>
                <i className="fa-solid fa-user-plus" />
              </span>
              <span className="sr-only">Εγγραφή</span>
            </Link>
            <Link
              to="/profile"
              className="menu-auth-btn"
              aria-label="Προφίλ"
              onClick={closeMenu}
            >
              <span className="menu-auth-icon" aria-hidden>
                <i className="fa-solid fa-circle-user" />
              </span>
              <span className="sr-only">Προφίλ</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="menu-bottom" aria-label="Categories">
        <div className="menu-bottom-inner">
          <div className="menu-bottom-list">
            {bottomMenu.map((item) => (
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`menu-pill${location.pathname === item.to ? " active" : ""}`}
                  onClick={closeMenu}
                >
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
