import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthStatus, logoutUser } from "../lib/api.js";

const footerSections = [
  {
    title: "Επικοινωνία",
    titleLink: "/contact",
    links: [
      
      { label: "Συνεργασίες", to: "/contact#collaboration" },
      { label: "Discord", href: "https://discord.gg/pvJftR4T98" }
    ]
  },
  {
    title: "Σχετικά",
    titleLink: "/about",
    links: [
      { label: "Αποστολή", to: "/mission" },
      { label: "Πώς δουλεύουμε", to: "/how-we-do-it" },
      { label: "Η ιστορία μας", to: "/about" },
      { label: "Συνεισφέρετε", to: "/contribute" },
      { label: "Bounties", to: "/bounties" }
    ]
  },
  {
    title: "Τεκμηρίωση",
    titleLink: "/documentation",
    links: [
      { label: "Οδηγός ενημέρωσης", to: "/documentation" },
      { label: "Χάρτης σελίδων", to: "/documentation#sitemap" },
      { label: "DB schema", to: "/documentation#db-schema" },
      { label: "Πού αλλάζουν τα κείμενα", to: "/documentation#content-updates" }
    ]
  },
  {
    title: "Κοινότητα",
    titleLink: "/social",
    links: [
      { label: "Κοινωνικά δίκτυα", to: "/social" },
      { label: "Κανόνες κοινότητας", to: "/community-guidelines" },
      { label: "Συμμετοχή στην ανάπτυξη", to: "/contribute" },
      { label: "Προφίλ χρήστη", to: "/profile" },
      { label: "Σύνδεση", to: "/auth" },
      { label: "Εγγραφή με email", to: "/register" }
    ]
  }
];

export default function Footer() {
  const [authStatus, setAuthStatus] = useState({ loading: true, user: null });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      await loadAuthStatus();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <footer className="footer" aria-label="Footer menu">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-mark" aria-hidden>
            ap
          </div>
          <div>
            <p className="eyebrow">Apofasi</p>
            <h2>Καλύτερες αποφάσεις, μαζί.</h2>
            <p className="muted">
              Ειδήσεις, ψηφοφορίες και εργαλεία για να χτίσουμε μια ενημερωμένη κοινότητα.
            </p>
          </div>
        </div>

        <div className="footer-highlight" aria-label="Platform status">
          <div className="footer-badge">Beta</div>
          <div>
            <p className="eyebrow">24/7 ενημέρωση</p>
            <p className="muted">
              Η πλατφόρμα βρίσκεται σε beta λειτουργία με συνεχή ανανεώσεις περιεχομένου.
            </p>
          </div>
        </div>

        <div className="footer-grid">
          {footerSections.map((section) => (
            <div key={section.title} className="footer-card">
              {section.titleLink ? (
                <Link to={section.titleLink} className="footer-link heading-link">
                  <h3>{section.title}</h3>
                </Link>
              ) : (
                <h3>{section.title}</h3>
              )}
              <div className="footer-links">
                {section.links.map((link) =>
                  link.href ? (
                    <a
                      key={link.label}
                      className="footer-link"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.label} to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Apofasi</span>
        <div className="footer-bottom-right">
          <span>Χτισμένο με ανοιχτό κώδικα και φροντίδα.</span>
          {authStatus.user && (
            <button
              type="button"
              className="btn btn-outline footer-logout"
              onClick={handleLogout}
              disabled={authStatus.loading || isLoggingOut}
            >
              {isLoggingOut ? "Αποσύνδεση..." : "Αποσύνδεση"}
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
