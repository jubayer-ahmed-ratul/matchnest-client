import { useState } from "react";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // demo — just show success
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="pb-16 w-11/12 mx-auto">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h2>

        {sent && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            Message sent successfully! We'll get back to you soon.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <input
            name="subject"
            type="text"
            placeholder="Subject"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.subject}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
