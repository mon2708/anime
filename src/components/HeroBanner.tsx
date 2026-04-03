import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { motion } from "framer-motion";

interface HeroBannerProps {
  anime: any;
}

export function HeroBanner({ anime }: HeroBannerProps) {
  if (!anime) return <div className="h-[70vh] w-full bg-[var(--color-ela-card)] animate-pulse" />;

  const title = anime.title;
  const image = anime.image || anime.imageUrl;
  const synopsis = anime.synopsis || "No synopsis available.";
  const animeId = btoa(anime.link);

  return (
    <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ela-darker)] via-[var(--color-ela-darker)]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ela-dark)] via-transparent to-transparent" />
      </div>

      <div className="relative h-full container mx-auto px-4 md:px-8 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-semibold bg-[var(--color-ela-purple)]/20 text-[var(--color-ela-purple-light)] rounded-full border border-[var(--color-ela-purple)]/30">
              Trending #1
            </span>
            <span className="text-sm text-[var(--color-ela-muted)]">{anime.type || anime.genres || "Ongoing"}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          
          <p className="text-[var(--color-ela-muted)] text-sm md:text-base mb-8 line-clamp-3 md:line-clamp-none max-w-xl">
            {synopsis}
          </p>

          <div className="flex items-center gap-4">
            <Link
              to={`/anime/${encodeURIComponent(animeId)}`}
              className="flex items-center gap-2 bg-[var(--color-ela-purple)] hover:bg-[var(--color-ela-purple-dark)] text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(155,130,195,0.3)]"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Watch Now
            </Link>
            <Link
              to={`/anime/${encodeURIComponent(animeId)}`}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-all backdrop-blur-sm"
            >
              <Info className="w-5 h-5" />
              Details
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
