import { 
  Plane, 
  Users, 
  Building2, 
  Banknote, 
  Award, 
  GraduationCap, 
  BookOpen, 
  FlaskConical 
} from 'lucide-react';

const features = [
  { icon: Plane, title: "India's Biggest Aviation College" },
  { icon: Users, title: 'Experienced & Professional Staff' },
  { icon: Building2, title: 'Campus Placement by Top Companies' },
  { icon: Banknote, title: 'Educational Loan Available' },
  { icon: Award, title: '100% Campus Placement' },
  { icon: GraduationCap, title: 'Guaranteed Scholarships' },
  { icon: BookOpen, title: 'Best Books & Libraries' },
  { icon: FlaskConical, title: 'Well Equipped Lab Facilities' },
];

const WhyChooseSection = () => {
  return (
    <section className="ecr-section bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />

      <div className="ecr-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
            Our Advantages
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why Choose ECR?
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover the unique features of ECR Group of Institutions. Explore what sets us apart 
            from other institutions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group text-center p-6 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-[0_4px_30px_hsl(40_55%_58%/0.1)]"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-medium text-foreground text-sm md:text-base">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 rounded-3xl bg-gold-gradient p-8 md:p-12 text-center relative overflow-hidden">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-background rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-background rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Do you want to attend the top aviation school in Karnataka?
            </h3>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              ECR Group of Institutions offers you the right instruction and experience. 
              We have successfully trained more than a thousand motivated students for local 
              and international professions in expanding and dynamic industries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
