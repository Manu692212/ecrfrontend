import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, FileText, Calendar, CreditCard, GraduationCap } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

interface AdmissionProcessStep {
  step: number;
  title: string;
  description: string;
}

interface AdmissionRequirement {
  category: string;
  items: string[];
}

interface AdmissionImportantDate {
  event: string;
  date: string;
  description: string;
}

interface AdmissionContent {
  title: string;
  subtitle: string;
  description: string;
  process: AdmissionProcessStep[];
  requirements: AdmissionRequirement[];
  importantDates: AdmissionImportantDate[];
  contactInfo: {
    phone: string;
    email: string;
    office: string;
  };
}

const defaultAdmissionContent: AdmissionContent = {
  title: 'Admission Process',
  subtitle: 'Join ECR Academy - Your Gateway to Aviation Excellence',
  description:
    'Our admission process is designed to be simple and transparent. Follow the steps below to begin your journey with us.',
  process: [
    {
      step: 1,
      title: 'Fill Application',
      description: 'Complete the online application form with accurate details and upload required documents.',
    },
    {
      step: 2,
      title: 'Document Verification',
      description: 'Our team will verify your documents and academic records within 2-3 working days.',
    },
    {
      step: 3,
      title: 'Fee Payment',
      description: 'Pay the admission fee online or at our campus. Educational loans available.',
    },
    {
      step: 4,
      title: 'Start Learning',
      description: 'Receive your admission confirmation and begin your journey at ECR Academy.',
    },
  ],
  requirements: [
    {
      category: 'Eligibility Criteria',
      items: [
        'Minimum 50% marks in 10+2 for undergraduate programs',
        'Science stream mandatory for Nursing and Paramedical courses',
        'Age limit varies by course (typically 17-25 years)',
        'Valid ID proof and academic documents required',
        'Entrance exam may be required for certain programs',
      ],
    },
    {
      category: 'Documents Required',
      items: [
        '10th & 12th Mark Sheets',
        'Transfer Certificate',
        'Migration Certificate',
        'Passport Size Photos (8 copies)',
        'Aadhar Card Copy',
        'Income Certificate (for scholarship)',
        'Caste Certificate (if applicable)',
        'Medical Fitness Certificate',
      ],
    },
  ],
  importantDates: [
    {
      event: 'Admission Start',
      date: '2024-01-15',
      description: 'Online applications open',
    },
    {
      event: 'Last Date for Application',
      date: '2024-05-31',
      description: 'Submission deadline',
    },
    {
      event: 'Counseling Begins',
      date: '2024-06-01',
      description: 'Counseling sessions start',
    },
  ],
  contactInfo: {
    phone: '+91 82777 55777',
    email: 'admission@ecredu.com',
    office: 'Admission Office, ECR Campus, Mangalore',
  },
};

const Admission = () => {
  const [admissionContent, setAdmissionContent] = useState<AdmissionContent>(defaultAdmissionContent);

  useEffect(() => {
    const loadAdmissionContent = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('admission');
        const admissionSetting = Array.isArray(settings)
          ? settings.find((s: any) => s.key === 'admission.content' && s.value)
          : null;

        if (admissionSetting?.value) {
          const parsed = JSON.parse(admissionSetting.value as string);
          setAdmissionContent((prev) => ({
            ...prev,
            ...parsed,
            process: Array.isArray(parsed?.process) && parsed.process.length ? parsed.process : prev.process,
            requirements:
              Array.isArray(parsed?.requirements) && parsed.requirements.length ? parsed.requirements : prev.requirements,
            importantDates:
              Array.isArray(parsed?.importantDates) && parsed.importantDates.length
                ? parsed.importantDates
                : prev.importantDates,
            contactInfo: parsed?.contactInfo ? { ...prev.contactInfo, ...parsed.contactInfo } : prev.contactInfo,
          }));
        }
      } catch (error) {
        console.error('Failed to load public admission content', error);
      }
    };

    loadAdmissionContent();
  }, []);

  const formattedProcess = useMemo(() => {
    return admissionContent.process.map((step, index) => ({
      ...step,
      icon: [FileText, Calendar, CreditCard, GraduationCap][index] ?? FileText,
    }));
  }, [admissionContent.process]);

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
              {admissionContent.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8">
              {admissionContent.subtitle}
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
            {formattedProcess.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connector Line */}
                {index < formattedProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0" />
                )}
                <div className="ecr-card text-center relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p className="text-muted-foreground">{admissionContent.contactInfo.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <p className="text-muted-foreground">{admissionContent.contactInfo.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">Office:</span>
                      <p className="text-muted-foreground">{admissionContent.contactInfo.office}</p>
                    </div>
                  </div>
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
            {admissionContent.requirements.slice(0, 2).map((requirement) => (
              <div key={requirement.category} className="bg-card rounded-3xl p-8 border border-border">
                <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                  {requirement.category}
                </h3>
                <div className="space-y-2">
                  {admissionContent.importantDates.map((date) => (
                    <div key={`${date.event}-${date.date}`} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <h5 className="font-medium">{date.event}</h5>
                        <p className="text-sm text-muted-foreground">{date.description}</p>
                      </div>
                      <div className="text-sm font-medium text-primary">
                        {date.date ? new Date(date.date).toLocaleDateString() : 'TBA'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
