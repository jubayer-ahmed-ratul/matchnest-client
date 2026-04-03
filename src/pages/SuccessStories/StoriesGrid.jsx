import { useEffect, useState } from "react";
import { getApprovedStories } from "../../api/story.api";

const StoriesGrid = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    getApprovedStories()
      .then((res) => setStories(res.data.stories))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-orange-500" />
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
              className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
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
              className="w-full h-80 object-cover rounded-xl mb-4"
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