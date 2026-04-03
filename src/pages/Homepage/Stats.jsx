import { useEffect, useRef, useState } from "react";

const stats = [
  { target: 100, suffix: "+", label: "Happy Members", },
  { target: 80, suffix: "+", label: "Successful Matches" },
  { target: 30, suffix: "+", label: "Marriages" },
];

const CountUp = ({ target, suffix, start }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let current = 0;
    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    const step = target / steps;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [start, target]);

  return <span>{count}{suffix}</span>;
};

const Stats = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-10 bg-orange-50" ref={ref}>
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <p className="text-5xl font-bold text-orange-500">
              <CountUp target={s.target} suffix={s.suffix} start={visible} />
            </p>
            <p className="text-gray-600 text-lg">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
