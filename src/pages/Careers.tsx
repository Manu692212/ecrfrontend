import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Briefcase, Clock, MapPin, ArrowRight, Users, Award, TrendingUp } from 'lucide-react';
import { settingsAPI } from '@/lib/api';
import {
  DEFAULT_JOB_OPENINGS,
  DEFAULT_PART_TIME_JOBS,
  JobOpening,
  PartTimeJob,
  normalizeJobOpenings,
  normalizePartTimeJobs,
} from '@/data/careers';

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
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(DEFAULT_JOB_OPENINGS);
  const [partTimeJobs, setPartTimeJobs] = useState<PartTimeJob[]>(DEFAULT_PART_TIME_JOBS);

  useEffect(() => {
    const loadCareers = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('careers');
        const careersSetting = Array.isArray(settings)
          ? settings.find((s: any) => s.key === 'careers.openings' && s.value)
          : null;
        const partTimeSetting = Array.isArray(settings)
          ? settings.find((s: any) => s.key === 'careers.part_time' && s.value)
          : null;

        if (careersSetting?.value) {
          const parsed = JSON.parse(careersSetting.value as string);
          const normalized = normalizeJobOpenings(parsed, { includeInactive: false });
          if (normalized.length) {
            setJobOpenings(normalized);
          } else {
            setJobOpenings(DEFAULT_JOB_OPENINGS);
          }
        } else {
          setJobOpenings(DEFAULT_JOB_OPENINGS);
        }

        if (partTimeSetting?.value) {
          const parsed = JSON.parse(partTimeSetting.value as string);
          const normalized = normalizePartTimeJobs(parsed, { includeInactive: false });
          if (normalized.length) {
            setPartTimeJobs(normalized);
          } else {
            setPartTimeJobs(DEFAULT_PART_TIME_JOBS);
          }
        } else {
          setPartTimeJobs(DEFAULT_PART_TIME_JOBS);
        }
      } catch (error) {
        console.error('Failed to load public careers data', error);
        setJobOpenings(DEFAULT_JOB_OPENINGS);
        setPartTimeJobs(DEFAULT_PART_TIME_JOBS);
      }
    };

    loadCareers();
  }, []);

  const activeJobs = useMemo(() => jobOpenings.filter((job) => job.active !== false), [jobOpenings]);
  const activePartTimeJobs = useMemo(() => partTimeJobs.filter((job) => job.active !== false), [partTimeJobs]);

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
            {activePartTimeJobs.length === 0 && (
              <div className="bg-background/60 rounded-2xl p-6 border border-border text-center text-muted-foreground">
                No part-time opportunities available right now. Check back soon!
              </div>
            )}
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
            {activePartTimeJobs.map((job) => (
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
