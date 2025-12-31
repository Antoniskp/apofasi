import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Επικοινωνία",
    description: "Μιλήστε με την ομάδα για συνεργασίες, προτάσεις ή βοήθεια.",
    links: [
      { label: "Φόρμα επικοινωνίας", to: "/contact#contact-form" },
      { label: "Υποστήριξη", to: "/contact#support" }
    ]
  },
  {
    title: "Σχετικά",
    description: "Μάθετε περισσότερα για την αποστολή και τον τρόπο δουλειάς μας.",
    links: [
      { label: "Αποστολή", to: "/mission" },
      { label: "Η ιστορία μας", to: "/about" }
    ]
  },
  {
    title: "Πόροι",
    description:
      "Κατανοήστε τη διαδικασία μας και βρείτε τρόπους να βοηθήσετε την κοινότητα.",
    links: [
      { label: "Πώς δουλεύουμε", to: "/how-we-do-it" },
      { label: "Συνεισφέρετε", to: "/contribute" }
    ]
  },
  {
    title: "Social",
    description: "Ακολουθήστε τα κανάλια ενημέρωσης και τις κοινότητές μας.",
    links: [
      { label: "Newsletter", to: "/social" },
      { label: "Discord", href: "https://discord.gg/pvJftR4T98" }
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
              <h3>{section.title}</h3>
              <p className="muted">{section.description}</p>
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
        <span>Χτισμένο με ανοιχτό κώδικα και φροντίδα.</span>
      </div>
    </footer>
  );
}
