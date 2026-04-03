import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getWhoViewed } from "../../api/search.api";
import { HiOutlineSearch, HiOutlineHeart, HiOutlineUser, HiOutlineEye, HiOutlineLockClosed } from "react-icons/hi";

const planBadge = {
  free: { label: "Free", color: "bg-gray-100 text-gray-600" },
  premium: { label: "⭐ Premium", color: "bg-blue-100 text-blue-600" },
  elite: { label: "🔥 Elite", color: "bg-purple-100 text-purple-600" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewers, setViewers] = useState([]);

  const plan = user?.membershipPlan || "free";
  const badge = planBadge[plan];
  const canViewWhoViewed = plan === "premium" || plan === "elite";

  useEffect(() => {
    if (canViewWhoViewed) {
      getWhoViewed().then((res) => setViewers(res.data.viewers || [])).catch(() => {});
    }
  }, [canViewWhoViewed]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card bg-white shadow p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-semibold">Welcome back, {user?.name} 👋</h2>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
        </div>
        <p className="text-sm text-gray-400 mb-3">{user?.email}</p>
        <div className={`badge ${user?.profileStatus === "verified" ? "badge-success" : "badge-warning"} mb-4`}>
          {user?.profileStatus}
        </div>

        {user?.profileStatus === "incomplete" && (
          <div className="alert alert-warning">
            <span>Complete your profile to get verified and start connecting.</span>
            <button className="btn btn-sm btn-warning ml-2" onClick={() => navigate("/profile")}>Complete Profile</button>
          </div>
        )}
        {user?.profileStatus === "pending_verification" && (
          <div className="alert alert-info mt-2">
            <span>Your verification is under review. We'll notify you soon.</span>
          </div>
        )}

        {plan === "free" && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700 flex items-center justify-between">
            <span>Upgrade to Premium for unlimited interests & more features.</span>
            <Link to="/#membership" className="font-semibold underline ml-2">Upgrade</Link>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition" onClick={() => navigate("/search")}>
          <HiOutlineSearch className="w-8 h-8 text-orange-500 mb-2" />
          <h3 className="font-semibold text-gray-800">Browse Profiles</h3>
          <p className="text-sm text-gray-400">Find your match</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition" onClick={() => navigate("/interests")}>
          <HiOutlineHeart className="w-8 h-8 text-orange-500 mb-2" />
          <h3 className="font-semibold text-gray-800">Interests</h3>
          <p className="text-sm text-gray-400">Manage your connections</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition" onClick={() => navigate("/profile")}>
          <HiOutlineUser className="w-8 h-8 text-orange-500 mb-2" />
          <h3 className="font-semibold text-gray-800">My Profile</h3>
          <p className="text-sm text-gray-400">Update your details</p>
        </div>
      </div>

      {/* Who viewed my profile */}
      {canViewWhoViewed && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><HiOutlineEye className="w-5 h-5 text-orange-500" /> Who Viewed Your Profile</h3>
          {viewers.length === 0 ? (
            <p className="text-sm text-gray-400">No one has viewed your profile yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {viewers.map((v) => (
                <div key={v._id} onClick={() => navigate(`/profile/${v._id}`)} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 cursor-pointer hover:bg-orange-50 transition">
                  {v.profilePhoto?.url ? (
                    <img src={v.profilePhoto.url} className="w-8 h-8 rounded-full object-cover" alt={v.name} />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-sm font-bold text-orange-500">
                      {v.name?.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm text-gray-700">{v.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!canViewWhoViewed && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6 text-center flex items-center justify-center gap-2">
          <HiOutlineLockClosed className="w-4 h-4 text-gray-400" />
          <p className="text-gray-400 text-sm">Upgrade to Premium to see who viewed your profile.</p>
        </div>
      )}
    </div>
  );
}
