import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { HeroBanner } from "../components/HeroBanner";
import { AnimeCard, SkeletonCard } from "../components/AnimeCard";
import { motion } from "framer-motion";

export function Home() {
  const [trending, setTrending] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, popularData, recentData] = await Promise.all([
          api.getTrending(),
          api.getPopular(),
          api.getRecentEpisodes(),
        ]);
        setTrending(trendingData);
        setPopular(popularData);
        setRecent(recentData);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const Section = ({ title, data }: { title: string; data: any[] }) => (
    <section className="py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white relative inline-block">
            {title}
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[var(--color-ela-purple)] rounded-full" />
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : data.slice(0, 10).map((anime, i) => (
                <AnimeCard key={anime.link || i} anime={anime} index={i} />
              ))}
        </div>
      </div>
    </section>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      <HeroBanner anime={trending[0]} />
      
      <div className="mt-8 space-y-4">
        <Section title="Trending Now" data={trending.slice(1)} />
        <Section title="Popular Anime" data={popular} />
        <Section title="Top Airing" data={recent} />
      </div>
    </motion.div>
  );
}
