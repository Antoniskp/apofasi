import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuBars from "./components/MenuBars.jsx";
import Home from "./pages/Home.jsx";
import News from "./pages/News.jsx";
import Polls from "./pages/Polls.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="page-shell">
        <MenuBars />
        <main className="page-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/polls" element={<Polls />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

