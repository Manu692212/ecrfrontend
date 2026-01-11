import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const features = [
  'AICTE, Indian Nursing Council Approved',
  'Mangalore University Affiliated',
  '40+ Acres Campus with Modern Facilities',
  '100% Placement Assistance',
  'International Standard Training',
  'Part-time Job Opportunities on Campus',
];

const CAMPUS_AERIAL_IMAGE = '/images/ecr-campus-aerial.webp';

const AboutSection = () => {
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
              ECR Group of Institutions
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              ECR Group of Institutions, under the ECR Trust, stands out with its innovative approach to education. 
              Spread across approximately 40 acres, the campus is equipped with state-of-the-art facilities and 
              offers a variety of degree courses approved by AICTE, Indian Nursing Council, Mangalore University, 
              and Rajiv Gandhi University of Health Sciences.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Unlike conventional degree courses, ECR emphasizes job-oriented courses like Artificial Intelligence, 
              Data Science, Digital Marketing, Cyber Security, and Airport Management in collaboration with foreign 
              companies. These partnerships ensure students gain practical knowledge directly relevant to their fields.
            </p>

            {/* Features List */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

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
