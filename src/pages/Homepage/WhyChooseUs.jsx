import React, { useEffect, useRef, useState } from 'react';
import { FiLock, FiCheckCircle, FiUserCheck, FiHeadphones } from 'react-icons/fi';

const chooseUsData = [
  {
    icon: <FiLock className="text-orange-500 text-5xl mb-4" />,
    title: "Safe & Secure System",
    desc: "Your privacy is protected with advanced security technology.",
    fromX: -80,
    delay: '0ms',
  },
  {
    icon: <FiCheckCircle className="text-orange-500 text-5xl mb-4" />,
    title: "Smart Matchmaking",
    desc: "AI-powered matchmaking helps you find the most compatible profiles.",
    fromX: -80,
    delay: '150ms',
  },
  {
    icon: <FiUserCheck className="text-orange-500 text-5xl mb-4" />,
    title: "Verified Profiles",
    desc: "Every profile is checked carefully to reduce fake or misleading accounts.",
    fromX: 80,
    delay: '150ms',
  },
  {
    icon: <FiHeadphones className="text-orange-500 text-5xl mb-4" />,
    title: "24/7 Support",
    desc: "Our support team is always available for your assistance.",
    fromX: 80,
    delay: '0ms',
  },
];

const WhyChooseUs = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-10 w-11/12 mx-auto" ref={sectionRef}>

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          <span className="text-orange-500">Why</span> Choose Us
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We offer the most reliable, trusted, and user-friendly matrimonial experience with unique features designed to make your journey smooth and successful.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {chooseUsData.map((item, index) => (
          <div
            key={index}
            style={{
              transition: 'opacity 900ms ease-out, transform 900ms ease-out',
              transitionDelay: visible ? item.delay : '0ms',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : `translateX(${item.fromX}px)`,
            }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
          >
            {item.icon}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
