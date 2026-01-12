import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plane, GraduationCap, Users, Award } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-image.webp';
import { settingsAPI } from '@/lib/api';

interface HeroData {
  mainHeading: string;
  subHeading: string;
  badgeText: string;
  enrollButtonText: string;
  contactButtonText: string;
  trustBadgeText: string;
}

const defaultHeroData: HeroData = {
  mainHeading: "Welcome to India's Largest Aviation College",
  subHeading:
    'ECR Academy for Professional Training and Placements - A premier institute dedicated to shaping the future of Aviation & Logistics.',
  badgeText: 'University Approved Institution',
  enrollButtonText: 'Enroll Now',
  contactButtonText: 'Contact Us',
  trustBadgeText: 'Trusted by 1,00,000+ Students',
};

interface Stat {
  id: string;
  icon: string;
  value: number;
  suffix: string;
  label: string;
}

const HeroSection = () => {
  const [heroData, setHeroData] = useState<HeroData>(defaultHeroData);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const loadHomeSettings = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('home');
        if (Array.isArray(settings)) {
          const heroSetting = settings.find((s: any) => s.key === 'home.hero' && s.value);
          if (heroSetting?.value) {
            try {
              const parsed = JSON.parse(heroSetting.value as string);
              setHeroData((prev) => ({ ...prev, ...parsed }));
            } catch (e) {
              console.error('Failed to parse public hero setting JSON', e);
            }
          }

          const statsSetting = settings.find((s: any) => s.key === 'home.stats' && s.value);
          if (statsSetting?.value) {
            try {
              const parsedStats = JSON.parse(statsSetting.value as string);
              if (Array.isArray(parsedStats)) {
                setStats(
                  parsedStats.map((stat, index) => ({
                    id: stat.id ?? String(index + 1),
                    icon: stat.icon ?? 'Users',
                    value: Number(stat.value) || 0,
                    suffix: stat.suffix ?? '',
                    label: stat.label ?? '',
                  }))
                );
              }
            } catch (e) {
              console.error('Failed to parse public stats setting JSON', e);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load public home settings', err);
      }
    };

    loadHomeSettings();
  }, []);

  const highlightedStats = stats.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-card">
      <div className="absolute top-8 right-16 hidden lg:block animate-float">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20">
          <Plane className="w-10 h-10 text-primary rotate-45" />
        </div>
      </div>

      <div className="ecr-container relative z-10 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{heroData.badgeText}</span>
            </div>

            <div className="space-y-6">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                {heroData.mainHeading}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {heroData.subHeading}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/apply">
                <Button size="lg" className="gap-2">
                  <GraduationCap className="w-5 h-5" />
                  {heroData.enrollButtonText}
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="w-5 h-5" />
                  {heroData.contactButtonText}
                </Button>
              </Link>
            </div>

            {highlightedStats.length > 0 && (
              <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-3">
                {highlightedStats.map((stat) => (
                  <div key={stat.id} className="rounded-2xl border border-border bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="font-display text-3xl font-bold text-foreground">
                      {stat.value.toLocaleString()}
                      <span className="text-primary">{stat.suffix}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-background flex items-center justify-center text-sm font-semibold text-primary">
                  A
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-background flex items-center justify-center text-sm font-semibold text-primary">
                  B
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-background flex items-center justify-center text-sm font-semibold text-primary">
                  C
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{heroData.trustBadgeText}</p>
                <p className="text-xs text-muted-foreground">Success stories from ECR graduates</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-[32px] overflow-hidden bg-slate-900/80 shadow-2xl">
              <img
                src={heroImage}
                alt="Students in aviation training"
                className="h-full w-full object-cover opacity-95"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-white/10" />
            </div>
            <div className="absolute -bottom-6 -left-6 max-w-xs rounded-3xl border border-border bg-background p-6 shadow-xl">
              <p className="text-sm text-muted-foreground">Why students choose ECR</p>
              <p className="font-display text-3xl font-bold text-foreground">100% Placement</p>
              <p className="text-xs text-muted-foreground">Dedicated career support & industry partnerships</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path
            d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 67.5C960 75 1056 75 1152 67.5C1248 60 1344 45 1392 37.5L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
