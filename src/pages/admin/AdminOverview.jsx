import { useEffect, useState } from "react";
import { getAdminStats } from "../../api/admin.api";
import { HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineHeart } from "react-icons/hi";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const PIE_COLORS = ["#f97316", "#3b82f6", "#8b5cf6"];

const defaultMonthly = [
  { month: "Nov", users: 0 }, { month: "Dec", users: 0 }, { month: "Jan", users: 0 },
  { month: "Feb", users: 0 }, { month: "Mar", users: 0 }, { month: "Apr", users: 0 },
];

const defaultPlan = [
  { name: "Free", value: 1 }, { name: "Premium", value: 0 }, { name: "Elite", value: 0 },
];

export default function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats().then((r) => setStats(r.data.stats)).catch(() => {});
  }, []);

  const cards = [
    { label: "Total Earnings", value: stats ? `$${stats.totalEarnings?.toFixed(2) || "0.00"}` : "...", icon: HiOutlineCurrencyDollar },
    { label: "Total Users", value: stats?.total ?? "...", icon: HiOutlineUsers },
    { label: "Matches Complete", value: stats?.approvedStories ?? "...", icon: HiOutlineHeart },
  ];

  const monthlyData = stats?.monthlyUsers?.length ? stats.monthlyUsers : defaultMonthly;
  const planData = stats?.planDistribution?.length ? stats.planDistribution : defaultPlan;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 aspect-square">
              <c.icon className="text-orange-500" size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{c.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Monthly User Registrations</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="users" stroke="#f97316" strokeWidth={2.5} dot={{ fill: "#f97316", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Membership Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={planData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {planData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
