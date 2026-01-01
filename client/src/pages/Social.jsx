export default function Social() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Social</p>
          <h1>Μείνετε σε επαφή με την κοινότητα</h1>
          <p className="muted">
            Προς το παρόν το επίσημο κανάλι μας είναι το Discord, όπου συγκεντρώνουμε όλες τις ενημερώσεις, τα Q&A και την
            υποστήριξη της κοινότητας. Τα υπόλοιπα κανάλια θα προστεθούν όταν είναι έτοιμα.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="card contact-card">
          <div className="pill subtle">Discord</div>
          <h3>Το κεντρικό hub της κοινότητας</h3>
          <p>
            Ελάτε στο Discord για να μιλήσετε με την ομάδα, να μάθετε πρώτοι για νέα χαρακτηριστικά και να δώσετε feedback για
            το τι θέλετε να δείτε στην πλατφόρμα Apofasi.
          </p>
          <ul className="contact-meta">
            <li>Live ενημερώσεις για releases και βελτιώσεις</li>
            <li>Κανάλια Q&A και τεχνικής υποστήριξης</li>
            <li>Συνεργατικά threads για ιδέες, δοκιμές και εθελοντισμό</li>
          </ul>
          <div className="cta-row">
            <a className="btn btn-outline" href="https://discord.gg/pvJftR4T98" target="_blank" rel="noreferrer">
              Join Discord
            </a>
            <a className="btn btn-subtle" href="/contact">
              Δείτε τρόπους επικοινωνίας
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
