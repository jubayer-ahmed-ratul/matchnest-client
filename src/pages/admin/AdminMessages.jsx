import { useEffect, useState } from "react";
import { getMessages, markAsRead, deleteMessage } from "../../api/message.api";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMessages()
      .then((res) => setMessages(res.data.messages))
      .finally(() => setLoading(false));
  }, []);

  const handleRead = async (id) => {
    await markAsRead(id);
    setMessages(messages.map((m) => m._id === id ? { ...m, isRead: true } : m));
  };

  const handleDelete = async (id) => {
    await deleteMessage(id);
    setMessages(messages.filter((m) => m._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const handleSelect = (msg) => {
    setSelected(msg);
    if (!msg.isRead) handleRead(msg._id);
  };

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">Messages</h2>
        {unread > 0 && <span className="badge badge-error">{unread} unread</span>}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg" /></div>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-400">No messages yet.</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Message list */}
          <div className="flex flex-col gap-2">
            {messages.map((m) => (
              <div
                key={m._id}
                onClick={() => handleSelect(m)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selected?._id === m._id ? "border-orange-400 bg-orange-50" :
                  !m.isRead ? "border-orange-200 bg-white font-semibold" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm ${!m.isRead ? "font-bold text-gray-800" : "text-gray-700"}`}>{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{m.subject || "No subject"}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {!m.isRead && <span className="badge badge-error badge-xs">New</span>}
                    <p className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message detail */}
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">{selected.name}</h3>
                  <p className="text-sm text-gray-400">{selected.email}</p>
                </div>
                <button className="btn btn-error btn-sm" onClick={() => handleDelete(selected._id)}>Delete</button>
              </div>
              {selected.subject && <p className="text-sm font-semibold text-gray-700 mb-3">Subject: {selected.subject}</p>}
              <p className="text-gray-600 text-sm leading-relaxed">{selected.message}</p>
              <p className="text-xs text-gray-400 mt-4">{new Date(selected.createdAt).toLocaleString()}</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm p-10">
              Select a message to read
            </div>
          )}
        </div>
      )}
    </div>
  );
}
