import { useEffect, useState } from "react";
import { getAdminStories, updateStoryStatus, deleteStory, adminAddStory } from "../../api/story.api";
import { uploadToImgBB } from "../../api/imgbb";

export default function AdminStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ coupleNames: "", location: "", story: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await getAdminStories(filter);
      setStories(res.data.stories);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchStories(); }, [filter]);

  const handleStatus = async (id, status) => {
    await updateStoryStatus(id, status);
    setStories(stories.filter((s) => s._id !== id));
  };

  const handleDelete = async (id) => {
    await deleteStory(id);
    setStories(stories.filter((s) => s._id !== id));
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAddStory = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageUrl = null;
      if (image) imageUrl = await uploadToImgBB(image);
      const res = await adminAddStory({ ...form, image: imageUrl });
      setShowForm(false);
      setForm({ coupleNames: "", location: "", story: "" });
      setImage(null); setPreview(null);
      if (filter === "approved") setStories([res.data.story, ...stories]);
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Success Stories</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`text-sm font-semibold px-4 py-2 rounded-xl transition ${
            showForm
              ? "border border-gray-300 text-gray-600 hover:bg-gray-50"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {showForm ? "Cancel" : "+ Add Story"}
        </button>
      </div>

      {/* Add Story Form */}
      {showForm && (
        <form onSubmit={handleAddStory} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col gap-4">
          <h3 className="font-semibold text-gray-800">Add New Story</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input name="coupleNames" placeholder="Couple Names"
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.coupleNames} onChange={handleFormChange} required />
            <input name="location" placeholder="Location"
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.location} onChange={handleFormChange} />
          </div>
          <textarea name="story" placeholder="Their story..." rows={4}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            value={form.story} onChange={handleFormChange} required maxLength={1000} />
          <div>
            {preview && <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-xl mb-2" />}
            <label className="text-sm text-orange-500 cursor-pointer hover:underline">
              {preview ? "Change Photo" : "Upload Photo (optional)"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <button type="submit" disabled={submitting}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl transition flex items-center justify-center">
            {submitting ? <span className="loading loading-spinner loading-sm" /> : "Publish Story"}
          </button>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["pending", "approved", "rejected"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-sm font-semibold px-4 py-2 rounded-xl capitalize transition ${
              filter === s
                ? "bg-orange-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
            }`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-orange-500" /></div>
      ) : stories.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No {filter} stories.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {stories.map((s) => (
            <div key={s._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start">
              {s.image && <img src={s.image} alt="" className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />}
              <div className="flex-1">
                <p className="font-bold text-gray-800">{s.coupleNames}</p>
                <p className="text-xs text-gray-400 mb-1">{s.location} • by {s.submittedBy?.name}</p>
                <p className="text-sm text-gray-600 line-clamp-2">"{s.story}"</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {filter !== "approved" && (
                  <button onClick={() => handleStatus(s._id, "approved")}
                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition">
                    Approve
                  </button>
                )}
                {filter !== "rejected" && (
                  <button onClick={() => handleStatus(s._id, "rejected")}
                    className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg transition">
                    Reject
                  </button>
                )}
                <button onClick={() => handleDelete(s._id)}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
