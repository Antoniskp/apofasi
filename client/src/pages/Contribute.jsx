import { Link } from "react-router-dom";

const contributionAreas = [
  {
    title: "Αρθρογραφία & Επιμέλεια",
    description:
      "Συνεργαστείτε στη σύνταξη, επαλήθευση και ομαδοποίηση ειδήσεων ώστε οι αναγνώστες να βλέπουν καθαρή, αντικειμενική πληροφόρηση.",
    badge: "Editorial"
  },
  {
    title: "Τεχνική Υποστήριξη",
    description:
      "Βοηθήστε με ανάπτυξη front-end, back-end ή data pipelines για να βελτιώσουμε την ταχύτητα, την ασφάλεια και την ακρίβεια των δεδομένων.",
    badge: "Engineering"
  },
  {
    title: "Κοινότητα & Συνεργασίες",
    description:
      "Δημιουργήστε συνεργασίες με ΜΚΟ, πανεπιστήμια και μέσα. Αναπτύξτε καμπάνιες συμμετοχής και ανοικτά events.",
    badge: "Community"
  }
];

const waysToSupport = [
  {
    title: "Αναφορά λαθών",
    detail: "Εντοπίσατε ανακρίβεια ή σφάλμα; Ανοίξτε issue στο GitHub ή στείλτε μήνυμα για άμεση διόρθωση.",
    action: {
      label: "Άνοιγμα issue",
      href: "https://github.com/Antoniskp/apofasi/issues",
      external: true
    }
  },
  {
    title: "Συνεισφορά κώδικα",
    detail: "Υλοποιήστε βελτιώσεις στην προσβασιμότητα, το UI, ή το API. Τα pull requests με καθαρό documentation είναι ευπρόσδεκτα.",
    action: {
      label: "Οδηγίες GitHub",
      href: "https://github.com/Antoniskp/apofasi",
      external: true
    }
  },
  {
    title: "Μοιραστείτε γνώση",
    detail: "Προτείνετε πηγές δεδομένων, μηχανισμούς εντοπισμού παραπληροφόρησης ή εργαλεία αυτοματοποίησης για την ομάδα.",
    action: {
      label: "Στείλτε ιδέα",
      href: "mailto:team@apofasi.news",
      external: true
    }
  }
];

export default function Contribute() {
  return (
    <div className="contribute-page">
      <section className="contribute-hero">
        <div className="contribute-hero-inner">
          <p className="hero-kicker">Συνεργασία με νόημα</p>
          <h1>Συνεισφέρετε στο Apofasi και βοηθήστε να εξελίξουμε την ενημέρωση στην Ελλάδα.</h1>
          <p className="hero-sub narrow">
            Αναζητούμε ανθρώπους που πιστεύουν στη διαφάνεια και την ποιότητα της ενημέρωσης. Μαζί μπορούμε να
            προσφέρουμε ένα καθαρότερο περιβάλλον ειδήσεων και μια πιο συμμετοχική δημόσια συζήτηση.
          </p>
          <div className="hero-buttons">
            <a className="btn" href="mailto:team@apofasi.news">
              Επικοινωνία με την ομάδα
            </a>
            <Link to="/mission" className="btn btn-outline">
              Δείτε το όραμα
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Πού μπορείτε να βοηθήσετε</h2>
        <div className="grid-3">
          {contributionAreas.map((area) => (
            <div key={area.title} className="card contribute-card">
              <div className="pill subtle">{area.badge}</div>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Τι χρειάζεται η πλατφόρμα</h2>
        <div className="grid-2">
          <div className="card highlight">
            <h3>Αυτοματισμοί δεδομένων</h3>
            <p>
              Θέλουμε να βελτιώσουμε τη συλλογή και ομαδοποίηση ειδήσεων με pipelines που σέβονται τις πηγές και τις
              άδειές τους. Αν έχετε εμπειρία σε RSS, scraping ή ML clustering, ελάτε να το εξελίξουμε μαζί.
            </p>
          </div>
          <div className="card highlight">
            <h3>Εμπειρία χρήστη</h3>
            <p>
              Προτεραιότητα στην προσβασιμότητα, καθαρά visuals και γρήγορη απόκριση. Προτείνετε UI βελτιώσεις ή
              βοηθήστε στα usability tests για να γίνει η πλατφόρμα ακόμη πιο φιλική.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Βήματα συμμετοχής</h2>
        <div className="grid-3">
          {waysToSupport.map((item) => (
            <div key={item.title} className="card contribute-action">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <div className="cta-row">
                <a
                  className="btn btn-outline"
                  href={item.action.href}
                  target={item.action.external ? "_blank" : undefined}
                  rel={item.action.external ? "noreferrer" : undefined}
                >
                  {item.action.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
