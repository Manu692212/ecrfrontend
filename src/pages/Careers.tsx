import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Briefcase, Clock, MapPin, ArrowRight, Users, Award, TrendingUp } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  deadline: string;
  active: boolean;
}

const DEFAULT_JOBS: JobOpening[] = [
  {
    id: '1',
    title: 'Assistant Professor - Aviation Management',
    department: 'Aviation Studies',
    type: 'Full-time',
    location: 'Udupi Campus',
    experience: '3-5 years',
    salary: '₹10-14 LPA',
    description: 'Lead the Aviation department with engaging lectures and hands-on training.',
    requirements: [
      'PhD/M.Tech in Aviation or related field',
      'Minimum 3 years of teaching experience',
      'Industry exposure preferred',
    ],
    deadline: '2024-05-31',
    active: true,
  },
  {
    id: '2',
    title: 'Digital Marketing Trainer',
    department: 'Management Studies',
    type: 'Full-time',
    location: 'Mangalore Campus',
    experience: '4+ years',
    salary: '₹8-12 LPA',
    description: 'Guide students through the latest digital marketing tactics and tools.',
    requirements: [
      'MBA with Digital Marketing specialization',
      'Hands-on experience with campaigns',
      'Strong communication skills',
    ],
    deadline: '2024-06-15',
    active: true,
  },
];

const partTimeJobs = [
  {
    id: 1,
    title: 'HR Intern',
    description: 'Support HR activities and learn recruitment processes.',
    stipend: '₹5,000 - ₹8,000/month',
    duration: '6 months',
  },
  {
    id: 2,
    title: 'Finance Assistant',
    description: 'Assist in accounting, billing, and financial documentation.',
    stipend: '₹6,000 - ₹10,000/month',
    duration: '6-12 months',
  },
  {
    id: 3,
    title: 'Event Management Coordinator',
    description: 'Help organize campus events, seminars, and cultural programs.',
    stipend: '₹5,000 - ₹8,000/month',
    duration: 'Flexible',
  },
  {
    id: 4,
    title: 'Marketing Executive (Part-time)',
    description: 'Support marketing campaigns and social media management.',
    stipend: '₹7,000 - ₹12,000/month',
    duration: 'Ongoing',
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Clear progression path with regular promotions and skill development.',
  },
  {
    icon: Users,
    title: 'Collaborative Environment',
    description: 'Work with passionate educators and industry professionals.',
  },
  {
    icon: Award,
    title: 'Competitive Benefits',
    description: 'Attractive salary, insurance, and professional development opportunities.',
  },
];

const Careers = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(DEFAULT_JOBS);

  useEffect(() => {
    const loadCareers = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('careers');
        const careersSetting = Array.isArray(settings)
          ? settings.find((s: any) => s.key === 'careers.openings' && s.value)
          : null;

        if (careersSetting?.value) {
          const parsed = JSON.parse(careersSetting.value as string);
          if (Array.isArray(parsed) && parsed.length) {
            setJobOpenings(
              parsed
                .filter((job) => job.active !== false)
                .map((job, index) => ({
                  id: job.id ?? String(index + 1),
                  title: job.title ?? '',
                  department: job.department ?? '',
                  location: job.location ?? '',
                  type: job.type ?? 'Full-time',
                  experience: job.experience ?? '',
                  salary: job.salary ?? '',
                  description: job.description ?? '',
                  requirements: Array.isArray(job.requirements) ? job.requirements : [],
                  deadline: job.deadline ?? '',
                  active: job.active ?? true,
                }))
            );
          }
        }
      } catch (error) {
        console.error('Failed to load public careers data', error);
      }
    };

    loadCareers();
  }, []);

  const activeJobs = useMemo(() => jobOpenings.filter((job) => job.active !== false), [jobOpenings]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="ecr-section bg-hero-pattern">
        <div className="ecr-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Join Our Team
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Career Opportunities
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Be part of India's leading educational institution. Shape the future of education with us.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-card">
        <div className="ecr-container">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-time Positions */}
      <section className="ecr-section bg-background">
        <div className="ecr-container">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8">
            Current Openings
          </h2>
          <div className="space-y-6">
            {activeJobs.map((job) => (
              <div key={job.id} className="ecr-card">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Experience:</strong> {job.experience}
                      {job.salary ? (
                        <>
                          {' '}
                          | <strong>Salary:</strong> {job.salary}
                        </>
                      ) : null}
                    </p>
                    {job.description && (
                      <p className="text-muted-foreground text-sm mt-2">{job.description}</p>
                    )}
                    {job.requirements.length > 0 && (
                      <ul className="mt-3 list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {job.requirements.slice(0, 3).map((req) => (
                          <li key={req}>{req}</li>
                        ))}
                      </ul>
                    )}
                    {job.deadline && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Deadline:{' '}
                        <span className="font-medium text-primary">
                          {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                  </div>
                  <Link to="/apply?type=career">
                    <Button variant="outline">
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Part-time Jobs for Students */}
      <section className="ecr-section bg-card">
        <div className="ecr-container">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              For Students
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Part-time Opportunities
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Earn while you learn! Our campus offers part-time job opportunities for students 
              to gain practical experience and financial independence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {partTimeJobs.map((job) => (
              <div key={job.id} className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {job.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{job.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary font-semibold">{job.stipend}</p>
                    <p className="text-xs text-muted-foreground">Duration: {job.duration}</p>
                  </div>
                  <Link to="/apply?type=job">
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
