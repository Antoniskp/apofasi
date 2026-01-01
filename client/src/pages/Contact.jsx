import AuthButtons from "../components/AuthButtons.jsx";

const contactChannels = [
  {
    title: "Φόρμα επικοινωνίας",
    detail:
      "Στείλτε μας τις απορίες και τις προτάσεις σας ώστε να απαντήσουμε μέσα σε 48 ώρες.",
    action: { label: "Άνοιγμα φόρμας", href: "#contact-form" }
  },
  {
    title: "Συνεργασίες",
    detail:
      "Ενδιαφέρεστε για συνεργασία ή δημοσιογραφικό υλικό; Μιλήστε με την ομάδα σύνταξης.",
    action: { label: "Κλείστε ραντεβού", href: "#collaboration" }
  },
  {
    title: "Υποστήριξη χρηστών",
    detail:
      "Βρείτε βοήθεια για το λογαριασμό σας, την εγγραφή ή τις ψηφοφορίες της πλατφόρμας.",
    action: { label: "Κέντρο βοήθειας", href: "#support" }
  }
];

const socialLinks = [
  {
    label: "Discord",
    icon: "💬",
    href: "https://discord.gg/pvJftR4T98"
  }
];

export default function Contact() {
  return (
    <div className="page contact-page">
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

      <section id="contact-form" className="section contact-section">
        <div className="grid-2 contact-grid">
          <div className="card contact-card">
            <div className="pill subtle">Γρήγορη επαφή</div>
            <h3>Στείλτε μήνυμα στην ομάδα</h3>
            <p>
              Για γενικές ερωτήσεις, προτάσεις ή διορθώσεις, επικοινωνήστε απευθείας με την ομάδα του Apofasi.
              Απαντάμε συνήθως μέσα σε μία εργάσιμη ημέρα.
            </p>
            <ul className="contact-meta">
              <li>
                <strong>Email:</strong> team@apofasi.news
              </li>
              <li>
                <strong>Ώρες:</strong> Δευτέρα–Παρασκευή, 10:00–18:00
              </li>
              <li>
                <strong>Χρόνος απάντησης:</strong> 24–48 ώρες
              </li>
            </ul>
            <div className="cta-row">
              <a className="btn" href="mailto:team@apofasi.news">
                Αποστολή email
              </a>
              <a className="btn btn-outline" href="/contribute">
                Μάθετε πώς να συνεισφέρετε
              </a>
            </div>
          </div>

          <div id="support" className="card contact-card secondary">
            <div className="pill subtle">Υποστήριξη</div>
            <h3>Βρείτε απαντήσεις για την πλατφόρμα</h3>
            <p>
              Ξεκινήστε με τις βασικές ερωτήσεις για λογαριασμούς, ειδοποιήσεις και ρυθμίσεις ψηφοφοριών. Αν δεν βρείτε αυτό που
              χρειάζεστε, γράψτε μας και θα βοηθήσουμε.
            </p>
            <ul className="contact-meta">
              <li>Συχνές ερωτήσεις για είσοδο και εγγραφή</li>
              <li>Οδηγός συμμετοχής σε ψηφοφορίες</li>
              <li>Ρυθμίσεις ειδοποιήσεων και ενημερώσεων</li>
            </ul>
            <div className="cta-row">
              <a className="btn btn-outline" href="mailto:team@apofasi.news?subject=Υποστήριξη%20Apofasi">
                Ζητήστε βοήθεια
              </a>
              <a className="btn btn-subtle" href="/news">
                Δείτε τις ενημερώσεις
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="collaboration" className="section contact-section">
        <div className="card contact-card">
          <div className="pill subtle">Συνεργασίες</div>
          <h3>Μιλήστε για projects, events ή media kits</h3>
          <p>
            Θέλετε να σχεδιάσουμε ένα εργαστήριο, να μοιραστούμε δεδομένα ή να παρουσιάσουμε το Apofasi σε συνέδριο; Ας οργανώσουμε
            μια συζήτηση για να δούμε πώς μπορούμε να συνεργαστούμε.
          </p>
          <div className="contact-actions">
            <div>
              <p className="muted">Χρήσιμες λεπτομέρειες πριν το ραντεβού:</p>
              <ul className="contact-meta">
                <li>Περιγράψτε το κοινό ή τον φορέα που απευθύνεστε</li>
                <li>Προτείνετε ημερομηνίες/ώρες για call 20-30 λεπτών</li>
                <li>Αναφέρετε αν χρειάζεστε παρουσίαση ή demo</li>
              </ul>
            </div>
            <div className="cta-row">
              <a className="btn" href="mailto:team@apofasi.news?subject=Συνεργασία%20με%20το%20Apofasi">
                Κλείστε ραντεβού
              </a>
              <a className="btn btn-outline" href="/mission">
                Δείτε την αποστολή
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section contact-section">
        <div className="card social-card">
          <div className="social-card-head">
            <div>
              <div className="pill subtle">Κοινότητα</div>
              <h3>Συνδεθείτε μαζί μας στο Discord</h3>
              <p className="muted">
                Για την ώρα, όλες οι ανακοινώσεις και η υποστήριξη γίνονται μέσα από το Discord. Μπείτε για να λάβετε άμεσες
                ενημερώσεις, να δώσετε feedback και να μιλήσετε με την ομάδα ανάπτυξης.
              </p>
            </div>
            <a className="btn btn-outline" href="https://discord.gg/pvJftR4T98" target="_blank" rel="noreferrer">
              Είσοδος στο Discord
            </a>
          </div>
          <div className="social-icons">
            {socialLinks.map((link) => (
              <a key={link.label} className="social-btn" href={link.href} target="_blank" rel="noreferrer">
                <span className="social-icon" aria-hidden>
                  {link.icon}
                </span>
                <span className="social-label">{link.label}</span>
              </a>
            ))}
          </div>
          <ul className="contact-meta">
            <li>Άμεσες ενημερώσεις για αλλαγές στην πλατφόρμα</li>
            <li>Κανάλι υποστήριξης για απορίες και αναφορές σφαλμάτων</li>
            <li>Χώρος για προτάσεις, ιδέες και δοκιμές νέων χαρακτηριστικών</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
