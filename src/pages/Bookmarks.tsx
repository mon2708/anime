import { Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Bookmark, Clock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export function Bookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<any[]>("ela_bookmarks", []);
  const [history, setHistory] = useLocalStorage<any[]>("ela_history", []);

  const clearHistory = () => {
    // We can't use window.confirm in iframe reliably, so we just clear it directly or use a custom modal.
    // For simplicity, we'll just clear it.
    setHistory([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 min-h-screen container mx-auto px-4 md:px-8"
    >
      <div className="mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3 mb-6">
          <Bookmark className="w-6 h-6 text-[var(--color-ela-purple)]" />
          My Bookmarks
        </h1>
        
        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {bookmarks.map((anime, i) => (
              <motion.div
                key={anime.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative group"
              >
                <Link to={`/anime/${encodeURIComponent(btoa(anime.url))}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--color-ela-card)]">
                    <img
                      src={anime.image}
                      alt={anime.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-white line-clamp-1">{anime.title}</h3>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setBookmarks(bookmarks.filter(b => b.url !== anime.url));
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-[var(--color-ela-card)] text-center border border-white/5">
            <Bookmark className="w-12 h-12 text-[var(--color-ela-muted)] mx-auto mb-3 opacity-50" />
            <p className="text-[var(--color-ela-muted)]">No bookmarks yet.</p>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Clock className="w-6 h-6 text-[var(--color-ela-purple)]" />
            Watch History
          </h1>
          {history.length > 0 && (
            <button 
              onClick={clearHistory}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item, i) => (
              <motion.div
                key={`${item.url}-${item.timestamp}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link 
                  to={`/anime/${encodeURIComponent(btoa(item.url))}/episode/${encodeURIComponent(btoa(item.episodeUrl))}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-[var(--color-ela-card)] hover:bg-[var(--color-ela-card-hover)] transition-colors border border-white/5 group"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-[var(--color-ela-purple-light)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-[var(--color-ela-muted)] mt-1">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-[var(--color-ela-card)] text-center border border-white/5">
            <Clock className="w-12 h-12 text-[var(--color-ela-muted)] mx-auto mb-3 opacity-50" />
            <p className="text-[var(--color-ela-muted)]">No watch history yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
