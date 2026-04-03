import { HiOutlineChatAlt2, HiOutlineSparkles } from "react-icons/hi";

export default function Messages() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <HiOutlineChatAlt2 className="w-16 h-16 text-orange-400 mb-6" />
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Messaging</h2>
      <p className="text-gray-500 text-lg mb-2">This feature is coming soon.</p>
      <p className="text-gray-400 text-sm">Premium & Elite members will be able to send messages directly to their matches.</p>
      <span className="mt-6 bg-orange-100 text-orange-500 text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
        <HiOutlineSparkles className="w-4 h-4" /> Feature Coming Soon
      </span>
    </div>
  );
}

