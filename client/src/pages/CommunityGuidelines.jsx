const communityGuidelinesContent = {
  hero: {
    eyebrow: "Κοινότητα",
    title: "Κανόνες Κοινότητας",
    subtitle:
      "Οι κατευθυντήριες γραμμές μας για μια υγιή, εποικοδομητική και σεβαστική κοινότητα."
  },
  rules: {
    title: "Κανόνες",
    description: "Αυτά είναι τα πράγματα που δεν επιτρέπονται στην πλατφόρμα:",
    items: [
      "Απειλές βίας ή εκφοβισμός άλλων χρηστών",
      "Hate speech ή διακρίσεις βάσει φύλου, φυλής, θρησκείας ή άλλων χαρακτηριστικών",
      "Spam ή επαναλαμβανόμενο περιεχόμενο χωρίς αξία",
      "Παράνομο περιεχόμενο ή παραβίαση πνευματικών δικαιωμάτων",
      "Παραπλανητικές πληροφορίες ή σκόπιμη παραπληροφόρηση",
      "Προσβλητική γλώσσα ή προσωπικές επιθέσεις",
      "Χειραγώγηση ψηφοφοριών ή απάτη",
      "Κοινή χρήση προσωπικών δεδομένων άλλων χωρίς συγκατάθεση"
    ]
  },
  encouraged: {
    title: "Τι ενθαρρύνουμε",
    description: "Θέλουμε να βλέπουμε τις ακόλουθες συμπεριφορές στην κοινότητά μας:",
    items: [
      "Σεβασμό και ευγένεια σε όλες τις αλληλεπιδράσεις",
      "Εποικοδομητική κριτική και διάλογο βασισμένο σε δεδομένα",
      "Διαφάνεια όταν μοιράζεστε πηγές ή πληροφορίες",
      "Ανοιχτό μυαλό και προθυμία να ακούσετε διαφορετικές απόψεις",
      "Υπεύθυνη συμμετοχή σε ψηφοφορίες και συζητήσεις",
      "Καλοπροαίρετες συνεισφορές που βοηθούν την κοινότητα",
      "Αναφορά προβληματικού περιεχομένου όταν το εντοπίζετε",
      "Συνεργασία για την επίλυση διαφωνιών"
    ]
  }
};

export default function CommunityGuidelines() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">{communityGuidelinesContent.hero.eyebrow}</p>
          <h1>{communityGuidelinesContent.hero.title}</h1>
          <p className="muted">{communityGuidelinesContent.hero.subtitle}</p>
        </div>
      </header>

      <section className="section">
        <div className="card">
          <h2>{communityGuidelinesContent.rules.title}</h2>
          <p className="muted">{communityGuidelinesContent.rules.description}</p>
          <ul className="list">
            {communityGuidelinesContent.rules.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <h2>{communityGuidelinesContent.encouraged.title}</h2>
          <p className="muted">{communityGuidelinesContent.encouraged.description}</p>
          <ul className="list">
            {communityGuidelinesContent.encouraged.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
