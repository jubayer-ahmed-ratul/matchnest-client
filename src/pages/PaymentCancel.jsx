import { useNavigate } from "react-router-dom";
import { HiOutlineXCircle } from "react-icons/hi";

export default function PaymentCancel() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center bg-white rounded-2xl shadow-lg p-10 max-w-md">
        <HiOutlineXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h2>
        <p className="text-gray-500 mb-6">Your payment was not completed. You can try again anytime.</p>
        <button onClick={() => navigate("/")} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition">
          Back to Home
        </button>
      </div>
    </div>
  );
}
