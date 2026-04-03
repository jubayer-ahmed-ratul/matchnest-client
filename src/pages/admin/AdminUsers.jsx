import { useEffect, useState } from "react";
import { getAdminUsers, verifyUser, toggleUserActive } from "../../api/admin.api";

const statusStyle = {
  verified: "bg-green-100 text-green-600",
  pending_verification: "bg-yellow-100 text-yellow-600",
  rejected: "bg-red-100 text-red-600",
  incomplete: "bg-gray-100 text-gray-500",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchUsers = async (profileStatus = "") => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ profileStatus, role: "user" });
      setUsers(res.data.users);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
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
              {users.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400 py-8">No users found.</td></tr>
              )}
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-medium text-gray-800">{u.name}</td>
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
      )}
    </div>
  );
}
