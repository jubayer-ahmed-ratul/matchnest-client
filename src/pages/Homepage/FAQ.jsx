import { useState } from "react";

const faqs = [
  {
    q: "How do I create an account on MatchNest?",
    a: "Simply click on 'Sign Up', fill in your basic details like name, email and password, and you're in. You can complete your profile later to get verified.",
  },
  {
    q: "Is my personal information safe on MatchNest?",
    a: "Absolutely. We use advanced encryption and strict privacy policies to ensure your personal data is protected at all times. Only verified members can view full profiles.",
  },
  {
    q: "How does the verification process work?",
    a: "After completing your profile, you can submit your NID or passport for verification. Our admin team reviews it and approves within 24-48 hours.",
  },
  {
    q: "Can I browse profiles without a premium plan?",
    a: "Yes! Basic members can browse profiles and send limited interests. Upgrade to Premium or Elite for unlimited access and advanced features.",
  },
  {
    q: "How do I contact someone I'm interested in?",
    a: "You can send an 'Interest' to any profile. If they accept, you can start a conversation. Premium members get direct chat access.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-10 bg-orange-50">
      <div className="w-11/12 mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Frequently Asked <span className="text-orange-500">Questions</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Got questions? We've got answers. Here are some of the most common ones.
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-semibold text-gray-800">{faq.q}</span>
              <span className={`text-orange-500 text-xl transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
            </button>
            {open === i && (
              <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default FAQ;
