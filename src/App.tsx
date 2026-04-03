import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { AnimeDetail } from "./pages/AnimeDetail";
import { EpisodeWatch } from "./pages/EpisodeWatch";
import { Bookmarks } from "./pages/Bookmarks";

function AnimatedRoutes() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/anime/:id/episode/:episodeId" element={<EpisodeWatch />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <footer className="py-8 border-t border-white/5 bg-[var(--color-ela-darker)] text-center">
          <p className="text-[var(--color-ela-muted)] text-sm">
            &copy; {new Date().getFullYear()} .Ela Anime Streaming. Inspired by Elaina.
          </p>
        </footer>
      </div>
    </Router>
  );
}
