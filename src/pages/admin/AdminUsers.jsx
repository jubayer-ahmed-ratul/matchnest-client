import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminUsers, verifyUser, toggleUserActive } from "../../api/admin.api";

const statusStyle = {
  verified: "bg-green-100 text-green-600",
  pending_verification: "bg-yellow-100 text-yellow-600",
  rejected: "bg-red-100 text-red-600",
  incomplete: "bg-gray-100 text-gray-500",
};

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchUsers = async (profileStatus = "") => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ profileStatus, role: "user" });
      setUsers(res.data.users);
      setPage(1);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(filter); }, [filter]);

  const handleVerify = async (id, status) => {
    await verifyUser(id, status);
    setUsers(users.map((u) => u._id === id ? { ...u, profileStatus: status } : u));
  };

  const handleToggle = async (id) => {
    const res = await toggleUserActive(id);
    setUsers(users.map((u) => u._id === id ? { ...u, isActive: res.data.isActive } : u));
  };

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginated = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Users <span className="text-sm text-gray-400 font-normal">({users.length})</span></h2>
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="incomplete">Incomplete</option>
          <option value="pending_verification">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-orange-500" /></div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Active</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-8">No users found.</td></tr>
                )}
                {paginated.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-medium text-gray-800 cursor-pointer hover:text-orange-500 transition"
                      onClick={() => navigate(`/profile/${u._id}`)}>
                      {u.name}
                    </td>
                    <td className="px-5 py-3 text-gray-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusStyle[u.profileStatus] || "bg-gray-100 text-gray-500"}`}>
                        {u.profileStatus?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2 flex-wrap">
                        {u.profileStatus === "pending_verification" && (
                          <>
                            <button onClick={() => handleVerify(u._id, "verified")}
                              className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition">
                              Verify
                            </button>
                            <button onClick={() => handleVerify(u._id, "rejected")}
                              className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition">
                              Reject
                            </button>
                          </>
                        )}
                        <button onClick={() => handleToggle(u._id)}
                          className="text-xs border border-gray-300 hover:border-orange-400 hover:text-orange-500 text-gray-600 px-3 py-1 rounded-lg transition">
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-5">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}
                className="text-sm border border-gray-200 px-4 py-2 rounded-xl hover:border-orange-400 hover:text-orange-500 transition disabled:opacity-40 bg-white">
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`text-sm px-4 py-2 rounded-xl transition ${pg === page ? "bg-orange-500 text-white" : "border border-gray-200 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-500"}`}>
                  {pg}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
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
