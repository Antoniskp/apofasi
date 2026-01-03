import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Επικοινωνία",
    description:
      "Μιλήστε με την ομάδα, ακολουθήστε τα κανάλια μας ή ζητήστε υποστήριξη.",
    links: [
      { label: "Φόρμα επικοινωνίας", to: "/contact#contact-form" },
      { label: "Υποστήριξη", to: "/contact#support" },
      { label: "Newsletter", to: "/social" },
      { label: "Discord", href: "https://discord.gg/pvJftR4T98" }
    ]
  },
  {
    title: "Σχετικά",
    description:
      "Μάθετε περισσότερα για την αποστολή μας και βρείτε χρήσιμους πόρους.",
    links: [
      { label: "Αποστολή", to: "/mission" },
      { label: "Η ιστορία μας", to: "/about" },
      { label: "Πώς δουλεύουμε", to: "/how-we-do-it" },
      { label: "Συνεισφέρετε", to: "/contribute" }
    ]
  },
  {
    title: "Ειδήσεις",
    description: "Γρήγορη πρόσβαση στα κορυφαία και θεματικά νέα.",
    links: [
      { label: "Top 10 ειδήσεις", to: "/news/top-10" },
      { label: "Θεματικές ενότητες", to: "/news/categories" },
      { label: "Επιλεγμένα άρθρα", to: "/news/featured" }
    ]
  },
  {
    title: "Εκπαίδευση",
    description: "Υλικό μάθησης με κορυφαίες επιλογές και υποκατηγορίες.",
    links: [
      { label: "Top 10 οδηγίες", to: "/education/top-10" },
      { label: "Υποκατηγορίες", to: "/education/categories" },
      { label: "Προτεινόμενα μαθήματα", to: "/education/featured" }
    ]
  },
  {
    title: "Ψηφοφορίες",
    description: "Βρείτε τις πιο δημοφιλείς και θεματικές ψηφοφορίες.",
    links: [
      { label: "Top 10 ψηφοφορίες", to: "/polls/top-10" },
      { label: "Κατηγορίες", to: "/polls/categories" },
      { label: "Επιλεγμένες", to: "/polls/featured" }
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
