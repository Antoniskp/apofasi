import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuBars from "./components/MenuBars.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import News from "./pages/News.jsx";
import Polls from "./pages/Polls.jsx";
import NewPoll from "./pages/NewPoll.jsx";
import PollDetail from "./pages/PollDetail.jsx";
import PollStatistics from "./pages/PollStatistics.jsx";
import MyPolls from "./pages/MyPolls.jsx";
import Articles from "./pages/Articles.jsx";
import NewArticle from "./pages/NewArticle.jsx";
import EditArticle from "./pages/EditArticle.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import MyArticles from "./pages/MyArticles.jsx";
import AuthStatus from "./pages/AuthStatus.jsx";
import Mission from "./pages/Mission.jsx";
import Auth from "./pages/Auth.jsx";
import Contribute from "./pages/Contribute.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import Users from "./pages/Users.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Social from "./pages/Social.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import TopChoices from "./pages/TopChoices.jsx";
import HowWeDoIt from "./pages/HowWeDoIt.jsx";
import Bounties from "./pages/Bounties.jsx";
import Education from "./pages/Education.jsx";
import Economics from "./pages/Economics.jsx";
import GovernmentApps from "./pages/GovernmentApps.jsx";
import GovernmentStatistics from "./pages/GovernmentStatistics.jsx";
import GreekLawSystem from "./pages/GreekLawSystem.jsx";
import Documentation from "./pages/Documentation.jsx";
import CommunityGuidelines from "./pages/CommunityGuidelines.jsx";
import MuiExamples from "./pages/MuiExamples.jsx";


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
        <Route path="/articles" element={withLayout(<Articles />)} />
        <Route path="/articles/new" element={withLayout(<NewArticle />)} />
        <Route path="/articles/my-articles" element={withLayout(<MyArticles />)} />
        <Route path="/articles/:articleId" element={withLayout(<ArticleDetail />)} />
        <Route path="/articles/:articleId/edit" element={withLayout(<EditArticle />)} />
        <Route path="/polls" element={withLayout(<Polls />)} />
        <Route path="/polls/new" element={withLayout(<NewPoll />)} />
        <Route path="/polls/my-polls" element={withLayout(<MyPolls />)} />
        <Route path="/polls/:pollId" element={withLayout(<PollDetail />)} />
        <Route path="/polls/:pollId/statistics" element={withLayout(<PollStatistics />)} />
        <Route path="/contribute" element={withLayout(<Contribute />)} />
        <Route path="/contact" element={withLayout(<Contact />)} />
        <Route path="/about" element={withLayout(<About />)} />
        <Route path="/how-we-do-it" element={withLayout(<HowWeDoIt />)} />
        <Route path="/bounties" element={withLayout(<Bounties />)} />
        <Route path="/education" element={withLayout(<Education />)} />
        <Route path="/education/economics" element={withLayout(<Economics />)} />
        <Route
          path="/education/government-apps"
          element={withLayout(<GovernmentApps />)}
        />
        <Route
          path="/education/government-statistics"
          element={withLayout(<GovernmentStatistics />)}
        />
        <Route
          path="/education/greek-law-system"
          element={withLayout(<GreekLawSystem />)}
        />
        <Route path="/social" element={withLayout(<Social />)} />
        <Route path="/recommendations" element={withLayout(<Recommendations />)} />
        <Route path="/top-choices" element={withLayout(<TopChoices />)} />
        <Route path="/documentation" element={withLayout(<Documentation />)} />
        <Route path="/community-guidelines" element={withLayout(<CommunityGuidelines />)} />
        <Route path="/mui-examples" element={withLayout(<MuiExamples />)} />
        <Route path="/auth" element={withLayout(<Auth />)} />
        <Route path="/register" element={withLayout(<Register />)} />
        <Route path="/profile" element={withLayout(<Profile />)} />
        <Route path="/users" element={withLayout(<Users />)} />
        <Route path="/admin/users" element={withLayout(<AdminUsers />)} />
        <Route path="/auth/success" element={withLayout(<AuthStatus type="success" />)} />
        <Route path="/auth/error" element={withLayout(<AuthStatus type="error" />)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
