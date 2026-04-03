import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { Play, Star, Bookmark, BookmarkCheck, Calendar, Clock, Tv } from "lucide-react";
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function AnimeDetail() {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useLocalStorage<any[]>("ela_bookmarks", []);

  const decodedUrl = id ? atob(decodeURIComponent(id)) : "";
  const isBookmarked = bookmarks.some((b) => b.url === decodedUrl);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        if (decodedUrl) {
          const data = await api.getAnimeDetails(decodedUrl);
          setAnime(data.animeInfo);
          setEpisodes(data.episodes || []);
        }
      } catch (error) {
        console.error("Detail error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [decodedUrl]);

  const toggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks(bookmarks.filter((b) => b.url !== decodedUrl));
    } else if (anime) {
      setBookmarks([...bookmarks, {
        url: decodedUrl,
        title: anime.title,
        image: anime.imageUrl,
        score: anime.score,
        genres: anime.genres
      }]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--color-ela-purple)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!anime) return <div className="pt-24 text-center">Anime not found</div>;

  const title = anime.title;
  const image = anime.imageUrl;
  const banner = image;

  const displayEpisodes = episodes;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {/* Banner */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img src={banner} alt={title} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ela-dark)] via-[var(--color-ela-dark)]/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 mx-auto md:mx-0 w-48 md:w-64">
            <img 
              src={image} 
              alt={title} 
              referrerPolicy="no-referrer"
              className="w-full rounded-xl shadow-2xl border border-white/10"
            />
            <button 
              onClick={toggleBookmark}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-lg bg-[var(--color-ela-card)] hover:bg-[var(--color-ela-card-hover)] transition-colors text-white font-medium"
            >
              {isBookmarked ? (
                <><BookmarkCheck className="w-5 h-5 text-[var(--color-ela-purple)]" /> Saved</>
              ) : (
                <><Bookmark className="w-5 h-5" /> Bookmark</>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-12">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {anime.genres?.split(',').map((g: string, i: number) => (
                <span key={i} className="px-3 py-1 text-xs font-medium bg-[var(--color-ela-card)] text-[var(--color-ela-purple-light)] rounded-full">
                  {g.trim()}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--color-ela-muted)] mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="text-white font-medium">{anime.score || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tv className="w-4 h-4" />
                <span>{anime.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{anime.releaseDate || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{anime.duration}</span>
              </div>
            </div>

            <p className="text-[var(--color-ela-muted)] leading-relaxed mb-8">
              {anime.synopsis || "No synopsis available."}
            </p>
          </div>
        </div>

        {/* Episodes Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Play className="w-5 h-5 text-[var(--color-ela-purple)]" />
            Episodes
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayEpisodes.map((ep: any, i: number) => {
              const epId = btoa(ep.link);
              return (
              <Link
                key={i}
                to={`/anime/${id}/episode/${encodeURIComponent(epId)}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-ela-card)] hover:bg-[var(--color-ela-card-hover)] transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--color-ela-darker)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-ela-purple)] transition-colors">
                  <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-medium text-white truncate">
                    {ep.title}
                  </h4>
                  <p className="text-xs text-[var(--color-ela-muted)] truncate mt-1">
                    {ep.date}
                  </p>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
