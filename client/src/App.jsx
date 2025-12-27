import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuBars from "./components/MenuBars.jsx";
import Home from "./pages/Home.jsx";
import News from "./pages/News.jsx";
import Polls from "./pages/Polls.jsx";
import AuthStatus from "./pages/AuthStatus.jsx";
import Mission from "./pages/Mission.jsx";
import Auth from "./pages/Auth.jsx";


const withLayout = (page) => (
  <div className="page-shell">
    <MenuBars />
    <main className="page-main">{page}</main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={withLayout(<Home />)} />
        <Route path="/mission" element={withLayout(<Mission />)} />
        <Route path="/news" element={withLayout(<News />)} />
        <Route path="/polls" element={withLayout(<Polls />)} />
        <Route path="/auth" element={withLayout(<Auth />)} />
        <Route path="/auth/success" element={withLayout(<AuthStatus type="success" />)} />
        <Route path="/auth/error" element={withLayout(<AuthStatus type="error" />)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

