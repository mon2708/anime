import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { AnimeCard, SkeletonCard } from "../components/AnimeCard";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let data;
        if (query === "trending") {
          data = await api.getTrending();
        } else if (query === "popular") {
          data = await api.getPopular();
        } else if (query) {
          data = await api.searchAnime(query);
        } else {
          data = [];
        }
        setResults(data || []);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 min-h-screen container mx-auto px-4 md:px-8"
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <SearchIcon className="w-6 h-6 text-[var(--color-ela-purple)]" />
          {query === "trending"
            ? "Trending Anime"
            : query === "popular"
            ? "Popular Anime"
            : query
            ? `Search Results for "${query}"`
            : "Search Anime"}
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {results.map((anime, i) => (
            <AnimeCard key={anime.link || i} anime={anime} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-[var(--color-ela-card)] rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="w-10 h-10 text-[var(--color-ela-muted)]" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
          <p className="text-[var(--color-ela-muted)]">
            Try adjusting your search query to find what you're looking for.
          </p>
        </div>
      )}
    </motion.div>
  );
}
