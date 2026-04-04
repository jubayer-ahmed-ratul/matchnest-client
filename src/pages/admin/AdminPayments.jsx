import { useEffect, useState } from "react";
import { getPaymentList } from "../../api/payment.api";
import { generateReceipt } from "../../utils/generateReceipt";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getPaymentList()
      .then((res) => setPayments(res.data.payments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? payments : payments.filter((p) => p.status === filter);
  const total = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payments</h2>
        <div className="flex items-center gap-3">
          {/* Filter buttons */}
          <div className="flex gap-2">
            {["all", "paid", "unpaid"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-xl capitalize transition ${filter === f ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-sm">
            Total Revenue: <span className="font-bold text-orange-500">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-orange-500" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No {filter !== "all" ? filter : ""} payments found.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Plan</th>
                <th className="px-5 py-3 text-left">Amount</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 text-gray-700">{p.email}</td>
                  <td className="px-5 py-3 capitalize">
                    <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">{p.plan}</span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-800">${p.amount} {p.currency}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${p.status === "paid" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{p.date}</td>
                  <td className="px-5 py-3">
                    {p.status === "paid" && (
                      <button
                        onClick={() => generateReceipt({ plan: p.plan, amount: p.amount, currency: p.currency, email: p.email, date: p.date, id: p.id })}
                        className="text-xs text-orange-500 hover:text-orange-600 border border-orange-300 hover:border-orange-500 px-3 py-1 rounded-lg transition flex items-center gap-1"
                      >
                        <HiOutlineDocumentText className="w-4 h-4" /> Receipt
                      </button>
                    )}
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
