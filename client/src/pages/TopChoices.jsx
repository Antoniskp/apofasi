const topStories = [
  {
    title: "Τοπικές εκλογές: τι αλλάζει στους δήμους",
    summary: "Ένα πρακτικό οδηγό για τις αποφάσεις που επηρεάζουν την καθημερινότητα των πολιτών.",
    votes: "4.2K θετικές ψήφοι"
  },
  {
    title: "Αναλυτικός οδηγός για την ενεργειακή μετάβαση",
    summary: "Συγκεντρώσαμε τις ερωτήσεις και τις απαντήσεις που ζητούν περισσότερο οι αναγνώστες.",
    votes: "3.1K θετικές ψήφοι"
  },
  {
    title: "Πώς διαμορφώνονται οι τιμές στα σούπερ μάρκετ",
    summary: "Έρευνα σε 120 προϊόντα με ανανεωμένα δεδομένα κάθε εβδομάδα.",
    votes: "2.8K θετικές ψήφοι"
  }
];

export default function TopChoices() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Top choices</p>
          <h1>Οι αγαπημένες επιλογές της εβδομάδας</h1>
          <p className="muted">
            Συγκεντρωμένες ιστορίες με υψηλές αξιολογήσεις από την κοινότητα και τις ομάδες σύνταξης.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="stack">
          {topStories.map((item) => (
            <div key={item.title} className="card card-horizontal">
              <div className="card-body">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <p className="muted">{item.votes}</p>
              </div>
              <div className="cta-row">
                <a className="btn btn-outline" href="#">
                  Άνοιγμα ιστορίας
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
