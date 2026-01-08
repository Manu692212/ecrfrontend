import { useEffect, useState, useRef } from 'react';
import { Users, BookOpen, GraduationCap, Building2 } from 'lucide-react';

const stats = [
  { icon: Users, value: 150, suffix: '+', label: 'Teachers' },
  { icon: BookOpen, value: 20, suffix: '+', label: 'Courses' },
  { icon: GraduationCap, value: 7000, suffix: '+', label: 'Students' },
  { icon: Building2, value: 40, suffix: ' Acres', label: 'Campus' },
];

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-card">
      <div className="ecr-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                <CountUp target={stat.value} isVisible={isVisible} />
                <span className="text-primary">{stat.suffix}</span>
              </div>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CountUp = ({ target, isVisible }: { target: number; isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return <span>{count.toLocaleString()}</span>;
};

export default StatsSection;
