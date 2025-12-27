const socialUpdates = [
  {
    channel: "Newsletter",
    description: "Μηνιαίες ενημερώσεις με τις πιο σημαντικές ιστορίες και τα συμπεράσματα από τις ψηφοφορίες.",
    cadence: "1x / μήνα",
    cta: "Εγγραφή"
  },
  {
    channel: "Community chat",
    description: "Συζητήσεις για νέες ιδέες, feedback και τεχνική στήριξη στην κοινότητά μας.",
    cadence: "Ζωντανή κοινότητα",
    cta: "Join Discord"
  },
  {
    channel: "Social media",
    description: "Σύντομες ενημερώσεις και breaking news από την ομάδα σύνταξης και τους συνεργάτες μας.",
    cadence: "Καθημερινά",
    cta: "Ακολουθήστε"
  }
];

export default function Social() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Social</p>
          <h1>Μείνετε σε επαφή με την κοινότητα</h1>
          <p className="muted">
            Επιλέξτε το κανάλι που σας ταιριάζει για να ενημερώνεστε για νέες δυνατότητες, έρευνες και δράσεις του Apofasi.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="grid-3">
          {socialUpdates.map((item) => (
            <div key={item.channel} className="card">
              <h3>{item.channel}</h3>
              <p>{item.description}</p>
              <p className="muted">Συχνότητα: {item.cadence}</p>
              <div className="cta-row">
                <a className="btn btn-outline" href="#">
                  {item.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
