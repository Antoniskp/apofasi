import AuthButtons from "../components/AuthButtons.jsx";

const contactChannels = [
  {
    title: "Φόρμα επικοινωνίας",
    detail: "Στείλτε μας τις απορίες και τις προτάσεις σας ώστε να απαντήσουμε μέσα σε 48 ώρες.",
    action: { label: "Άνοιγμα φόρμας", href: "#" }
  },
  {
    title: "Συνεργασίες",
    detail: "Ενδιαφέρεστε για συνεργασία ή δημοσιογραφικό υλικό; Μιλήστε με την ομάδα σύνταξης.",
    action: { label: "Κλείστε ραντεβού", href: "#" }
  },
  {
    title: "Υποστήριξη χρηστών",
    detail: "Βρείτε βοήθεια για το λογαριασμό σας, την εγγραφή ή τις ψηφοφορίες της πλατφόρμας.",
    action: { label: "Κέντρο βοήθειας", href: "#" }
  }
];

export default function Contact() {
  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Επικοινωνία</p>
          <h1>Είμαστε εδώ για να βοηθήσουμε</h1>
          <p className="muted">
            Είτε θέλετε να στείλετε ένα σχόλιο, είτε να μάθετε πώς μπορείτε να συμμετέχετε στην κοινότητα,
            θα βρείτε ένα κανάλι επικοινωνίας που σας ταιριάζει.
          </p>
        </div>
        <AuthButtons />
      </header>

      <section className="section">
        <div className="grid-3">
          {contactChannels.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <div className="cta-row">
                <a className="btn btn-outline" href={item.action.href}>
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
