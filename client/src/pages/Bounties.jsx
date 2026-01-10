import { Link } from "react-router-dom";

const bountiesContent = {
  hero: {
    kicker: "Bounties",
    title: "Bug bounties και υλοποιήσεις λειτουργιών με ανταμοιβή.",
    subtitle:
      "Δείτε τις ανοιχτές ευκαιρίες για να βοηθήσετε το Apofasi και να ανταμειφθείτε για ουσιαστική συνεισφορά.",
    primaryCta: { label: "Επικοινωνία στο Discord", href: "https://discord.gg/pvJftR4T98" },
    secondaryCta: { label: "Οδηγίες συνεισφοράς", href: "/contribute" }
  },
  bugBounties: [
    {
      title: "Correct server URL implementation",
      reward: "€30",
      detail: "Διορθώσεις στην υλοποίηση των URL του server ώστε να είναι ακριβείς σε όλα τα flows.",
      contact: "Αναφέρετε τα endpoints και τα βήματα αναπαραγωγής."
    },
    {
      title: "Server configuration passes",
      reward: "€20",
      detail: "Καταγραφή και διόρθωση των ακριβών passes/ρυθμίσεων για σωστή εκκίνηση server.",
      contact: "Μοιραστείτε config, logs και προτεινόμενες αλλαγές."
    },
    {
      title: "405 error on poll registration",
      reward: "€20",
      detail: "Εντοπισμός και διόρθωση του 405 κατά την εγγραφή σε polls.",
      contact: "Παραθέστε request/response details και πιθανή λύση."
    }
  ],
  implementationBounties: [
    {
      title: "Styling & οργάνωση polls",
      reward: "€20",
      detail: "Βελτίωση layout, φίλτρων και προβολής αποτελεσμάτων στις ψηφοφορίες.",
      contact: "Προτείνετε design και υλοποιήστε σε components."
    },
    {
      title: "Styling & οργάνωση news",
      reward: "€20",
      detail: "Καλύτερη οπτική ιεραρχία, κάρτες και grouping για τις ειδήσεις.",
      contact: "Ευθυγράμμιση με design system και responsive βελτιώσεις."
    }
  ],
  steps: [
    {
      title: "Διαλέξτε bounty",
      detail: "Επιλέξτε από την λίστα παραπάνω ή προτείνετε νέο bounty."
    },
    {
      title: "Συμφωνούμε scope",
      detail: "Ορίζουμε παραδοτέα, timeline και τρόπο ανταμοιβής."
    },
    {
      title: "Παραδίδετε",
      detail: "Κάνετε PR ή στέλνετε αναφορά με τεκμηρίωση."
    }
  ]
};

export default function Bounties() {
  return (
    <div className="bounties-page">
      <section className="bounties-hero">
        <div className="bounties-hero-inner">
          <p className="hero-kicker">{bountiesContent.hero.kicker}</p>
          <h1>{bountiesContent.hero.title}</h1>
          <p className="hero-sub narrow">{bountiesContent.hero.subtitle}</p>
          <div className="hero-buttons">
            <a className="btn" href={bountiesContent.hero.primaryCta.href} target="_blank" rel="noreferrer">
              {bountiesContent.hero.primaryCta.label}
            </a>
            <Link to={bountiesContent.hero.secondaryCta.href} className="btn btn-outline">
              {bountiesContent.hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Bug bounties</h2>
        <div className="grid-2">
          {bountiesContent.bugBounties.map((bounty) => (
            <div key={bounty.title} className="card bounties-card">
              <div className="pill subtle">{bounty.reward}</div>
              <h3>{bounty.title}</h3>
              <p>{bounty.detail}</p>
              <p className="muted">{bounty.contact}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Feature implementation</h2>
        <div className="grid-2">
          {bountiesContent.implementationBounties.map((bounty) => (
            <div key={bounty.title} className="card bounties-card">
              <div className="pill subtle">{bounty.reward}</div>
              <h3>{bounty.title}</h3>
              <p>{bounty.detail}</p>
              <p className="muted">{bounty.contact}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Πώς λειτουργεί</h2>
        <div className="grid-3">
          {bountiesContent.steps.map((step) => (
            <div key={step.title} className="card highlight">
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
