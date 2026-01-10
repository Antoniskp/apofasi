import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuBars from "./components/MenuBars.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import News from "./pages/News.jsx";
import Polls from "./pages/Polls.jsx";
import PollDetail from "./pages/PollDetail.jsx";
import AuthStatus from "./pages/AuthStatus.jsx";
import Mission from "./pages/Mission.jsx";
import Auth from "./pages/Auth.jsx";
import Contribute from "./pages/Contribute.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Social from "./pages/Social.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import TopChoices from "./pages/TopChoices.jsx";
import HowWeDoIt from "./pages/HowWeDoIt.jsx";
import Bounties from "./pages/Bounties.jsx";
import Education from "./pages/Education.jsx";


const withLayout = (page) => (
  <div className="page-shell">
    <MenuBars />
    <main className="page-main">{page}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={withLayout(<Home />)} />
        <Route path="/mission" element={withLayout(<Mission />)} />
        <Route path="/news" element={withLayout(<News />)} />
        <Route path="/polls" element={withLayout(<Polls />)} />
        <Route path="/polls/:pollId" element={withLayout(<PollDetail />)} />
        <Route path="/contribute" element={withLayout(<Contribute />)} />
        <Route path="/contact" element={withLayout(<Contact />)} />
        <Route path="/about" element={withLayout(<About />)} />
        <Route path="/how-we-do-it" element={withLayout(<HowWeDoIt />)} />
        <Route path="/bounties" element={withLayout(<Bounties />)} />
        <Route path="/education" element={withLayout(<Education />)} />
        <Route path="/social" element={withLayout(<Social />)} />
        <Route path="/recommendations" element={withLayout(<Recommendations />)} />
        <Route path="/top-choices" element={withLayout(<TopChoices />)} />
        <Route path="/auth" element={withLayout(<Auth />)} />
        <Route path="/register" element={withLayout(<Register />)} />
        <Route path="/profile" element={withLayout(<Profile />)} />
        <Route path="/admin/users" element={withLayout(<AdminUsers />)} />
        <Route path="/auth/success" element={withLayout(<AuthStatus type="success" />)} />
        <Route path="/auth/error" element={withLayout(<AuthStatus type="error" />)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
