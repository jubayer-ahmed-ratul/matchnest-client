import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPayment } from "../api/payment.api";
import { useAuth } from "../context/AuthContext";
import { generateReceipt } from "../utils/generateReceipt";
import { HiOutlineCheckCircle, HiOutlineDownload } from "react-icons/hi";

const planDetails = {
  premium: { name: "Premium Plan", price: "$19.00" },
  elite: { name: "Elite Plan", price: "$49.00" },
};

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const plan = params.get("plan");

  useEffect(() => {
    if (plan) {
      confirmPayment(plan).catch(() => {});
    }
  }, [plan]);

  const handleDownload = () => {
    const amount = plan === "premium" ? "19.00" : "49.00";
    generateReceipt({
      plan,
      amount,
      currency: "USD",
      email: user?.email,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white rounded-2xl shadow-lg p-10 max-w-md w-full mx-4">
        <HiOutlineCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-2">
          Your <span className="text-orange-500 font-semibold capitalize">{plan}</span> plan is now active.
        </p>
        {planDetails[plan] && (
          <p className="text-xs text-gray-400 mb-6">{planDetails[plan].price} — {planDetails[plan].name}</p>
        )}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownload}
            className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold px-8 py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            <HiOutlineDownload className="w-5 h-5" /> Download Receipt
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
