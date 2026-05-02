import React, { useEffect, useRef, useState } from 'react';
import { FiShield, FiGlobe, FiUsers } from 'react-icons/fi';

const Card = ({ Icon, title, description, visible, delay, fromX, fromY }) => (
  <div
    style={{
      transition: 'opacity 700ms ease-out, transform 700ms ease-out',
      transitionDelay: visible ? delay : '0ms',
      opacity: visible ? 1 : 0,
      transform: visible
        ? 'translateX(0) translateY(0) scale(1)'
        : `translateX(${fromX}px) translateY(${fromY}px) scale(0.95)`,
    }}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center h-full min-h-[280px] text-center border-b border-l border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <Icon className="text-orange-500 text-5xl mb-4" />
    <h3 className="text-xl font-semibold text-orange-500 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed dark:text-gray-300">{description}</p>
  </div>
);

const WhoWeAre = () => {
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
      { threshold: 0.3, rootMargin: "0px 0px -100px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const cardsData = [
    {
      Icon: FiShield,
      title: "Trusted Platform",
      description: "Millions trust us to connect them with compatible matches. Your journey is safe and private with us.",
      fromX: -60,
      fromY: 0,
      delay: '150ms',
    },
    {
      Icon: FiGlobe,
      title: "Global Community",
      description: "Connect with people from around the world. Find someone who shares your values and dreams.",
      fromX: 0,
      fromY: 60,
      delay: '300ms',
    },
    {
      Icon: FiUsers,
      title: "Personalized Matches",
      description: "Our smart matching system helps you discover profiles that truly align with your preferences.",
      fromX: 60,
      fromY: 0,
      delay: '450ms',
    },
  ];

  return (
    <section
      id="who-we-are"
      className="py-20 w-11/12 mx-auto overflow-hidden"
      ref={sectionRef}
    >
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          <span className="text-orange-500">Who</span> We Are
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          We are a dedicated matrimony platform connecting hearts across the world.
          Our mission is to make meaningful connections easier, safer, and enjoyable.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {cardsData.map((card, index) => (
          <Card
            key={index}
            Icon={card.Icon}
            title={card.title}
            description={card.description}
            visible={visible}
            delay={card.delay}
            fromX={card.fromX}
            fromY={card.fromY}
          />
        ))}
      </div>
    </section>
  );
};

export default WhoWeAre;
