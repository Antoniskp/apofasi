import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Επικοινωνία",
    description: "Μιλήστε με την ομάδα για συνεργασίες, προτάσεις ή βοήθεια.",
    links: [
      { label: "Φόρμα επικοινωνίας", to: "/contact" },
      { label: "Υποστήριξη", to: "/contact" }
    ]
  },
  {
    title: "Σχετικά",
    description: "Μάθετε περισσότερα για την αποστολή και τον τρόπο δουλειάς μας.",
    links: [
      { label: "Η ιστορία μας", to: "/about" },
      { label: "Διαφάνεια", to: "/about" }
    ]
  },
  {
    title: "Social",
    description: "Ακολουθήστε τα κανάλια ενημέρωσης και τις κοινότητές μας.",
    links: [
      { label: "Newsletter", to: "/social" },
      { label: "Community chat", to: "/social" }
    ]
  },
  {
    title: "Προτάσεις",
    description: "Συγκεντρωμένες επιλογές για γρήγορη ενημέρωση.",
    links: [
      { label: "Επιμελημένες προτάσεις", to: "/recommendations" },
      { label: "Top choices", to: "/top-choices" }
    ]
  }
];

export default function Footer() {
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

        <div className="footer-grid">
          {footerSections.map((section) => (
            <div key={section.title} className="footer-card">
              <h3>{section.title}</h3>
              <p className="muted">{section.description}</p>
              <div className="footer-links">
                {section.links.map((link) => (
                  <Link key={link.label} to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Apofasi</span>
        <span>Χτισμένο με ανοιχτό κώδικα και φροντίδα.</span>
      </div>
    </footer>
  );
}
