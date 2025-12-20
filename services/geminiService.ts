// Lightweight wrapper / safe stub for calling a Gemini-like recommendations API.
// Production usage should proxy requests through a server-side endpoint that
// holds the real API key (never call third-party model APIs directly from the
// browser with a secret key).

export interface Recommendation {
  id: string;
  score?: number;
  title: string;
  reason?: string;
}

export const getRecommendations = async (userId?: string, context?: string): Promise<Recommendation[]> => {
  // If there is no configured key, return a deterministic mock so UI remains usable.
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    // Mock recommendations — replace with server implementation that calls Gemini.
    return [
      { id: 'r-1', score: 0.98, title: "14k Gold Diamond Studs", reason: 'Popular with similar shoppers' },
      { id: 'r-2', score: 0.92, title: "Pearl Drop Necklace", reason: 'Customers who viewed this also viewed' },
      { id: 'r-3', score: 0.89, title: "Sapphire Cocktail Ring", reason: 'Trending in your area' }
    ];
  }

  // Production note: call your backend endpoint which in turn calls Gemini API.
  // Example:
  // const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations`, {
  //   method: 'POST', headers: {'Content-Type':'application/json'},
  //   body: JSON.stringify({ userId, context })
  // });
  // return await res.json();

  // Placeholder fallback until server implementation is available.
  return [
    { id: 'r-1', score: 0.95, title: "AI-recommended Item A", reason: 'AI suggestion' },
    { id: 'r-2', score: 0.9, title: "AI-recommended Item B", reason: 'AI suggestion' }
  ];
};

export default { getRecommendations };
