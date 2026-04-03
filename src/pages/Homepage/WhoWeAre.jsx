import React, { useEffect, useRef, useState } from 'react';
import { FiShield, FiGlobe, FiUsers } from 'react-icons/fi';

const Card = ({ Icon, title, description, visible, delay, fromX, fromY }) => {
    return (
        <div
            style={{
                transition: 'opacity 1000ms ease-out, transform 1000ms ease-out',
                transitionDelay: visible ? delay : '0ms',
                opacity: visible ? 1 : 0,
                transform: visible
                    ? 'translateX(0) translateY(0)'
                    : `translateX(${fromX}px) translateY(${fromY}px)`,
            }}
            className="
                bg-white p-6 rounded-xl shadow-lg hover:shadow-xl 
                border border-gray-200
                flex flex-col items-center justify-center 
                h-full min-h-[280px] text-center
            "
        >
            <Icon className="text-orange-500 text-5xl mb-4" />
            <h3 className="text-xl font-semibold text-orange-500 mb-3">
                {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
};

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
            { threshold: 0.2 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const cardsData = [
        {
            Icon: FiShield,
            title: "Trusted Platform",
            description: "Millions trust us to connect them with compatible matches. Your journey is safe and private with us.",
            fromX: -80,
            fromY: 0,
            delay: '0ms',
        },
        {
            Icon: FiGlobe,
            title: "Global Community",
            description: "Connect with people from around the world. Find someone who shares your values and dreams.",
            fromX: 0,
            fromY: 80,
            delay: '200ms',
        },
        {
            Icon: FiUsers,
            title: "Personalized Matches",
            description: "Our smart matching system helps you discover profiles that truly align with your preferences.",
            fromX: 80,
            fromY: 0,
            delay: '400ms',
        },
    ];

    return (
        <section
            id="who-we-are"
            className="py-16 w-11/12 mx-auto overflow-hidden"
            ref={sectionRef}
        >
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    <span className="text-orange-500">Who</span> We Are
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    We are a dedicated matrimony platform connecting hearts across the world.
                    Our mission is to make meaningful connections easier, safer, and enjoyable.
                </p>
            </div>

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