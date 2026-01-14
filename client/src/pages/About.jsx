import { useEffect, useMemo, useState } from "react";

const GITHUB_REPO = "Antoniskp/apofasi";
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO}`;

const aboutContent = {
  hero: {
    eyebrow: "Σχετικά",
    title: "Γνωρίστε το Apofasi",
    subtitle:
      "Μια ανεξάρτητη ψηφιακή πλατφόρμα που συγκεντρώνει ειδήσεις, αναλύσεις και συμμετοχικές ψηφοφορίες ώστε να παίρνετε αποφάσεις με σιγουριά."
  },
  values: [
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
  ],
  story: {
    title: "Η ιστορία μας",
    body:
      "Ξεκινήσαμε ως ένα μικρό side-project που ήθελε να απαντήσει στο ερώτημα «τι λένε οι πολίτες για τα μεγάλα ζητήματα;». Με ανοιχτό κώδικα και συνεργασίες με δημοσιογράφους, ερευνητές και designers, χτίζουμε ένα εργαλείο που να υπηρετεί την ενημέρωση και την εμπιστοσύνη."
  },
  contributors: {
    title: "Ζωντανά από το GitHub",
    subtitle:
      "Η κοινότητά μας μεγαλώνει μέσα από pull requests, reviews και προτάσεις. Δείτε ποιοι συνέβαλαν πρόσφατα και την ένταση της δραστηριότητας."
  }
};

export default function About() {
  const [contributors, setContributors] = useState([]);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchGithubData = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const [contributorsResponse, activityResponse] = await Promise.all([
          fetch(`${GITHUB_API_BASE}/contributors?per_page=12`, {
            headers: {
              Accept: "application/vnd.github+json"
            }
          }),
          fetch(`${GITHUB_API_BASE}/stats/commit_activity`, {
            headers: {
              Accept: "application/vnd.github+json"
            }
          })
        ]);

        if (!contributorsResponse.ok) {
          throw new Error("contributors fetch failed");
        }

        const contributorsData = await contributorsResponse.json();
        const activityData = activityResponse.ok ? await activityResponse.json() : [];

        if (isMounted) {
          setContributors(
            contributorsData.filter((person) => !person.type || person.type === "User")
          );
          setActivity(Array.isArray(activityData) ? activityData : []);
        }
      } catch (error) {
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchGithubData();

    return () => {
      isMounted = false;
    };
  }, []);

  const activityWeeks = useMemo(() => {
    if (!activity.length) {
      return [];
    }

    return activity.slice(-12);
  }, [activity]);

  const activityMax = useMemo(() => {
    return activityWeeks.reduce((max, week) => Math.max(max, week.total || 0), 1);
  }, [activityWeeks]);

  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">{aboutContent.hero.eyebrow}</p>
          <h1>{aboutContent.hero.title}</h1>
          <p className="muted">{aboutContent.hero.subtitle}</p>
        </div>
      </header>

      <section className="section">
        <div className="grid-3">
          {aboutContent.values.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card">
          <h2>{aboutContent.story.title}</h2>
          <p className="muted">{aboutContent.story.body}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{aboutContent.contributors.title}</h2>
          <p className="section-lead">{aboutContent.contributors.subtitle}</p>
        </div>
        <div className="contributors-grid">
          <div className="card contributors-card">
            <div className="contributors-card-header">
              <div>
                <h3>Συνεισφέροντες</h3>
                <p className="muted">Live λίστα από το GitHub repository.</p>
              </div>
              <a
                className="btn btn-outline"
                href={`https://github.com/${GITHUB_REPO}`}
                target="_blank"
                rel="noreferrer"
              >
                Repo
              </a>
            </div>
            {isLoading && <p className="muted">Φορτώνουμε δεδομένα κοινότητας…</p>}
            {hasError && (
              <p className="muted">Δεν ήταν δυνατή η φόρτωση των δεδομένων αυτή τη στιγμή.</p>
            )}
            {!isLoading && !hasError && (
              <div className="contributors-list">
                {contributors.map((person) => (
                  <a
                    key={person.id}
                    className="contributor-chip"
                    href={person.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={person.avatar_url} alt={person.login} loading="lazy" />
                    <div>
                      <strong>{person.login}</strong>
                      <span className="muted">{person.contributions} commits</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="card contributors-card">
            <div className="contributors-card-header">
              <div>
                <h3>Ρυθμός συνεισφορών</h3>
                <p className="muted">Οι τελευταίες 12 εβδομάδες από το GitHub.</p>
              </div>
              <a
                className="btn btn-outline"
                href={`https://github.com/${GITHUB_REPO}/graphs/contributors`}
                target="_blank"
                rel="noreferrer"
              >
                Γράφημα
              </a>
            </div>
            {!activityWeeks.length && !isLoading && (
              <p className="muted">Τα στατιστικά ενημερώνονται από το GitHub σε λίγο.</p>
            )}
            {isLoading && <p className="muted">Συλλέγουμε το ιστορικό δραστηριότητας…</p>}
            {activityWeeks.length > 0 && (
              <div className="activity-chart" role="img" aria-label="Activity chart">
                {activityWeeks.map((week, index) => (
                  <div key={week.week} className="activity-bar">
                    <span
                      style={{
                        height: `${Math.max((week.total / activityMax) * 100, 8)}%`
                      }}
                      title={`Εβδομάδα ${index + 1}: ${week.total} commits`}
                    />
                  </div>
                ))}
              </div>
            )}
            <p className="muted small">
              Τα δεδομένα αντλούνται από το GitHub API και ανανεώνονται περιοδικά.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
