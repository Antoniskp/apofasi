import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../lib/api.js";

const governmentStatisticsContent = {
  hero: {
    eyebrow: "Στατιστικά Δημοσίου",
    title: "Πώς αποτυπώνεται το μέγεθος του ελληνικού κράτους",
    subtitle:
      "Συνοπτική εικόνα για το ανθρώπινο δυναμικό, τη διοικητική διάρθρωση και βασικούς αριθμούς που περιγράφουν τη λειτουργία της δημόσιας διοίκησης."
  },
  publicServants: [
    {
      title: "Δημόσιοι υπάλληλοι",
      value: "≈ 670.000",
      description:
        "Ενδεικτικός αριθμός μόνιμων και συμβασιούχων εργαζομένων σε κεντρική διοίκηση, ΟΤΑ και δημόσιους φορείς."
    },
    {
      title: "Μερίδιο στον πληθυσμό",
      value: "≈ 6-7%",
      description:
        "Αναλογία δημοσίων υπαλλήλων επί του συνολικού πληθυσμού (περίπου 6 έως 7 άτομα ανά 100 κατοίκους)."
    },
    {
      title: "Μερίδιο στην απασχόληση",
      value: "≈ 12-14%",
      description:
        "Ποσοστό δημοσίων υπαλλήλων στο ενεργό εργατικό δυναμικό, υπολογισμένο ως κλάσμα της συνολικής απασχόλησης."
    }
  ],
  clergy: [
    {
      title: "Ιερείς",
      value: "≈ 10.000",
      description:
        "Ενδεικτικός αριθμός εφημερίων και λοιπών κληρικών που μισθοδοτούνται ή υπηρετούν σε ενορίες και μητροπόλεις."
    },
    {
      title: "Μερίδιο στον πληθυσμό",
      value: "≈ 0,1%",
      description:
        "Αναλογία ιερέων ως προς τον συνολικό πληθυσμό, περίπου 1 ανά 1.000 κατοίκους."
    },
    {
      title: "Μερίδιο στην απασχόληση",
      value: "≈ 0,2%",
      description:
        "Ποσοστό του κλήρου επί της συνολικής απασχόλησης, ενδεικτικά κάτω από 1 στους 500 εργαζόμενους."
    }
  ],
  salaries: [
    {
      title: "Μέσος καθαρός μισθός δημοσίου",
      value: "≈ €1.050-€1.250",
      description:
        "Ενδεικτικό εύρος μηνιαίων καθαρών αποδοχών, με διαφοροποίηση ανά βαθμίδα, προϋπηρεσία και ειδικότητα."
    },
    {
      title: "Μέσος καθαρός μισθός ιερέων",
      value: "≈ €900-€1.100",
      description:
        "Ενδεικτικές μηνιαίες αποδοχές κληρικών που μισθοδοτούνται από το δημόσιο, με διαφοροποιήσεις ανά έτη υπηρεσίας."
    },
    {
      title: "Επίδραση επιδομάτων",
      value: "Μεταβλητή",
      description:
        "Επιδόματα, οικογενειακή κατάσταση και πρόσθετες παροχές μπορούν να ανεβάσουν ή να μειώσουν το τελικό καθαρό ποσό."
    }
  ],
  governance: [
    {
      title: "Διοικητική δομή",
      description:
        "13 περιφέρειες και 332 δήμοι συγκροτούν την τοπική αυτοδιοίκηση, με αποκεντρωμένες αρμοδιότητες και δικά τους συμβούλια."
    },
    {
      title: "Δημόσιο χρέος",
      description:
        "Το χρέος της γενικής κυβέρνησης κινείται σταθερά πάνω από το 150% του ΑΕΠ, επηρεάζοντας τον σχεδιασμό πολιτικής και επενδύσεων."
    },
    {
      title: "Κοινωνικές δαπάνες",
      description:
        "Υγεία, παιδεία και κοινωνική προστασία απορροφούν το μεγαλύτερο μέρος των πρωτογενών δαπανών του κράτους."
    },
    {
      title: "Ψηφιακές υπηρεσίες",
      description:
        "Το gov.gr συγκεντρώνει πάνω από 1.500 υπηρεσίες, μειώνοντας χρόνο και κόστος εξυπηρέτησης πολιτών."
    }
  ],
  economicGrowth: {
    title: "Ρυθμός οικονομικής μεγέθυνσης",
    description:
      "Ζωντανή απεικόνιση του πραγματικού ΑΕΠ για να φαίνεται πότε η οικονομία αναπτύσσεται ή συρρικνώνεται."
  },
  economicIndicatorsTitle: "Οικονομικοί δείκτες & κοινωνική εικόνα",
  notes: [
    "Τα οικονομικά δεδομένα ενημερώνονται αυτόματα από δημόσιες πηγές.",
    "Οι αναλογίες διαφοροποιούνται ανάλογα με το έτος, τη μέθοδο μέτρησης και την πηγή.",
    "Οι αποδοχές βασίζονται σε τυπικά κλιμάκια και δεν αντικαθιστούν επίσημους πίνακες μισθοδοσίας.",
    "Για επίσημα στοιχεία, προτείνεται αναζήτηση σε ΕΛΣΤΑΤ, ΑΑΔΕ, Υπουργείο Εσωτερικών και Υπουργείο Παιδείας & Θρησκευμάτων."
  ]
};

export default function GovernmentStatistics() {
  const [economicData, setEconomicData] = useState({
    growth: [],
    indicators: [],
    updatedAt: null,
    source: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEconomicData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/government-statistics`);
        if (!response.ok) {
          throw new Error("Δεν ήταν δυνατή η φόρτωση των οικονομικών δεδομένων.");
        }
        const payload = await response.json();
        if (!isMounted) return;
        setEconomicData(payload);
        setIsLoading(false);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message);
        setIsLoading(false);
      }
    };

    fetchEconomicData();

    return () => {
      isMounted = false;
    };
  }, []);

  const maxGrowthValue = useMemo(() => {
    if (!economicData.growth.length) return 1;
    return Math.max(...economicData.growth.map((entry) => Math.abs(entry.value)), 1);
  }, [economicData.growth]);

  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">{governmentStatisticsContent.hero.eyebrow}</p>
          <h1>{governmentStatisticsContent.hero.title}</h1>
          <p className="muted">{governmentStatisticsContent.hero.subtitle}</p>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Ανθρώπινο δυναμικό του δημοσίου</h2>
          <p className="section-lead">
            Τα παρακάτω μεγέθη αποτυπώνουν πόσο μεγάλο είναι το ανθρώπινο αποτύπωμα του κράτους
            σε σχέση με τον πληθυσμό και την απασχόληση.
          </p>
        </div>
        <div className="grid-3">
          {governmentStatisticsContent.publicServants.map((stat) => (
            <div key={stat.title} className="card">
              <p className="eyebrow">{stat.title}</p>
              <h3>{stat.value}</h3>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Στατιστικά κλήρου</h2>
          <p className="section-lead">
            Συνοπτικά μεγέθη για τους ιερείς σε σχέση με τον πληθυσμό και την εργασία στην Ελλάδα.
          </p>
        </div>
        <div className="grid-3">
          {governmentStatisticsContent.clergy.map((stat) => (
            <div key={stat.title} className="card">
              <p className="eyebrow">{stat.title}</p>
              <h3>{stat.value}</h3>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Μισθολογικές ενδείξεις</h2>
          <p className="section-lead">
            Ενδεικτικά εύρη αποδοχών για δημόσιους υπαλλήλους και ιερείς που μισθοδοτούνται
            από το κράτος.
          </p>
        </div>
        <div className="grid-3">
          {governmentStatisticsContent.salaries.map((stat) => (
            <div key={stat.title} className="card muted-border">
              <p className="eyebrow">{stat.title}</p>
              <h3>{stat.value}</h3>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Άλλοι βασικοί δείκτες κράτους</h2>
          <p className="section-lead">
            Συγκεντρωτικά στοιχεία που βοηθούν να κατανοήσουμε τον ρόλο του κράτους στην οικονομία
            και στη δημόσια διοίκηση.
          </p>
        </div>
        <div className="grid-2">
          {governmentStatisticsContent.governance.map((stat) => (
            <div key={stat.title} className="card muted-border">
              <h3>{stat.title}</h3>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{governmentStatisticsContent.economicGrowth.title}</h2>
          <p className="section-lead">{governmentStatisticsContent.economicGrowth.description}</p>
        </div>
        <div className="chart-card">
          {isLoading ? (
            <p className="chart-note">Φόρτωση δεδομένων...</p>
          ) : loadError ? (
            <p className="chart-note">{loadError}</p>
          ) : (
            <>
              <div className="bar-chart">
                {economicData.growth.map((entry) => (
                  <div key={entry.year} className="bar-column">
                    <div className="bar-label">{entry.year}</div>
                    <div className="bar-track">
                      <div
                        className={`bar ${entry.value >= 0 ? "positive" : "negative"}`}
                        style={{
                          height: `${(Math.abs(entry.value) / maxGrowthValue) * 100}%`
                        }}
                      >
                        <span>{entry.value.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="chart-note">
                Η απεικόνιση βασίζεται σε ενημερωμένα στοιχεία από {economicData.source}.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{governmentStatisticsContent.economicIndicatorsTitle}</h2>
          <p className="section-lead">
            Συνοπτικός πίνακας με βασικούς δείκτες που επηρεάζουν τον σχεδιασμό δημοσίων πολιτικών.
          </p>
        </div>
        <div className="table-card">
          {isLoading ? (
            <p className="chart-note">Φόρτωση δεικτών...</p>
          ) : loadError ? (
            <p className="chart-note">{loadError}</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Δείκτης</th>
                  <th>Τελευταία τιμή</th>
                  <th>Τάση</th>
                  <th>Έτος αναφοράς</th>
                </tr>
              </thead>
              <tbody>
                {economicData.indicators.map((row) => (
                  <tr key={row.indicator}>
                    <td>{row.indicator}</td>
                    <td>{row.latest}</td>
                    <td>
                      <span className={`pill ${row.trendClass}`}>{row.trend}</span>
                    </td>
                    <td>{row.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!isLoading && !loadError && economicData.updatedAt ? (
          <p className="chart-note">Τελευταία ενημέρωση: {economicData.updatedAt}</p>
        ) : null}
      </section>

      <section className="section emphasis-card">
        <h2 className="section-title">Σημειώσεις</h2>
        <ul className="feature-list">
          {governmentStatisticsContent.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
