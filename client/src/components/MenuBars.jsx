import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuthStatus, logoutUser } from "../lib/api.js";

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
  const [authStatus, setAuthStatus] = useState({ loading: true, user: null });
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  const loadAuthStatus = async () => {
    try {
      const data = await getAuthStatus();
      setAuthStatus({ loading: false, user: data.user });
    } catch (error) {
      setAuthStatus({ loading: false, user: null });
    }
  };

  useEffect(() => {
    loadAuthStatus();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (isOpen) {
        setIsMenuHidden(false);
        lastScrollY = window.scrollY;
        return;
      }

      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollY;
      const pastThreshold = currentY > 80;
      const shouldHide = isScrollingDown && pastThreshold;

      setIsMenuHidden((prev) => (prev === shouldHide ? prev : shouldHide));

      lastScrollY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsMenuHidden(false);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await logoutUser();
    await loadAuthStatus();
    closeMenu();
  };

  const isAuthenticated = Boolean(authStatus.user);
  const isAdmin = authStatus.user?.role === "admin";
  const userName =
    authStatus.user?.displayName ||
    authStatus.user?.firstName ||
    authStatus.user?.email ||
    "Χρήστης";
  const userRole = authStatus.user?.role
    ? authStatus.user.role === "admin"
      ? "Διαχειριστής"
      : "Μέλος"
    : null;

  return (
    <div className={`menu-shell${isMenuHidden ? " menu-hidden" : ""}`}>
      <div className="menu-top">
        <div className="menu-top-inner">
          <div className="menu-primary">
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

            <nav
              className={`menu-links ${isOpen ? "open" : ""}`}
              aria-label="Top navigation"
            >
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
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      className="menu-auth-btn primary"
                      aria-label="Αποσύνδεση"
                      onClick={handleLogout}
                    >
                      <span className="menu-auth-icon" aria-hidden>
                        <i className="fa-solid fa-right-from-bracket" />
                      </span>
                      <span className="sr-only">Αποσύνδεση</span>
                    </button>
                    {isAdmin && (
                      <Link
                        to="/admin/users"
                        className="menu-auth-btn"
                        aria-label="Διαχείριση χρηστών"
                        onClick={closeMenu}
                      >
                        <span className="menu-auth-icon" aria-hidden>
                          <i className="fa-solid fa-user-shield" />
                        </span>
                        <span className="sr-only">Διαχείριση χρηστών</span>
                      </Link>
                    )}
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </nav>
          </div>

          <div className="menu-actions menu-actions-desktop">
            {isAuthenticated ? (
              <>
                <div className="menu-auth-summary" aria-label="Πληροφορίες χρήστη">
                  <div className="menu-auth-hello">
                    Hello,
                    <span className="menu-auth-name">{` ${userName}`}</span>
                  </div>
                  {userRole && <div className="menu-auth-role">{userRole}</div>}
                </div>
                <button
                  type="button"
                  className="menu-auth-btn primary"
                  aria-label="Αποσύνδεση"
                  onClick={handleLogout}
                >
                  <span className="menu-auth-icon" aria-hidden>
                    <i className="fa-solid fa-right-from-bracket" />
                  </span>
                  <span className="sr-only">Αποσύνδεση</span>
                </button>
                {isAdmin && (
                  <Link
                    to="/admin/users"
                    className="menu-auth-btn"
                    aria-label="Διαχείριση χρηστών"
                    onClick={closeMenu}
                  >
                    <span className="menu-auth-icon" aria-hidden>
                      <i className="fa-solid fa-user-shield" />
                    </span>
                    <span className="sr-only">Διαχείριση χρηστών</span>
                  </Link>
                )}
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
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="menu-brand">
            <span className="brand-mark" aria-hidden>
              <i className="fa-solid fa-scale-balanced" />
            </span>
            <Link to="/" className="brand-wordmark">
              Apofasi
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
