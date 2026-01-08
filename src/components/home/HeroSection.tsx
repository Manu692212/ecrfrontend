import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plane, GraduationCap, Users, Award } from 'lucide-react';
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

const HeroSection = () => {
  const [heroData, setHeroData] = useState<HeroData>(defaultHeroData);

  useEffect(() => {
    const loadPublicHero = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('home');
        const heroSetting = Array.isArray(settings)
          ? settings.find((s: any) => s.key === 'home.hero' && s.value)
          : null;
        if (heroSetting) {
          try {
            const parsed = JSON.parse(heroSetting.value as string);
            setHeroData((prev) => ({ ...prev, ...parsed }));
          } catch (e) {
            console.error('Failed to parse public hero setting JSON', e);
          }
        }
      } catch (err) {
        console.error('Failed to load public hero content', err);
      }
    };

    loadPublicHero();
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center bg-hero-pattern overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-sky/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      {/* Floating Plane Animation */}
      <div className="absolute top-32 right-20 hidden lg:block animate-float">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20">
          <Plane className="w-10 h-10 text-primary rotate-45" />
        </div>
      </div>

      <div className="ecr-container relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{heroData.badgeText}</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            <span className="ecr-gradient-text">{heroData.mainHeading}</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {heroData.subHeading}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/apply">
              <Button variant="hero" size="xl">
                <GraduationCap className="w-5 h-5" />
                {heroData.enrollButtonText}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="heroOutline" size="xl">
                <Users className="w-5 h-5" />
                {heroData.contactButtonText}
              </Button>
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-muted-foreground mb-4">{heroData.trustBadgeText}</p>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-bold text-foreground"
                  style={{ marginLeft: i > 0 ? '-8px' : '0' }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              <span className="text-sm text-muted-foreground ml-2">& many more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path
            d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 67.5C960 75 1056 75 1152 67.5C1248 60 1344 45 1392 37.5L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="hsl(var(--card))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
