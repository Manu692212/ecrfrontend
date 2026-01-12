import { useEffect, useState, useRef } from 'react';
import { Users, BookOpen, GraduationCap, Building2 } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

type IconKey = 'Users' | 'BookOpen' | 'GraduationCap' | 'Building2';

interface StatItem {
  id: string;
  icon: IconKey;
  value: number;
  suffix: string;
  label: string;
}

const DEFAULT_STATS: StatItem[] = [
  { id: '1', icon: 'Users', value: 150, suffix: '+', label: 'Teachers' },
  { id: '2', icon: 'BookOpen', value: 20, suffix: '+', label: 'Courses' },
  { id: '3', icon: 'GraduationCap', value: 7000, suffix: '+', label: 'Students' },
  { id: '4', icon: 'Building2', value: 40, suffix: ' Acres', label: 'Campus' },
];

const ICON_MAP: Record<IconKey, typeof Users> = {
  Users,
  BookOpen,
  GraduationCap,
  Building2,
};

const StatsSection = () => {
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('home');
        const statsSetting = Array.isArray(settings)
          ? settings.find((s: any) => s.key === 'home.stats' && s.value)
          : null;

        if (statsSetting?.value) {
          const parsed = JSON.parse(statsSetting.value as string);
          if (Array.isArray(parsed) && parsed.length) {
            setStats(
              parsed.map((stat, index) => ({
                id: stat.id ?? String(index + 1),
                icon: (stat.icon as IconKey) ?? 'Users',
                value: Number(stat.value) || 0,
                suffix: stat.suffix ?? '',
                label: stat.label ?? '',
              }))
            );
          }
        }
      } catch (error) {
        console.error('Failed to load public stats', error);
      }
    };

    loadStats();
  }, []);

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
          {stats.map((stat, index) => {
            const IconComponent = ICON_MAP[stat.icon] ?? Users;
            return (
              <div
                key={stat.id ?? stat.label}
                className={`text-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <div className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                  <CountUp target={stat.value} isVisible={isVisible} />
                  <span className="text-primary">{stat.suffix}</span>
                </div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            );
          })}
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
