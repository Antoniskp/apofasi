import { Link } from "react-router-dom";

const contributeContent = {
  hero: {
    kicker: "Συνεργασία με νόημα",
    title: "Συνεισφέρετε στο Apofasi και βοηθήστε να εξελίξουμε την ενημέρωση στην Ελλάδα.",
    subtitle:
      "Αναζητούμε ανθρώπους που πιστεύουν στη διαφάνεια και την ποιότητα της ενημέρωσης. Μαζί μπορούμε να προσφέρουμε ένα καθαρότερο περιβάλλον ειδήσεων και μια πιο συμμετοχική δημόσια συζήτηση.",
    primaryCta: { label: "Επικοινωνία στο Discord", href: "https://discord.gg/pvJftR4T98" },
    secondaryCta: { label: "Δείτε το όραμα", href: "/mission" }
  },
  areas: [
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
  ],
  funding: [
    {
      title: "Ενίσχυση με χρήματα ή crypto",
      detail:
        "Υποστηρίξτε την ανεξάρτητη λειτουργία της πλατφόρμας με οικονομική συνεισφορά σε ευρώ ή crypto. Θα σας καθοδηγήσουμε στα διαθέσιμα κανάλια ώστε η ενίσχυση να ολοκληρωθεί με ασφάλεια και διαφάνεια.",
      cta: { label: "Ζητήστε οδηγίες στο Discord", href: "https://discord.gg/pvJftR4T98" }
    },
    {
      title: "Χρηματοδότηση λειτουργιών",
      detail:
        "Θέλετε να χρηματοδοτήσετε μια συγκεκριμένη δυνατότητα ή κάλυψη θεματικής ενότητας; Μιλήστε μαζί μας για να ορίσουμε το αποτέλεσμα, το χρονοδιάγραμμα και τη χρήση των πόρων, ώστε η προσφορά σας να φέρει το μέγιστο αντίκτυπο.",
      cta: { label: "Καθορισμός έργου στο Discord", href: "https://discord.gg/pvJftR4T98" }
    }
  ],
  needs: [
    {
      title: "Αυτοματισμοί δεδομένων",
      detail:
        "Θέλουμε να βελτιώσουμε τη συλλογή και ομαδοποίηση ειδήσεων με pipelines που σέβονται τις πηγές και τις άδειές τους. Αν έχετε εμπειρία σε RSS, scraping ή ML clustering, ελάτε να το εξελίξουμε μαζί."
    },
    {
      title: "Εμπειρία χρήστη",
      detail:
        "Προτεραιότητα στην προσβασιμότητα, καθαρά visuals και γρήγορη απόκριση. Προτείνετε UI βελτιώσεις ή βοηθήστε στα usability tests για να γίνει η πλατφόρμα ακόμη πιο φιλική."
    }
  ],
  actions: [
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
      title: "Οικονομική υποστήριξη",
      detail:
        "Θέλετε να ενισχύσετε την ομάδα με χρήματα ή crypto; Μπορούμε να προχωρήσουμε με δωρεά ή να σχεδιάσουμε μαζί ένα sponsorship για τη λειτουργία της πλατφόρμας.",
      action: {
        label: "Συνεννόηση στο Discord",
        href: "https://discord.gg/pvJftR4T98",
        external: true
      }
    },
    {
      title: "Συνεισφορά κώδικα",
      detail:
        "Υλοποιήστε βελτιώσεις στην προσβασιμότητα, το UI, ή το API. Τα pull requests με καθαρό documentation είναι ευπρόσδεκτα.",
      action: {
        label: "Οδηγίες GitHub",
        href: "https://github.com/Antoniskp/apofasi",
        external: true
      }
    },
    {
      title: "Μοιραστείτε γνώση",
      detail:
        "Προτείνετε πηγές δεδομένων, μηχανισμούς εντοπισμού παραπληροφόρησης ή εργαλεία αυτοματοποίησης για την ομάδα.",
      action: {
        label: "Στείλτε ιδέα στο Discord",
        href: "https://discord.gg/pvJftR4T98",
        external: true
      }
    }
  ]
};

export default function Contribute() {
  return (
    <div className="contribute-page">
      <section className="contribute-hero">
        <div className="contribute-hero-inner">
          <p className="hero-kicker">{contributeContent.hero.kicker}</p>
          <h1>{contributeContent.hero.title}</h1>
          <p className="hero-sub narrow">{contributeContent.hero.subtitle}</p>
          <div className="hero-buttons">
            <a className="btn" href={contributeContent.hero.primaryCta.href} target="_blank" rel="noreferrer">
              {contributeContent.hero.primaryCta.label}
            </a>
            <Link to={contributeContent.hero.secondaryCta.href} className="btn btn-outline">
              {contributeContent.hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Πού μπορείτε να βοηθήσετε</h2>
        <div className="grid-3">
          {contributeContent.areas.map((area) => (
            <div key={area.title} className="card contribute-card">
              <div className="pill subtle">{area.badge}</div>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Οικονομική συμβολή</h2>
        <div className="grid-2">
          {contributeContent.funding.map((item) => (
            <div key={item.title} className="card highlight">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <div className="cta-row">
                <a className="btn btn-outline" href={item.cta.href} target="_blank" rel="noreferrer">
                  {item.cta.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Τι χρειάζεται η πλατφόρμα</h2>
        <div className="grid-2">
          {contributeContent.needs.map((need) => (
            <div key={need.title} className="card highlight">
              <h3>{need.title}</h3>
              <p>{need.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Βήματα συμμετοχής</h2>
        <div className="grid-3">
          {contributeContent.actions.map((item) => (
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
