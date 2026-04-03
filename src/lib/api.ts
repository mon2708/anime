const BASE_URL = "https://api.siputzx.my.id/api/anime/otakudesu";

const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchWithRetry(url, retries - 1);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    if (!json.status) throw new Error("API returned false status");
    return json.data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

export const api = {
  getTrending: async () => {
    const data = await fetchWithRetry(`${BASE_URL}/ongoing`);
    return data;
  },
  getPopular: async () => {
    const data = await fetchWithRetry(`${BASE_URL}/ongoing`);
    return data;
  },
  getRecentEpisodes: async () => {
    const data = await fetchWithRetry(`${BASE_URL}/ongoing`);
    return data;
  },
  searchAnime: async (query: string) => {
    const data = await fetchWithRetry(`${BASE_URL}/search?s=${encodeURIComponent(query)}`);
    return data;
  },
  getAnimeDetails: async (url: string) => {
    const data = await fetchWithRetry(`${BASE_URL}/detail?url=${encodeURIComponent(url)}`);
    return data;
  },
  getAnimeDownloads: async (url: string) => {
    const data = await fetchWithRetry(`${BASE_URL}/download?url=${encodeURIComponent(url)}`);
    return data;
  }
};
