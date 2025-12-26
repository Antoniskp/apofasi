import React from "react";
import { Link } from "react-router-dom";

const demoStory = {
  title: "Example: Parliament debates new measures",
  sources: ["Kathimerini", "Naftemporiki", "ERT", "Demo Source"],
  updated: "Updated 15 minutes ago",
  question: "Do you support the proposed measures?",
  options: ["Yes", "No", "Not sure"],
  totalVotes: 412
};

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-kicker">Greece-first • Web-first • Public sentiment layer</div>

          <h1>Apofasi: news clustered across sources, with a poll under every story.</h1>

          <p className="hero-sub">
            Read what happened, compare how different outlets cover it, and vote to show how people feel —
            in real time. Built for Greece.
          </p>

          <div className="hero-buttons">
            <Link to="/news" className="btn">
              Explore News (soon)
            </Link>
            <Link to="/polls" className="btn btn-outline">
              Explore Polls (soon)
            </Link>
          </div>

          <p className="hero-disclaimer">
            Transparency: Platform polls are indicative and not statistically representative.
          </p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">How it works</h2>

        <div className="grid-3">
          <div className="card">
            <h3>1) Aggregate</h3>
            <p>
              We collect headlines from multiple Greek and international sources and normalize them into a clean feed.
            </p>
          </div>

          <div className="card">
            <h3>2) Cluster</h3>
            <p>
              Similar articles are grouped into one “story cluster” so you can see coverage across outlets in one place.
            </p>
          </div>

          <div className="card">
            <h3>3) Poll</h3>
            <p>
              Every story gets a simple poll. Vote once, see results instantly, and track sentiment over time.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Demo (what you will see)</h2>

        <div className="story">
          <div className="story-header">
            <div>
              <div className="story-title">{demoStory.title}</div>
              <div className="story-meta">{demoStory.updated}</div>
            </div>
            <div className="pill">Cluster</div>
          </div>

          <div className="story-sources">
            <div className="label">Sources covering this story:</div>
            <div className="chips">
              {demoStory.sources.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="poll">
            <div className="label">Poll</div>
            <div className="poll-q">{demoStory.question}</div>

            <div className="poll-options">
              {demoStory.options.map((opt) => (
                <button key={opt} className="poll-btn" type="button">
                  {opt}
                </button>
              ))}
            </div>

            <div className="poll-foot">
              <span>Total votes: {demoStory.totalVotes}</span>
              <span className="muted">Results shown after voting (MVP rule)</span>
            </div>
          </div>
        </div>

        <div className="cta-row">
          <a className="btn" href="#roadmap">
            What’s next
          </a>
          <a className="btn btn-outline" href="https://github.com/Antoniskp/apofasi" target="_blank" rel="noreferrer">
            View project on GitHub
          </a>
        </div>
      </section>

      <section id="roadmap" className="section">
        <h2 className="section-title">Roadmap (MVP)</h2>

        <div className="grid-2">
          <div className="card">
            <h3>Phase 1</h3>
            <ul className="list">
              <li>RSS ingestion for Greek sources</li>
              <li>Story clustering</li>
              <li>Story page + poll widget</li>
            </ul>
          </div>

          <div className="card">
            <h3>Phase 2</h3>
            <ul className="list">
              <li>User accounts (optional verification)</li>
              <li>Poll integrity controls (rate limits, risk scoring)</li>
              <li>Topic pages (Politics, Economy, Society, Sports)</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} Apofasi. Built for Greece.
      </footer>
    </div>
  );
};

export default Home;
