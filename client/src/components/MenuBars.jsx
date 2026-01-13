import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuthStatus } from "../lib/api.js";
import UserMenu from "./UserMenu.jsx";

const pollRegions = [
  { label: "Ανατολική Μακεδονία και Θράκη" },
  { label: "Κεντρική Μακεδονία" },
  { label: "Δυτική Μακεδονία" },
  { label: "Ήπειρος" },
  { label: "Θεσσαλία" },
  { label: "Ιόνια Νησιά" },
  { label: "Δυτική Ελλάδα" },
  { label: "Στερεά Ελλάδα" },
  { label: "Αττική" },
  { label: "Πελοπόννησος" },
  { label: "Βόρειο Αιγαίο" },
  { label: "Νότιο Αιγαίο" },
  { label: "Κρήτη" }
];

const topMenu = [
  { label: "Ειδήσεις", to: "/news", icon: "fa-newspaper" },
  {
    label: "Ψηφοφορίες",
    to: "/polls",
    icon: "fa-square-poll-vertical",
    subItems: pollRegions
  },
  {
    label: "Εκπαίδευση",
    to: "/education",
    icon: "fa-graduation-cap",
    subItems: [
      { label: "Κρατικές εφαρμογές", to: "/education/government-apps" },
      { label: "Στατιστικά Δημοσίου", to: "/education/government-statistics" },
      { label: "Ελληνικό νομικό σύστημα", to: "/education/greek-law-system" }
    ]
  }
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

  return (
    <div className={`menu-shell${isMenuHidden ? " menu-hidden" : ""}`}>
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
            {topMenu.map((item) =>
              item.subItems ? (
                <div key={item.label} className="menu-link-group">
                  <Link
                    to={item.to}
                    className={`menu-link${location.pathname === item.to ? " active" : ""}`}
                    onClick={closeMenu}
                  >
                    <i className={`fa-solid ${item.icon} menu-link-icon`} aria-hidden />
                    {item.label}
                  </Link>
                  <div className="menu-submenu" aria-label={`${item.label} submenu`}>
                    {item.subItems.map((subItem) =>
                      subItem.to ? (
                        <Link
                          key={subItem.label}
                          to={subItem.to}
                          className={`menu-subitem${location.pathname === subItem.to ? " active" : ""}`}
                          onClick={closeMenu}
                        >
                          {subItem.label}
                        </Link>
                      ) : (
                        <span key={subItem.label} className="menu-subitem">
                          {subItem.label}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`menu-link${location.pathname === item.to ? " active" : ""}`}
                  onClick={closeMenu}
                >
                  <i className={`fa-solid ${item.icon} menu-link-icon`} aria-hidden />
                  {item.label}
                </Link>
              )
            )}

            <div className="menu-actions menu-actions-mobile">
              <UserMenu user={authStatus.user} onLogout={loadAuthStatus} />
            </div>
          </nav>

          <div className="menu-actions menu-actions-desktop">
            <UserMenu user={authStatus.user} onLogout={loadAuthStatus} />
          </div>
        </div>
      </div>

    </div>
  );
}
