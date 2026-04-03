import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, List, ArrowLeft } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function EpisodeWatch() {
  const { id, episodeId } = useParams<{ id: string; episodeId: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useLocalStorage<any[]>("ela_history", []);

  const decodedUrl = id ? atob(decodeURIComponent(id)) : "";
  const decodedEpisodeUrl = episodeId ? atob(decodeURIComponent(episodeId)) : "";

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        if (decodedUrl) {
          const data = await api.getAnimeDetails(decodedUrl);
          setAnime(data.animeInfo);
          setEpisodes(data.episodes || []);
          
          // Save to history
          const title = data.animeInfo.title;
          const newHistoryItem = {
            url: decodedUrl,
            title,
            image: data.animeInfo.imageUrl,
            episodeUrl: decodedEpisodeUrl,
            timestamp: Date.now()
          };
          
          setHistory(prev => {
            const filtered = prev.filter(item => item.url !== decodedUrl);
            return [newHistoryItem, ...filtered].slice(0, 20); // Keep last 20
          });
        }
      } catch (error) {
        console.error("Watch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [decodedUrl, decodedEpisodeUrl]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--color-ela-purple)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!anime) return <div className="pt-24 text-center">Anime not found</div>;

  const currentEpIndex = episodes.findIndex(ep => ep.link === decodedEpisodeUrl);
  const hasNext = currentEpIndex > 0; // Episodes are usually sorted newest first
  const hasPrev = currentEpIndex < episodes.length - 1;

  const currentEp = episodes[currentEpIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 pb-20 min-h-screen flex flex-col"
    >
      <div className="container mx-auto px-4 md:px-8 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Main Player Area */}
        <div className="flex-1 flex flex-col">
          <Link 
            to={`/anime/${id}`}
            className="inline-flex items-center gap-2 text-[var(--color-ela-muted)] hover:text-white mb-4 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Details
          </Link>

          {/* Video Player */}
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative shadow-2xl border border-white/5">
            {decodedEpisodeUrl ? (
              <iframe 
                src={decodedEpisodeUrl} 
                className="w-full h-full border-0" 
                allowFullScreen 
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <p className="text-[var(--color-ela-muted)] text-sm max-w-md">
                  No episode selected.
                </p>
              </div>
            )}
          </div>

          {/* Controls & Info */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {anime.title}
              </h1>
              <p className="text-[var(--color-ela-purple-light)] font-medium mt-1">
                {currentEp?.title || "Unknown Episode"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => hasPrev && navigate(`/anime/${id}/episode/${encodeURIComponent(btoa(episodes[currentEpIndex + 1].link))}`)}
                disabled={!hasPrev}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[var(--color-ela-card)] hover:bg-[var(--color-ela-card-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={() => hasNext && navigate(`/anime/${id}/episode/${encodeURIComponent(btoa(episodes[currentEpIndex - 1].link))}`)}
                disabled={!hasNext}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[var(--color-ela-purple)] hover:bg-[var(--color-ela-purple-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Episode List */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col h-[600px]">
          <div className="flex items-center gap-2 mb-4 text-white font-semibold">
            <List className="w-5 h-5 text-[var(--color-ela-purple)]" />
            Episodes ({episodes.length})
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {episodes.map((ep: any, i: number) => {
              const isActive = i === currentEpIndex;
              return (
                <Link
                  key={i}
                  to={`/anime/${id}/episode/${encodeURIComponent(btoa(ep.link))}`}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-[var(--color-ela-purple)]/20 border border-[var(--color-ela-purple)]/50 text-white" 
                      : "bg-[var(--color-ela-card)] hover:bg-[var(--color-ela-card-hover)] text-[var(--color-ela-muted)] hover:text-white"
                  }`}
                >
                  <span className="font-medium text-sm line-clamp-2">{ep.title}</span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-[var(--color-ela-purple)] shrink-0 ml-2" />}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
