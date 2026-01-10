const governmentAppsContent = {
  hero: {
    eyebrow: "Κρατικές εφαρμογές",
    title: "Οδηγός για τις βασικές ψηφιακές υπηρεσίες του κράτους",
    subtitle:
      "Από το Taxisnet και την ΑΑΔΕ μέχρι το Κτηματολόγιο και το gov.gr, οι ψηφιακές πλατφόρμες διευκολύνουν τη σχέση μας με το κράτος. Εδώ θα βρείτε μια σύντομη, πρακτική επισκόπηση."
  },
  highlights: [
    {
      title: "Taxisnet & ΑΑΔΕ",
      description:
        "Η κεντρική πύλη φορολογικών υπηρεσιών: δηλώσεις Ε1/Ε2/Ε3, εκκαθαρίσεις, ενημέρωση οφειλών, βεβαιώσεις και στοιχεία μητρώου."
    },
    {
      title: "Κτηματολόγιο (ktimatologio.gr)",
      description:
        "Εξυπηρέτηση για ακίνητα: δηλώσεις ιδιοκτησίας, παρακολούθηση φακέλου, αναζήτηση κτηματολογικών στοιχείων και ενημερώσεις περιοχών."
    },
    {
      title: "gov.gr",
      description:
        "Ενιαία πλατφόρμα για πιστοποιητικά, υπεύθυνες δηλώσεις, εξουσιοδοτήσεις, ραντεβού και πολλές ακόμη υπηρεσίες."
    }
  ],
  taxisnet: {
    title: "Τι είναι το Taxisnet",
    body:
      "Το Taxisnet είναι το βασικό περιβάλλον της ΑΑΔΕ για φορολογικές συναλλαγές. Με τους προσωπικούς κωδικούς, ο πολίτης ή ο λογιστής μπορεί να διαχειριστεί υποχρεώσεις, να υποβάλει δηλώσεις και να δει την εικόνα των οφειλών ή επιστροφών."
  },
  taxation: {
    title: "Πώς λειτουργεί το ελληνικό φορολογικό σύστημα",
    points: [
      "Οι βασικές δηλώσεις εισοδήματος υποβάλλονται ετησίως (Ε1, Ε2, Ε3).",
      "Η εκκαθάριση υπολογίζει φόρους, παρακρατήσεις και τυχόν επιστροφές.",
      "Οι πληρωμές γίνονται μέσω κωδικού πληρωμής (Ταυτότητα Οφειλής).",
      "Η ΑΑΔΕ διαθέτει επιμέρους υπηρεσίες για ΦΠΑ, ρυθμίσεις, βεβαιώσεις και μητρώο."
    ]
  },
  ktimatologio: {
    title: "Κτηματολόγιο: τι πρέπει να γνωρίζετε",
    points: [
      "Η δήλωση ιδιοκτησίας είναι κρίσιμη για τη νομική κατοχύρωση ακινήτων.",
      "Μπορείτε να παρακολουθείτε την πορεία της αίτησης και να λαμβάνετε ενημερώσεις.",
      "Υπάρχουν προθεσμίες ανά περιοχή, οπότε αξίζει να ελέγχετε ανακοινώσεις.",
      "Οι διορθώσεις στοιχείων γίνονται με συγκεκριμένες διαδικασίες και δικαιολογητικά."
    ]
  },
  additional: [
    {
      title: "e-ΕΦΚΑ",
      description:
        "Υπηρεσίες ασφάλισης, εισφορών, συντάξεων και βεβαιώσεων για εργαζόμενους και εργοδότες."
    },
    {
      title: "ΗΔΙΚΑ",
      description:
        "Πρόσβαση σε υπηρεσίες υγείας όπως άυλη συνταγογράφηση και ατομικό φάκελο υγείας."
    },
    {
      title: "Ψηφιακές μεταβιβάσεις",
      description:
        "Ραντεβού, αιτήσεις και έλεγχος εγγράφων για μεταβιβάσεις, άδειες και υπηρεσίες πολιτών."
    }
  ],
  tips: [
    "Κρατήστε τους κωδικούς σας ασφαλείς και ενεργοποιήστε πρόσθετες ειδοποιήσεις όπου υπάρχουν.",
    "Ελέγχετε τακτικά μηνύματα και εκκρεμότητες στους λογαριασμούς σας.",
    "Χρησιμοποιείτε αξιόπιστες πηγές (gov.gr, aade.gr, ktimatologio.gr) για ενημέρωση."
  ]
};

export default function GovernmentApps() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">{governmentAppsContent.hero.eyebrow}</p>
          <h1>{governmentAppsContent.hero.title}</h1>
          <p className="muted">{governmentAppsContent.hero.subtitle}</p>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Οι βασικές πλατφόρμες</h2>
          <p className="section-lead">
            Οι παρακάτω εφαρμογές αποτελούν τα κύρια ψηφιακά σημεία επαφής με το ελληνικό δημόσιο.
          </p>
        </div>
        <div className="grid-3">
          {governmentAppsContent.highlights.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{governmentAppsContent.taxisnet.title}</h2>
          <p className="section-lead">{governmentAppsContent.taxisnet.body}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{governmentAppsContent.taxation.title}</h2>
        </div>
        <ul className="feature-list">
          {governmentAppsContent.taxation.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{governmentAppsContent.ktimatologio.title}</h2>
        </div>
        <ul className="feature-list">
          {governmentAppsContent.ktimatologio.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Άλλες σημαντικές εφαρμογές</h2>
          <p className="section-lead">
            Συμπληρωματικές υπηρεσίες που χρησιμοποιούνται συχνά για θέματα υγείας, ασφάλισης και διοικητικών πράξεων.
          </p>
        </div>
        <div className="grid-3">
          {governmentAppsContent.additional.map((item) => (
            <div key={item.title} className="card muted-border">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section emphasis-card">
        <h2 className="section-title">Χρήσιμες συμβουλές</h2>
        <ul className="feature-list">
          {governmentAppsContent.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
