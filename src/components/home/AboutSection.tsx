import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

interface AboutContent {
  title: string;
  subtitle: string;
  description: string[];
  achievements: string[];
  stats: {
    distinctions: string;
    placement: string;
    ranks: string;
    students: string;
  };
}

const defaultAboutContent: AboutContent = {
  title: 'ECR Group of Institutions',
  subtitle:
    'Reformation through education and charity - shaping the future of Aviation & Logistics',
  description: [
    'ECR Group of Institutions, under the ECR Trust, stands out with its innovative approach to education. Spread across approximately 40 acres, the campus is equipped with state-of-the-art facilities and offers a variety of degree courses approved by AICTE, Indian Nursing Council, Mangalore University, and Rajiv Gandhi University of Health Sciences.',
    'Unlike conventional degree courses, ECR emphasizes job-oriented programs like Artificial Intelligence, Data Science, Digital Marketing, Cyber Security, and Airport Management in collaboration with foreign companies.',
  ],
  achievements: [
    'AICTE, Indian Nursing Council Approved',
    'Mangalore University Affiliated',
    '40+ Acres Campus with Modern Facilities',
    '100% Placement Assistance',
    'International Standard Training',
    'Part-time Job Opportunities on Campus',
  ],
  stats: {
    distinctions: '90%',
    placement: '100%',
    ranks: '4-5',
    students: '1L+',
  },
};

const CAMPUS_AERIAL_IMAGE = '/ecr-campus-aerial.webp';

const AboutSection = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent);

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('about');
        const aboutSetting = Array.isArray(settings)
          ? settings.find((s: any) => s.key === 'about.content' && s.value)
          : null;
        if (aboutSetting?.value) {
          const parsed = JSON.parse(aboutSetting.value as string);
          setAboutContent((prev) => ({
            ...prev,
            ...parsed,
            stats: parsed?.stats ? { ...prev.stats, ...parsed.stats } : prev.stats,
            achievements: Array.isArray(parsed?.achievements) ? parsed.achievements : prev.achievements,
            description: Array.isArray(parsed?.description) ? parsed.description : prev.description,
          }));
        }
      } catch (err) {
        console.error('Failed to load public about content', err);
      }
    };

    loadAboutContent();
  }, []);

  const highlightParagraphs = aboutContent.description.slice(0, 2);
  const features = aboutContent.achievements.slice(0, 6);

  return (
    <section className="ecr-section bg-background">
      <div className="ecr-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_80px_-50px_rgba(15,23,42,0.9)]">
              <div className="aspect-[4/3]">
                <img
                  src={CAMPUS_AERIAL_IMAGE}
                  alt="Aerial view of the ECR Group of Institutions campus"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/30 via-transparent to-white/5" />
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-gradient rounded-2xl -z-10 blur-xl opacity-70" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-card border border-border rounded-xl p-6 shadow-lg max-w-[200px]">
              <div className="font-display text-3xl font-bold text-primary mb-1">90%</div>
              <p className="text-sm text-muted-foreground">Students with Distinctions (2014-2020)</p>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Welcome to ECR
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {aboutContent.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">{aboutContent.subtitle}</p>
            {highlightParagraphs.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}

            {/* Features List */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="rounded-xl border border-border p-4 text-center">
                <p className="font-display text-2xl font-bold text-primary">{aboutContent.stats.distinctions}</p>
                <p className="text-xs text-muted-foreground">Students with Distinctions</p>
              </div>
              <div className="rounded-xl border border-border p-4 text-center">
                <p className="font-display text-2xl font-bold text-primary">{aboutContent.stats.placement}</p>
                <p className="text-xs text-muted-foreground">Placement Assistance</p>
              </div>
            </div>

            <Link to="/about">
              <Button variant="default" size="lg">
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
