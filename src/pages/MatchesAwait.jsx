import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { searchProfiles } from "../api/search.api";
import cyclingImg from "../assets/images/site/cycling.jpg";
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineLockClosed, HiOutlineHeart } from "react-icons/hi";

const GuestView = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    localStorage.setItem("redirectAfterLogin", "/matches");
    navigate("/login");
  };
  return (
    <section className="py-20 mt-5 md:mt-10 w-11/12 mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Your <span className="text-orange-500">Match</span> is Waiting
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Login to access thousands of profiles and connect with people who share your values and dreams.
          </p>
          <div className="flex gap-4">
            <button onClick={handleLogin} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition">
              Login
            </button>
            <Link to="/register" className="border border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold px-8 py-3 rounded-xl transition">
              Sign Up
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 w-full">
          <img src={cyclingImg} alt="Matches Await" className="w-full rounded-2xl shadow-lg object-cover" />
        </div>
      </div>
    </section>
  );
};

const ProfileCard = ({ user, onViewProfile }) => (
  <div className="bg-white rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
    
    {/* Image Wrapper with whitespace */}
    <div className="bg-gray-50 rounded-2xl p-2">
      <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: "100%" }}>
        {user.profilePhoto?.url ? (
          <img
            src={user.profilePhoto.url}
            alt={user.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
            <span className="text-4xl font-bold text-orange-300">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>

    {/* Content area */}
    <div className="flex flex-col flex-1 px-3 pt-3 pb-2">
      {/* Name + Verified badge row */}
      <div className="flex items-center gap-2 mb-0.5">
        <h3 className="font-semibold text-black text-base truncate">{user.name}</h3>
        {user.profileStatus === "verified" && (
          <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Age row below name */}
      {user.age && (
        <span className="text-xl text-black mb-1">{user.age} yrs</span>
      )}

      {/* Profession */}
      {user.profession && (
        <p className="text-s text-black  flex items-center gap-1 truncate">
          <HiOutlineBriefcase className="w-3 h-3" /> {user.profession}
        </p>
      )}

      {/* Location */}
      {user.location?.city && (
        <p className="text-black  flex items-center gap-1 mt-0.5 truncate">
          <HiOutlineLocationMarker className="w-3 h-3" /> {user.location.city}
        </p>
      )}

      {/* Spacer pushes button to bottom */}
      <div className="flex-1"></div>

      <button
        onClick={() => onViewProfile(user._id)}
        className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-xl transition-all"
      >
        View Profile
      </button>
    </div>
  </div>
);

const defaultFilters = { minAge: "", maxAge: "", religion: "", city: "", gender: "" };

// Returns opposite gender for auto-filtering
const getOppositeGender = (gender) => {
  if (gender === "male") return "female";
  if (gender === "female") return "male";
  return "";
};

export default function MatchesAwait() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState(false);

  const handleViewProfile = (id) => {
    if (user?.profileStatus === "verified") {
      navigate(`/profile/${id}`);
    } else {
      setToast(true);
      setTimeout(() => setToast(false), 3500);
    }
  };

  const fetchProfiles = (params = {}, pg = 1) => {
    setLoading(true);
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ""));
    searchProfiles({ limit: 12, page: pg, ...clean })
      .then((res) => {
        setProfiles(res.data.users);
        setTotalPages(res.data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) return;
    const initialGender = getOppositeGender(user?.gender);
    const initialFilters = { ...defaultFilters, gender: initialGender };
    setFilters(initialFilters);
    fetchProfiles(initialFilters, 1);
  }, [user]);
  const handleApply = () => { setPage(1); fetchProfiles(filters, 1); };
  const handleReset = () => {
    const resetFilters = { ...defaultFilters, gender: getOppositeGender(user?.gender) };
    setFilters(resetFilters);
    setPage(1);
    fetchProfiles(resetFilters, 1);
  };
  const handlePageChange = (pg) => {
    setPage(pg);
    fetchProfiles(filters, pg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!user) return <GuestView />;

  // Deactivated account
  if (user?.isActive === false) {
    return (
      <div className="py-8 mt-16 w-11/12 mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl shadow p-10 max-w-md w-full text-center border border-red-100">
          <p className="text-3xl mb-3">🚫</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Account Suspended</h2>
          <p className="text-gray-500 text-sm mb-5">Your account has been deactivated. You cannot browse matches at this time. Please contact our support team to resolve this.</p>
          <a href="mailto:support@matchnest.com"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl transition">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 mt-16 w-11/12 mx-auto">
      {/* No gender banner — removed, blur overlay handles this */}
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white border border-orange-200 shadow-xl rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[320px]">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0">
            <HiOutlineLockClosed className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-gray-800 font-semibold text-sm">Profile Locked</p>
            <p className="text-gray-500 text-xs mt-0.5">Complete and verify your profile to access user details.</p>
          </div>
          <button
            onClick={() => { setToast(false); navigate("/profile"); }}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex-shrink-0"
          >
            Go to Profile
          </button>
        </div>
      )}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Matches <span className="text-orange-500">Await</span>
        </h1>
        <p className="text-gray-500 text-lg">Discover people who could be your perfect match.</p>
      </div>

      {/* Filter + Profiles — wrapped for overlay */}
      <div className="relative">

        {/* Overlay when gender not set */}
        {!user.gender && (
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-16 pointer-events-none">
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl px-10 py-8 text-center max-w-sm mx-4 border border-orange-100">
              <HiOutlineHeart className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Your matches are waiting</h3>
              <p className="text-gray-500 text-sm mb-5">Complete your profile and set your gender to unlock all matches and filters.</p>
              <button onClick={() => navigate("/profile")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition w-full">
                Complete Profile
              </button>
            </div>
          </div>
        )}

        {/* Blurred content when no gender */}
        <div className={!user.gender ? "blur-sm pointer-events-none select-none" : ""}>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl shadow p-5 mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Min Age</label>
              <input type="number" placeholder="18" min="18" max="80" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800"
                value={filters.minAge} onChange={(e) => setFilters({ ...filters, minAge: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Max Age</label>
              <input type="number" placeholder="60" min="18" max="80" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800"
                value={filters.maxAge} onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Gender</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800" value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Religion</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800" value={filters.religion}
                onChange={(e) => setFilters({ ...filters, religion: e.target.value })}>
                <option value="">Any</option>
                <option value="islam">Islam</option>
                <option value="hinduism">Hinduism</option>
                <option value="christianity">Christianity</option>
                <option value="buddhism">Buddhism</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">City / Area</label>
              <input type="text" placeholder="e.g. Dhaka" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800"
                value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleApply} className="w-full bg-orange-500 text-white hover:bg-orange-600 text-sm font-semibold px-3 py-2 rounded-xl transition">Filter</button>
              <button onClick={handleReset} className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold px-3 py-2 rounded-xl transition">Reset</button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-orange-500" />
            </div>
          ) : profiles.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No profiles found.</p>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {profiles.map((p) => <ProfileCard key={p._id} user={p} onViewProfile={handleViewProfile} />)}
              </div>
              <div className="flex justify-center items-center gap-2 mt-10">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}
                  className="text-sm border border-gray-200 px-4 py-2 rounded-xl hover:border-orange-400 hover:text-orange-500 transition disabled:opacity-40 bg-white text-gray-600">← Prev</button>
                {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((pg) => (
                  <button key={pg} onClick={() => handlePageChange(pg)}
                    className={`text-sm px-4 py-2 rounded-xl transition ${pg === page ? "bg-orange-500 text-white" : "border border-gray-200 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-500"}`}>
                    {pg}
                  </button>
                ))}
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages || totalPages <= 1}
                  className="text-sm border border-gray-200 px-4 py-2 rounded-xl hover:border-orange-400 hover:text-orange-500 transition disabled:opacity-40 bg-white text-gray-600">Next →</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
