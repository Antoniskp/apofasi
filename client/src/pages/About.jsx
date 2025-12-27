const values = [
  {
    title: "Διαφάνεια",
    description:
      "Οι διαδικασίες μας είναι ανοιχτές: από τον τρόπο που επιλέγουμε ειδήσεις μέχρι τη μεθοδολογία των ψηφοφοριών."
  },
  {
    title: "Κοινότητα",
    description:
      "Το Apofasi χτίζεται από πολίτες για πολίτες, με ιδέες και κώδικα που προέρχονται από την κοινότητα."
  },
  {
    title: "Ισορροπία",
    description:
      "Επιδιώκουμε την ψύχραιμη ενημέρωση και αποφεύγουμε τον θόρυβο ώστε οι αποφάσεις να βασίζονται στα δεδομένα."
  }
];

export default function About() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Σχετικά</p>
          <h1>Γνωρίστε το Apofasi</h1>
          <p className="muted">
            Μια ανεξάρτητη ψηφιακή πλατφόρμα που συγκεντρώνει ειδήσεις, αναλύσεις και συμμετοχικές ψηφοφορίες
            ώστε να παίρνετε αποφάσεις με σιγουριά.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="grid-3">
          {values.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card">
          <h2>Η ιστορία μας</h2>
          <p className="muted">
            Ξεκινήσαμε ως ένα μικρό side-project που ήθελε να απαντήσει στο ερώτημα «τι λένε οι πολίτες για τα μεγάλα
            ζητήματα;». Με ανοιχτό κώδικα και συνεργασίες με δημοσιογράφους, ερευνητές και designers, χτίζουμε ένα
            εργαλείο που να υπηρετεί την ενημέρωση και την εμπιστοσύνη.
          </p>
        </div>
      </section>
    </div>
  );
}
