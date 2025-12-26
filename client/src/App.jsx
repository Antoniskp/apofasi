import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuBars from "./components/MenuBars.jsx";
import Home from "./pages/Home.jsx";
import News from "./pages/News.jsx";
import Polls from "./pages/Polls.jsx";
import AuthStatus from "./pages/AuthStatus.jsx";
import Mission from "./pages/Mission.jsx";
import Auth from "./pages/Auth.jsx";


function App() {
  return (
    <BrowserRouter>
      <div className="page-shell">
        <MenuBars />
        <main className="page-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/news" element={<News />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/success" element={<AuthStatus type="success" />} />
            <Route path="/auth/error" element={<AuthStatus type="error" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

