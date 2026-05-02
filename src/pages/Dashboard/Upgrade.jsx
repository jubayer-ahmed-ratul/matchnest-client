import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createCheckout } from "../../api/payment.api";
import { FiCheck } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

const plans = [
  {
    key: "free",
    name: "Basic",
    price: "Free",
    color: "border-gray-200",
    badge: null,
    features: [
      "Create & view profile",
      "Browse limited profiles",
      "Send up to 2 interests",
      "Basic search filters",
    ],
    disabled: true,
  },
  {
    key: "premium",
    name: "Premium",
    price: "$19",
    period: "/ month",
    color: "border-orange-500",
    badge: "Most Popular",
    features: [
      "Send up to 5 interests",
      "View verified profiles",
      "Advanced search filters",
      "Smart match suggestions",
      "Chat with matches",
      "See who viewed your profile",
      "Priority support",
    ],
    highlight: true,
  },
  {
    key: "elite",
    name: "Elite",
    price: "$49",
    period: "/ month",
    color: "border-purple-500",
    badge: "Best Value",
    features: [
      "Unlimited interests",
      "Everything in Premium",
      "View contact information",
      "Highest profile priority",
      "VIP matchmaking",
      "Direct contact access",
    ],
  },
];

export default function Upgrade() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(null);
  const currentPlan = user?.membershipPlan || "free";

  const handleUpgrade = async (planKey) => {
    if (planKey === "free" || planKey === currentPlan) return;
    setLoading(planKey);
    try {
      const res = await createCheckout(planKey);
      window.location.href = res.data.url;
    } catch {
      alert("Payment failed. Try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <HiOutlineSparkles className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-800">Upgrade Your Plan</h2>
        </div>
        <p className="text-gray-500">
          You are currently on the <span className="font-semibold text-orange-500 capitalize">{currentPlan}</span> plan.
          Upgrade to unlock more features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.key === currentPlan;
          return (
            <div key={plan.key}
              className={`relative bg-white rounded-2xl border-2 ${plan.highlight ? "border-orange-500 shadow-lg" : "border-gray-200"} p-6 flex flex-col`}>

              {/* Badge */}
              {plan.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${plan.highlight ? "bg-orange-500 text-white" : "bg-purple-500 text-white"}`}>
                  {plan.badge}
                </span>
              )}

              {/* Current plan indicator */}
              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-green-500 text-white">
                  Current Plan
                </span>
              )}

              <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-5">
                <span className="text-3xl font-bold text-orange-500">{plan.price}</span>
                {plan.period && <span className="text-gray-400 text-sm mb-1">{plan.period}</span>}
              </div>

              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <FiCheck className="text-orange-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.key)}
                disabled={isCurrent || plan.disabled || loading === plan.key}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center
                  ${isCurrent
                    ? "bg-green-100 text-green-600 cursor-default"
                    : plan.disabled
                    ? "bg-gray-100 text-gray-400 cursor-default"
                    : plan.highlight
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-800 hover:bg-gray-900 text-white"
                  }`}
              >
                {loading === plan.key
                  ? <span className="loading loading-spinner loading-sm" />
                  : isCurrent
                  ? "Active"
                  : plan.disabled
                  ? "Current"
                  : `Upgrade to ${plan.name}`
                }
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
