import { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { sendMessage } from "../../api/message.api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendMessage(form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-5 pb-20 mt-20 w-11/12 mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          <span className="text-orange-500">Contact</span> Us
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Have questions? We'd love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">

        {/* Left: Info + Social + Map */}
        <div className="flex flex-col gap-6">
          {/* Contact details */}
          <div className="flex flex-col gap-4">
            {[
              { icon: <FaMapMarkerAlt />, label: "Address", value: "Tongi, Gazipur, Dhaka, Bangladesh" },
              { icon: <FaPhone />, label: "Phone", value: "+880 1712-345678" },
              { icon: <FaEnvelope />, label: "Email", value: "support@matchnest.com" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.label}</p>
                  <p className="text-gray-500 text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social */}
          <div>
            <p className="font-semibold text-gray-800 mb-3">Follow Us</p>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><FaFacebook /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><FaYoutube /></a>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-64">
            <iframe
              title="Tongi Gazipur Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14589.6!2d90.3981!3d23.8903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c5a0f0f0f0f0%3A0xabc123!2sTongi%2C+Gazipur%2C+Bangladesh!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h2>

          {sent && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              Message sent! We'll get back to you soon.
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input name="name" type="text" placeholder="Your Name"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800"
                value={form.name} onChange={handleChange} required />
              <input name="email" type="email" placeholder="Your Email"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800"
                value={form.email} onChange={handleChange} required />
            </div>
            <input name="subject" type="text" placeholder="Subject"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800"
              value={form.subject} onChange={handleChange} required />
            <textarea name="message" placeholder="Your Message" rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800 resize-none"
              value={form.message} onChange={handleChange} required />
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center">
              {loading ? <span className="loading loading-spinner" /> : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
