import { useState } from "react";
import { searchProfiles } from "../../api/search.api";
import { sendInterest } from "../../api/interest.api";
import { useNavigate } from "react-router-dom";
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineSearch } from "react-icons/hi";

export default function Search() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({ gender: "", religion: "", minAge: "", maxAge: "", city: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sentIds, setSentIds] = useState([]);

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

  const inputClass = "border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800";

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse Profiles</h2>

      {/* Filters */}
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

      {/* Empty state before search */}
      {!searched && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <HiOutlineSearch className="w-16 h-16 text-orange-200 mb-4" />
          <p className="text-gray-400 text-lg">Use the filters above to search for profiles.</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-orange-500" /></div>
      )}

      {/* Results */}
      {searched && !loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.length === 0 && (
              <p className="col-span-3 text-center text-gray-400 py-10">No profiles found. Try different filters.</p>
            )}
            {profiles.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">
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
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.age} yrs • {p.gender} • {p.religion}</p>
                  {p.profession && <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><HiOutlineBriefcase className="w-4 h-4" />{p.profession}</p>}
                  {p.location?.city && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><HiOutlineLocationMarker className="w-3.5 h-3.5" />{p.location.city}</p>}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => navigate(`/profile/${p._id}`)}
                      className="flex-1 text-xs border border-orange-400 text-orange-500 hover:bg-orange-50 py-1.5 rounded-lg transition">
                      View
                    </button>
                    <button disabled={sentIds.includes(p._id)} onClick={() => handleInterest(p._id)}
                      className={`flex-1 text-xs py-1.5 rounded-lg transition font-semibold ${sentIds.includes(p._id) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"}`}>
                      {sentIds.includes(p._id) ? "Sent ✓" : "Interest"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button disabled={page === 1} onClick={() => { setPage(page - 1); fetchProfiles(page - 1); }}
                className="text-sm border border-gray-200 px-4 py-2 rounded-xl hover:border-orange-400 hover:text-orange-500 transition disabled:opacity-40 bg-white">
                ← Prev
              </button>
              <span className="text-sm border border-gray-200 px-4 py-2 rounded-xl text-gray-500 bg-white">{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => { setPage(page + 1); fetchProfiles(page + 1); }}
                className="text-sm border border-gray-200 px-4 py-2 rounded-xl hover:border-orange-400 hover:text-orange-500 transition disabled:opacity-40 bg-white">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
