import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, FileText, Calendar, CreditCard, GraduationCap } from 'lucide-react';

const admissionSteps = [
  {
    icon: FileText,
    title: 'Fill Application',
    description: 'Complete the online application form with accurate details and upload required documents.',
  },
  {
    icon: Calendar,
    title: 'Document Verification',
    description: 'Our team will verify your documents and academic records within 2-3 working days.',
  },
  {
    icon: CreditCard,
    title: 'Fee Payment',
    description: 'Pay the admission fee online or at our campus. Educational loans available.',
  },
  {
    icon: GraduationCap,
    title: 'Start Learning',
    description: 'Receive your admission confirmation and begin your journey at ECR Academy.',
  },
];

const eligibility = [
  'Minimum 50% marks in 10+2 for undergraduate programs',
  'Science stream mandatory for Nursing and Paramedical courses',
  'Age limit varies by course (typically 17-25 years)',
  'Valid ID proof and academic documents required',
  'Entrance exam may be required for certain programs',
];

const documents = [
  '10th & 12th Mark Sheets',
  'Transfer Certificate',
  'Migration Certificate',
  'Passport Size Photos (8 copies)',
  'Aadhar Card Copy',
  'Income Certificate (for scholarship)',
  'Caste Certificate (if applicable)',
  'Medical Fitness Certificate',
];

const Admission = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="ecr-section bg-hero-pattern">
        <div className="ecr-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Admissions Open
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Begin Your Journey Today
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8">
              Join India's leading Aviation & Healthcare institute. Simple admission process with educational loan support.
            </p>
            <Link to="/apply">
              <Button variant="hero" size="lg">
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="ecr-section bg-card">
        <div className="ecr-container">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
            Admission Process
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {admissionSteps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connector Line */}
                {index < admissionSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0" />
                )}
                <div className="ecr-card text-center relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="w-14 h-14 mx-auto mb-4 mt-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility & Documents */}
      <section className="ecr-section bg-background">
        <div className="ecr-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Eligibility */}
            <div className="bg-card rounded-3xl p-8 border border-border">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                Eligibility Criteria
              </h3>
              <ul className="space-y-4">
                {eligibility.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documents */}
            <div className="bg-card rounded-3xl p-8 border border-border">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                Required Documents
              </h3>
              <ul className="grid grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <li key={doc} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarship Info */}
      <section className="ecr-section bg-gold-gradient">
        <div className="ecr-container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Scholarships & Financial Aid
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-3xl mx-auto">
            ECR offers guaranteed scholarships for meritorious students. Educational loans available through 
            T-COLLS recognition. Get up to 100% scholarship based on your academic performance.
          </p>
          <Link to="/contact">
            <Button variant="secondary" size="lg">
              Contact Admission Office
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Admission;
