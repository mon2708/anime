import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { motion } from "framer-motion";

interface AnimeCardProps {
  anime: any;
  index?: number;
}

export function AnimeCard({ anime, index = 0 }: AnimeCardProps) {
  const title = anime.title;
  const image = anime.image || anime.imageUrl;
  const rating = anime.rating || anime.score;
  const genres = typeof anime.genres === 'string' ? anime.genres : anime.type;
  const animeId = btoa(anime.link);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/anime/${encodeURIComponent(animeId)}`} className="group block relative">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--color-ela-card)]">
          <img
            src={image}
            alt={title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-[var(--color-ela-purple)]/90 flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(155,130,195,0.5)] transform scale-75 group-hover:scale-100 transition-transform">
              <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
            </div>
          </div>

          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
            <span className="text-xs font-medium text-white">{rating || "N/A"}</span>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-[var(--color-ela-purple-light)] transition-colors">
            {title}
          </h3>
          <p className="text-xs text-[var(--color-ela-muted)] mt-1 line-clamp-1">
            {genres || "Unknown Genre"}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-xl bg-[var(--color-ela-card)] w-full" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-[var(--color-ela-card)] rounded w-3/4" />
        <div className="h-3 bg-[var(--color-ela-card)] rounded w-1/2" />
      </div>
    </div>
  );
}
