import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReceivedInterests, getSentInterests, respondToInterest, cancelInterest } from "../../api/interest.api";

export default function Interests() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);

  useEffect(() => {
    getReceivedInterests().then((r) => setReceived(r.data.interests));
    getSentInterests().then((r) => setSent(r.data.interests));
  }, []);

  const handleRespond = async (id, status) => {
    await respondToInterest(id, status);
    setReceived(received.map((i) => i._id === id ? { ...i, status } : i));
  };

  const handleCancel = async (id) => {
    await cancelInterest(id);
    setSent(sent.filter((i) => i._id !== id));
  };

  const statusStyle = {
    accepted: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-500",
    pending: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Interests</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["received", "sent"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-sm font-semibold px-5 py-2 rounded-xl capitalize transition ${
              tab === t ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "received" && (
        <div className="flex flex-col gap-3">
          {received.length === 0 && <p className="text-center text-gray-400 py-8">No interests received.</p>}
          {received.map((i) => (
            <div key={i._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex justify-between items-center">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${i.sender?._id}`)}>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold overflow-hidden">
                  {i.sender?.profilePhoto?.url
                    ? <img src={i.sender.profilePhoto.url} className="w-full h-full object-cover" alt="" />
                    : i.sender?.name?.charAt(0)
                  }
                </div>
                <div>
                  <p className="font-semibold text-gray-800 hover:text-orange-500 transition">{i.sender?.name}</p>
                  <p className="text-xs text-gray-400">{i.sender?.age} yrs • {i.sender?.religion} • {i.sender?.profession}</p>
                  {i.note && <p className="text-xs text-gray-500 mt-1 italic">"{i.note}"</p>}
                </div>
              </div>
              {i.status === "pending" ? (
                <div className="flex gap-2">
                  <button onClick={() => handleRespond(i._id, "accepted")}
                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition">Accept</button>
                  <button onClick={() => handleRespond(i._id, "rejected")}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition">Reject</button>
                </div>
              ) : (
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyle[i.status]}`}>{i.status}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "sent" && (
        <div className="flex flex-col gap-3">
          {sent.length === 0 && <p className="text-center text-gray-400 py-8">No interests sent.</p>}
          {sent.map((i) => (
            <div key={i._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex justify-between items-center">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${i.receiver?._id}`)}>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold overflow-hidden">
                  {i.receiver?.profilePhoto?.url
                    ? <img src={i.receiver.profilePhoto.url} className="w-full h-full object-cover" alt="" />
                    : i.receiver?.name?.charAt(0)
                  }
                </div>
                <div>
                  <p className="font-semibold text-gray-800 hover:text-orange-500 transition">{i.receiver?.name}</p>
                  <p className="text-xs text-gray-400">{i.receiver?.age} yrs • {i.receiver?.religion} • {i.receiver?.profession}</p>
                </div>
              </div>
              {i.status === "pending" ? (
                <button onClick={() => handleCancel(i._id)}
                  className="text-xs border border-red-300 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">Cancel</button>
              ) : (
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyle[i.status]}`}>{i.status}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
