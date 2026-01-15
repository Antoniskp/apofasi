import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext.jsx";
import UserMenu from "./UserMenu.jsx";

const topMenu = [
  { label: "Ειδήσεις", to: "/news", icon: "fa-newspaper" },
  { label: "Άρθρα", to: "/articles", icon: "fa-file-lines" },
  { label: "Ψηφοφορίες", to: "/polls", icon: "fa-square-poll-vertical" },
  {
    label: "Εκπαίδευση",
    to: "/education",
    icon: "fa-graduation-cap",
    subItems: [
      { label: "Οικονομία", to: "/education/economics" },
      { label: "Κρατικές εφαρμογές", to: "/education/government-apps" },
      { label: "Στατιστικά Δημοσίου", to: "/education/government-statistics" },
      { label: "Ελληνικό νομικό σύστημα", to: "/education/greek-law-system" }
    ]
  },
  { label: "Χρήστες", to: "/users", icon: "fa-users", requireAuth: true }
];

export default function MenuBars() {
  const [isOpen, setIsOpen] = useState(false);
  const { user: authUser } = useAuth();
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();

  const closeMenu = () => {
    setIsOpen(false);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const generateSubmenuId = (label) => {
    // Sanitize label by removing special characters and normalizing spaces
    return `submenu-${label.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
  };

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
            {topMenu
              .filter((item) => !item.requireAuth || authUser)
              .map((item) =>
                item.subItems ? (
                  <div key={item.label} className="menu-link-group">
                    <div className="menu-link-with-toggle">
                      <Link
                        to={item.to}
                        className={`menu-link${location.pathname === item.to ? " active" : ""}`}
                        onClick={closeMenu}
                      >
                        <i className={`fa-solid ${item.icon} menu-link-icon`} aria-hidden />
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        className="menu-submenu-toggle"
                        aria-label={`Toggle ${item.label} submenu`}
                        aria-expanded={openSubmenu === item.label}
                        aria-controls={generateSubmenuId(item.label)}
                        onClick={() => toggleSubmenu(item.label)}
                      >
                        <i className={`fa-solid fa-chevron-${openSubmenu === item.label ? 'up' : 'down'}`} aria-hidden />
                      </button>
                    </div>
                    <div 
                      id={generateSubmenuId(item.label)}
                      className={`menu-submenu${openSubmenu === item.label ? ' open' : ''}`}
                    >
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
              <UserMenu user={authUser} />
            </div>
          </nav>

          <div className="menu-actions menu-actions-desktop">
            <UserMenu user={authUser} />
          </div>
        </div>
      </div>

    </div>
  );
}
