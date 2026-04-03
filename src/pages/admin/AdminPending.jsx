import { useEffect, useState } from "react";
import { getAdminUsers, verifyUser } from "../../api/admin.api";

export default function AdminPending() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ profileStatus: "pending_verification" });
      setUsers(res.data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleVerify = async (id, status) => {
    await verifyUser(id, status);
    setUsers(users.filter((u) => u._id !== id));
    setSelected(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pending Verification</h2>

      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg" /></div>
      ) : (
        <div className="flex flex-col gap-4">
          {users.length === 0 && <p className="text-center text-gray-400">No pending verifications.</p>}
          {users.map((u) => (
            <div key={u._id} className="card bg-base-100 shadow p-5 flex flex-row justify-between items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-4">
                {u.profilePhoto?.url && (
                  <img src={u.profilePhoto.url} alt={u.name} className="w-12 h-12 rounded-full object-cover border" />
                )}
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-400">{u.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{u.age} yrs • {u.gender} • {u.religion} • {u.profession}</p>
                  <p className="text-xs text-gray-400">{u.location?.city}, {u.location?.country}</p>
                  {u.verificationDocs?.docType && (
                    <span className="badge badge-outline badge-sm mt-1 capitalize">{u.verificationDocs.docType.replace("_", " ")}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button className="btn btn-outline btn-sm" onClick={() => setSelected(u)}>View ID</button>
                <button className="btn btn-success btn-sm" onClick={() => handleVerify(u._id, "verified")}>✓ Verify</button>
                <button className="btn btn-error btn-sm" onClick={() => handleVerify(u._id, "rejected")}>✗ Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{selected.name} — ID Verification</h3>
              <button className="text-gray-400 hover:text-gray-600 text-xl" onClick={() => setSelected(null)}>✕</button>
            </div>

            <p className="text-sm text-gray-500 mb-3 capitalize">
              Document: {selected.verificationDocs?.docType?.replace("_", " ") || "N/A"}
            </p>

            <div className="flex flex-col gap-3">
              {selected.verificationDocs?.docImage?.url ? (
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {selected.verificationDocs.docType === "nid" ? "Front Side" : "Document"}
                  </p>
                  <img
                    src={selected.verificationDocs.docImage.url}
                    alt="ID Front"
                    className="w-full rounded-lg border object-contain max-h-52"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-400">No document uploaded.</p>
              )}

              {selected.verificationDocs?.docImageBack?.url && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Back Side</p>
                  <img
                    src={selected.verificationDocs.docImageBack.url}
                    alt="ID Back"
                    className="w-full rounded-lg border object-contain max-h-52"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <button className="btn btn-success flex-1" onClick={() => handleVerify(selected._id, "verified")}>✓ Verify</button>
              <button className="btn btn-error flex-1" onClick={() => handleVerify(selected._id, "rejected")}>✗ Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
