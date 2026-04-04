import { useState, useEffect } from "react";
import { searchProfiles, getSuggestions } from "../../api/search.api";
import { sendInterest } from "../../api/interest.api";
import { useNavigate } from "react-router-dom";
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineSearch, HiOutlineSparkles } from "react-icons/hi";

const inputClass = "border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800";

const ProfileCard = ({ p, onInterest, sentIds, navigate }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">
    <div className="relative w-full" style={{ paddingBottom: "100%" }}>
      {p.profilePhoto?.url
        ? <img src={p.profilePhoto.url} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
        : <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
            <span className="text-5xl font-bold text-orange-300">{p.name?.charAt(0)}</span>
          </div>
      }
      {p.profileStatus === "verified" && (
        <span className="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold shadow">✓ Verified</span>
      )}
      {p.matchScore !== undefined && (
        <span className="absolute top-2 left-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-semibold shadow">
          {p.matchScore}% match
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-bold text-gray-800 mb-1">{p.name}</h3>
      <p className="text-sm text-gray-500">{p.age} yrs • {p.gender} • {p.religion}</p>
      {p.profession && <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><HiOutlineBriefcase className="w-4 h-4" />{p.profession}</p>}
      {p.location?.city && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><HiOutlineLocationMarker className="w-3.5 h-3.5" />{p.location.city}</p>}
      {p.matchBreakdown?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {p.matchBreakdown.map((b) => (
            <span key={b} className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full border border-orange-100">{b}</span>
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-3">
        <button onClick={() => navigate(`/profile/${p._id}`)}
          className="flex-1 text-xs border border-orange-400 text-orange-500 hover:bg-orange-50 py-1.5 rounded-lg transition">
          View
        </button>
        <button disabled={sentIds.includes(p._id)} onClick={() => onInterest(p._id)}
          className={`flex-1 text-xs py-1.5 rounded-lg transition font-semibold ${sentIds.includes(p._id) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"}`}>
          {sentIds.includes(p._id) ? "Sent ✓" : "Interest"}
        </button>
      </div>
    </div>
  </div>
);

export default function Search() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("suggestions");
  const [profiles, setProfiles] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({ gender: "", religion: "", minAge: "", maxAge: "", city: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sentIds, setSentIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    getSuggestions()
      .then((res) => setSuggestions(res.data.suggestions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fetchProfiles = async (currentPage = 1) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = { ...filters, page: currentPage, limit: 9 };
      const res = await searchProfiles(params);
      setProfiles(res.data.users);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProfiles(1);
  };

  const handleInterest = async (id) => {
    try {
      await sendInterest(id);
      setSentIds([...sentIds, id]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send interest");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse Profiles</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("suggestions")}
          className={`flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl transition ${tab === "suggestions" ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"}`}>
          <HiOutlineSparkles className="w-4 h-4" /> Suggestions
        </button>
        <button onClick={() => setTab("search")}
          className={`flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl transition ${tab === "search" ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"}`}>
          <HiOutlineSearch className="w-4 h-4" /> Search
        </button>
      </div>

      {/* Suggestions Tab */}
      {tab === "suggestions" && (
        <>
          {loading ? (
            <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-orange-500" /></div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <HiOutlineSparkles className="w-12 h-12 mx-auto mb-3 text-orange-200" />
              <p>No suggestions yet. Complete your profile for better matches.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((p) => (
                <ProfileCard key={p._id} p={p} onInterest={handleInterest} sentIds={sentIds} navigate={navigate} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Search Tab */}
      {tab === "search" && (
        <>
          <form onSubmit={handleFilter} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 flex flex-wrap gap-3 items-end">
            <select className={inputClass} value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
              <option value="">Any Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select className={inputClass} value={filters.religion} onChange={(e) => setFilters({ ...filters, religion: e.target.value })}>
              <option value="">Any Religion</option>
              <option value="islam">Islam</option>
              <option value="hinduism">Hinduism</option>
              <option value="christianity">Christianity</option>
              <option value="buddhism">Buddhism</option>
            </select>
            <input type="number" placeholder="Min Age" className={`${inputClass} w-24`} value={filters.minAge} onChange={(e) => setFilters({ ...filters, minAge: e.target.value })} />
            <input type="number" placeholder="Max Age" className={`${inputClass} w-24`} value={filters.maxAge} onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })} />
            <input type="text" placeholder="City" className={`${inputClass} w-32`} value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition flex items-center gap-2">
              <HiOutlineSearch className="w-4 h-4" /> Search
            </button>
          </form>

          {!searched && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <HiOutlineSearch className="w-16 h-16 text-orange-200 mb-4" />
              <p className="text-gray-400 text-lg">Use the filters above to search for profiles.</p>
            </div>
          )}

          {loading && <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-orange-500" /></div>}

          {searched && !loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.length === 0 && <p className="col-span-3 text-center text-gray-400 py-10">No profiles found.</p>}
                {profiles.map((p) => (
                  <ProfileCard key={p._id} p={p} onInterest={handleInterest} sentIds={sentIds} navigate={navigate} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button disabled={page === 1} onClick={() => { setPage(page - 1); fetchProfiles(page - 1); }}
                    className="text-sm border border-gray-200 px-4 py-2 rounded-xl hover:border-orange-400 hover:text-orange-500 transition disabled:opacity-40 bg-white">← Prev</button>
                  <span className="text-sm border border-gray-200 px-4 py-2 rounded-xl text-gray-500 bg-white">{page} / {totalPages}</span>
                  <button disabled={page === totalPages} onClick={() => { setPage(page + 1); fetchProfiles(page + 1); }}
                    className="text-sm border border-gray-200 px-4 py-2 rounded-xl hover:border-orange-400 hover:text-orange-500 transition disabled:opacity-40 bg-white">Next →</button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
