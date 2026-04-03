import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import banner1 from '../../assets/images/banner/banner1.png';
import banner2 from '../../assets/images/banner/banner2.jpg';

const slides = [
  {
    image: banner1,
    heading: "Connecting hearts, creating stories",
    paragraph: "Where every match is a new beginning",
  },
  {
    image: banner2,
    heading: "Find your perfect match",
    paragraph: "Millions are waiting to meet someone like you",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[500px] sm:h-[550px] md:h-[600px] overflow-hidden">
      {/* Background images */}
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${slides[current].image})` }}
        />
      </AnimatePresence>

      {/* White overlay */}
      <div className="absolute inset-0 bg-white opacity-40" />

      {/* Text content */}
      <div className="relative flex flex-col items-center justify-center h-full text-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold ">
              {slides[current].heading}
            </h1>
            <p className="text-lg sm:text-xl font-semibold ">
              {slides[current].paragraph}
            </p>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => document.getElementById('who-we-are')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-8 px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition text-lg"
        >
          Explore
        </button>

        {/* Dots */}
        <div className="flex gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition ${i === current ? "bg-orange-500" : "bg-white opacity-50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
