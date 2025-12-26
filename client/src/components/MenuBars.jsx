import { Link } from "react-router-dom";

const topMenu = [
  { label: "Αρχική", to: "/" },
  { label: "Ειδήσεις", to: "/news" },
  { label: "Ψηφοφορίες", to: "/polls" },
  { label: "LIVE", to: "/news" },
  { label: "Podcasts", to: "/news" }
];

const bottomMenu = [
  "Πολιτική",
  "Οικονομία",
  "Κοινωνία",
  "Κόσμος",
  "Αθλητικά",
  "Lifestyle",
  "Auto/Moto",
  "Science",
  "Opinions"
];

export default function MenuBars() {
  return (
    <div className="menu-shell">
      <div className="menu-top">
        <div className="menu-brand">
          <span className="brand-mark">ap</span>
          <Link to="/" className="brand-wordmark">
            Apofasi
          </Link>
        </div>

        <nav className="menu-links" aria-label="Top navigation">
          {topMenu.map((item) => (
            <Link key={item.label} to={item.to} className="menu-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="menu-meta">
          <span className="menu-badge">Beta</span>
          <span className="menu-clock">24/7 ενημέρωση</span>
        </div>
      </div>

      <div className="menu-bottom" aria-label="Categories">
        {bottomMenu.map((item) => (
          <span key={item} className="menu-pill">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
