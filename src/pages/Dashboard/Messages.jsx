import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyChats, getPendingRequests, respondChatRequest, getMessages, sendMessage } from "../../api/chat.api";
import { HiOutlineChatAlt2, HiOutlineCheck, HiOutlineX, HiOutlinePaperAirplane } from "react-icons/hi";

export default function Messages() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [pending, setPending] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState("chats");
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const fetchChats = () => getMyChats().then((r) => setChats(r.data.chats)).catch(() => {});
  const fetchPending = () => getPendingRequests().then((r) => setPending(r.data.chats)).catch(() => {});

  useEffect(() => {
    fetchChats();
    fetchPending();
  }, []);

  // Polling for new messages
  useEffect(() => {
    if (!selectedChat) return;
    const poll = () => getMessages(selectedChat._id).then((r) => setMessages(r.data.messages)).catch(() => {});
    poll();
    pollRef.current = setInterval(poll, 4000);
    return () => clearInterval(pollRef.current);
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleRespond = async (chatId, status) => {
    await respondChatRequest(chatId, status);
    fetchPending();
    if (status === "accepted") fetchChats();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedChat) return;
    setSending(true);
    try {
      const res = await sendMessage(selectedChat._id, text.trim());
      setMessages((prev) => [...prev, res.data.message]);
      setText("");
      fetchChats();
    } finally { setSending(false); }
  };

  const getOther = (chat) => chat.participants?.find((p) => p._id !== user?.id && p._id !== user?._id);

  return (
    <div className="h-[calc(100vh-120px)] flex gap-4">

      {/* Left panel */}
      <div className="w-full md:w-80 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button onClick={() => setTab("chats")}
            className={`flex-1 py-3 text-sm font-semibold transition ${tab === "chats" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}>
            Chats {chats.length > 0 && <span className="ml-1 text-xs bg-orange-100 text-orange-500 px-1.5 py-0.5 rounded-full">{chats.length}</span>}
          </button>
          <button onClick={() => setTab("pending")}
            className={`flex-1 py-3 text-sm font-semibold transition ${tab === "pending" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}>
            Requests {pending.length > 0 && <span className="ml-1 text-xs bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">{pending.length}</span>}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "chats" && (
            <>
              {chats.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10">
                  <HiOutlineChatAlt2 className="w-10 h-10 text-orange-200 mb-2" />
                  <p className="text-gray-400 text-sm">No active chats yet.</p>
                </div>
              )}
              {chats.map((chat) => {
                const other = getOther(chat);
                const isSelected = selectedChat?._id === chat._id;
                return (
                  <div key={chat._id} onClick={() => setSelectedChat(chat)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-orange-50 transition ${isSelected ? "bg-orange-50" : ""}`}>
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold overflow-hidden flex-shrink-0">
                      {other?.profilePhoto?.url
                        ? <img src={other.profilePhoto.url} className="w-full h-full object-cover" alt="" />
                        : other?.name?.charAt(0)
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{other?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{chat.lastMessage || "No messages yet"}</p>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {tab === "pending" && (
            <>
              {pending.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10">
                  <p className="text-gray-400 text-sm">No pending requests.</p>
                </div>
              )}
              {pending.map((chat) => {
                const requester = chat.participants?.find((p) => p._id === chat.requestedBy?.toString() || p._id?.toString() === chat.requestedBy?.toString());
                const other = getOther(chat);
                const person = requester || other;
                return (
                  <div key={chat._id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold overflow-hidden flex-shrink-0">
                      {person?.profilePhoto?.url
                        ? <img src={person.profilePhoto.url} className="w-full h-full object-cover" alt="" />
                        : person?.name?.charAt(0)
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{person?.name}</p>
                      <p className="text-xs text-gray-400">wants to chat</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleRespond(chat._id, "accepted")}
                        className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition">
                        <HiOutlineCheck className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleRespond(chat._id, "rejected")}
                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
                        <HiOutlineX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Right panel — chat window */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {!selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <HiOutlineChatAlt2 className="w-16 h-16 text-orange-200 mb-4" />
            <p className="text-gray-400">Select a chat to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              {(() => {
                const other = getOther(selectedChat);
                return (
                  <>
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold overflow-hidden">
                      {other?.profilePhoto?.url
                        ? <img src={other.profilePhoto.url} className="w-full h-full object-cover" alt="" />
                        : other?.name?.charAt(0)
                      }
                    </div>
                    <p className="font-semibold text-gray-800">{other?.name}</p>
                  </>
                );
              })()}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2">
              {messages.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-10">No messages yet. Say hi!</p>
              )}
              {messages.map((msg) => {
                const isMe = msg.sender?._id === user?.id || msg.sender?._id === user?._id || msg.sender === user?.id;
                return (
                  <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-orange-500 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="px-4 py-3 border-t border-gray-100 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800"
              />
              <button type="submit" disabled={sending || !text.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition disabled:opacity-50 flex items-center gap-1">
                <HiOutlinePaperAirplane className="w-4 h-4 rotate-90" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
