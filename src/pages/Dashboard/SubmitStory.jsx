import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitStory } from "../../api/story.api";
import { uploadToImgBB } from "../../api/imgbb";

const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

export default function SubmitStory() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ coupleNames: "", location: "", story: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    setLoading(true);
    try {
      let imageUrl = null;
      if (image) imageUrl = await uploadToImgBB(image);
      await submitStory({ ...form, image: imageUrl });
      setMessage("Story submitted! It will appear after admin approval.");
      setForm({ coupleNames: "", location: "", story: "" });
      setImage(null); setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Share Your Story</h2>
        <p className="text-gray-500 text-sm mb-6">Found your match on MatchNest? Inspire others.</p>
        {message && <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="coupleNames" placeholder="Couple Names" className={inp} value={form.coupleNames} onChange={handleChange} required />
          <input name="location" placeholder="Location" className={inp} value={form.location} onChange={handleChange} />
          <textarea name="story" placeholder="Share your love story... (max 1000 characters)"
            className={`${inp} resize-none`} rows={5} maxLength={1000} value={form.story} onChange={handleChange} required />
          <div>
            {preview && <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl mb-2" />}
            <label className="cursor-pointer text-sm text-orange-500 hover:underline">
              {preview ? "Change Photo" : "Upload a Photo (optional)"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center">
            {loading ? <span className="loading loading-spinner" /> : "Submit Story"}
          </button>
          <button type="button" className="text-sm text-gray-400 hover:text-gray-600 text-center" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
