import { useEffect, useState, useCallback } from "react";
import { getApprovedStories } from "../../api/story.api";

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden shadow-lg animate-pulse">
    <div className="w-full h-80 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-2">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  </div>
);

const StoriesGrid = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  const fetchStories = useCallback(async (retries = 2) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApprovedStories();
      setStories(res.data.stories);
    } catch (err) {
      if (retries > 0) {
        // Retry after a short delay (handles Vercel cold-start timeouts)
        await new Promise((r) => setTimeout(r, 1500));
        return fetchStories(retries - 1);
      }
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  if (loading)
    return (
      <section className="pb-16 w-11/12 mx-auto">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-80 mx-auto mb-4 animate-pulse" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );

  if (error)
    return (
      <div className="text-center py-16">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => fetchStories()}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-xl transition"
        >
          Try Again
        </button>
      </div>
    );

  if (stories.length === 0)
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-xl">No success stories yet.</p>
        <p className="text-sm mt-2">Be the first to share yours!</p>
      </div>
    );

  return (
    <section className="pb-16 w-11/12 mx-auto">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Voice of <span className="text-orange-500">Happy Couple</span>
        </h2>
        <p className="text-gray-500 mt-3 text-lg">
          Stories straight from the hearts of our members.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((s) => (
          <div
            key={s._id}
            onClick={() => setSelectedStory(s)}
            className="relative cursor-pointer rounded-2xl overflow-hidden shadow-lg group"
          >
            {/* Image */}
            <img
              src={s.image}
              alt={s.coupleNames}
              className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

            {/* Name */}
            <div className="absolute bottom-4 left-4">
              <h3 className="text-white text-xl font-bold">
                {s.coupleNames}
              </h3>
              {s.location && (
                <p className="text-orange-400 text-sm">{s.location}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={selectedStory.image}
              alt={selectedStory.coupleNames}
              className="w-full h-96 object-cover rounded-xl mb-4"
            />

            {/* Content */}
            <h3 className="text-2xl font-bold text-orange-500 text-center">
              {selectedStory.coupleNames}
            </h3>

            {selectedStory.location && (
              <p className="text-center text-gray-500 mb-3">
                 {selectedStory.location}
              </p>
            )}

            <p className="text-gray-700 text-center leading-relaxed">
              "{selectedStory.story}"
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default StoriesGrid;
