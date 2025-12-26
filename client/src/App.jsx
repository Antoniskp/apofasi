import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import News from "./pages/News.jsx";
import Polls from "./pages/Polls.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/polls" element={<Polls />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

