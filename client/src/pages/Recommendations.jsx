const recommendations = [
  {
    title: "Πρωινό briefing",
    description: "Σύνοψη με 5 ιστορίες που πρέπει να γνωρίζετε πριν ξεκινήσει η ημέρα.",
    category: "Ειδήσεις"
  },
  {
    title: "Τι συζητά η Βουλή",
    description: "Εβδομαδιαία επιλογή θεμάτων που απασχολούν το κοινοβούλιο και τους πολίτες.",
    category: "Πολιτική"
  },
  {
    title: "Προτάσεις της κοινότητας",
    description: "Ιστορίες και projects που ψήφισαν τα μέλη ως πιο χρήσιμα.",
    category: "Community picks"
  },
  {
    title: "Αναλύσεις με δεδομένα",
    description: "Οπτικοποιήσεις και datasets που εξηγούν τη μεγάλη εικόνα.",
    category: "Data"
  }
];

export default function Recommendations() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Recommendations</p>
          <h1>Επιλογές επιμελητών</h1>
          <p className="muted">
            Μια σύντομη λίστα με όσα αξίζει να διαβάσετε ή να παρακολουθήσετε για να έχετε σφαιρική εικόνα.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="grid-2">
          {recommendations.map((item) => (
            <div key={item.title} className="card">
              <p className="eyebrow">{item.category}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="cta-row">
                <a className="btn btn-outline" href="#">
                  Δείτε περισσότερα
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
