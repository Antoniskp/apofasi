import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>📰 News & 📊 Polls</h1>
        <p>Stay informed. Share your opinion.</p>

        <div className="hero-buttons">
          <Link to="/news" className="btn">
            Read News
          </Link>
          <Link to="/polls" className="btn btn-outline">
            Vote in Polls
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>📰 Latest News</h3>
          <p>Read fresh news posted by our editors.</p>
        </div>

        <div className="feature-card">
          <h3>📊 Community Polls</h3>
          <p>Vote once and see live results.</p>
        </div>

        <div className="feature-card">
          <h3>🔐 User Accounts</h3>
          <p>Register, login, and track your activity.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
