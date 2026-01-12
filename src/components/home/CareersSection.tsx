import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { settingsAPI } from '@/lib/api';
import {
  DEFAULT_JOB_OPENINGS,
  DEFAULT_PART_TIME_JOBS,
  JobOpening,
  PartTimeJob,
  normalizeJobOpenings,
  normalizePartTimeJobs,
} from '@/data/careers';
import { ArrowRight, Briefcase, CalendarDays, Clock, MapPin, Sparkles } from 'lucide-react';

const formatDeadline = (deadline: string) => {
  if (!deadline) return 'Open until filled';
  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) {
    return deadline;
  }

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const CareersSection = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(DEFAULT_JOB_OPENINGS);
  const [partTimeJobs, setPartTimeJobs] = useState<PartTimeJob[]>(DEFAULT_PART_TIME_JOBS);

  useEffect(() => {
    const loadCareers = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('careers');
        const careersSetting = Array.isArray(settings)
          ? settings.find((setting: any) => setting.key === 'careers.openings' && setting.value)
          : null;
        const partTimeSetting = Array.isArray(settings)
          ? settings.find((setting: any) => setting.key === 'careers.part_time' && setting.value)
          : null;

        if (careersSetting?.value) {
          try {
            const parsed = JSON.parse(careersSetting.value as string);
            const normalized = normalizeJobOpenings(parsed, { includeInactive: true });
            if (normalized.length) {
              setJobOpenings(normalized);
            } else {
              setJobOpenings(DEFAULT_JOB_OPENINGS);
            }
          } catch (error) {
            console.error('Failed to parse careers openings JSON', error);
            setJobOpenings(DEFAULT_JOB_OPENINGS);
          }
        } else {
          setJobOpenings(DEFAULT_JOB_OPENINGS);
        }

        if (partTimeSetting?.value) {
          try {
            const parsed = JSON.parse(partTimeSetting.value as string);
            const normalized = normalizePartTimeJobs(parsed, { includeInactive: true });
            if (normalized.length) {
              setPartTimeJobs(normalized);
            } else {
              setPartTimeJobs(DEFAULT_PART_TIME_JOBS);
            }
          } catch (error) {
            console.error('Failed to parse part-time jobs JSON', error);
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
  const featuredJobs = activeJobs.slice(0, 2);
  const activePartTimeJobs = useMemo(() => partTimeJobs.filter((job) => job.active !== false), [partTimeJobs]);
  const partTimeHighlights = activePartTimeJobs.slice(0, 2);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950/80 to-blue-950 text-white">
      <div className="absolute -top-24 right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06)_0%,_transparent_60%)]" />

      <div className="ecr-container relative z-10 py-20">
        <div className="mb-12 max-w-3xl lg:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-sky-200">
            <Sparkles className="h-3.5 w-3.5" />
            Careers at ECR Academy
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl">
            Aviation Excellence needs passionate people
          </h2>
          <p className="mt-4 text-base text-slate-300 md:text-lg">
            Be part of India&apos;s leading educational institution. Shape the future of aviation, business, and
            emerging technologies with a team that believes in growth, collaboration, and world-class impact.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/careers">
              <Button size="lg" className="gap-2 bg-white text-slate-900 hover:bg-white/90">
                View all opportunities
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/apply?type=career">
              <Button size="lg" variant="outline" className="gap-2 border-white/30 text-white hover:bg-white/10">
                Apply now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 -translate-y-10 translate-x-10 rounded-full bg-primary/30 blur-3xl transition-all group-hover:bg-primary/50" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-sky-200">{job.department || 'Open role'}</p>
                        <h3 className="mt-2 font-display text-2xl font-semibold">
                          {job.title || 'Untitled position'}
                        </h3>
                      </div>
                      <div className="text-right text-sm text-slate-200">
                        {job.salary && <p className="font-semibold text-white">{job.salary}</p>}
                        <p className="inline-flex items-center gap-1 text-xs">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Deadline: {formatDeadline(job.deadline)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                      {job.type && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </span>
                      )}
                      {job.location && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                      )}
                      {job.experience && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                          <Briefcase className="h-4 w-4" />
                          Experience: {job.experience}
                        </span>
                      )}
                    </div>

                    {job.description && <p className="text-sm text-slate-200/90">{job.description}</p>}

                    {job.requirements.length > 0 && (
                      <ul className="grid gap-2 text-sm text-slate-200/80 md:grid-cols-2">
                        {job.requirements.slice(0, 4).map((req, index) => (
                          <li key={`${job.id}-req-${index}`} className="flex items-start gap-2">
                            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-sky-300" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Link to="/apply?type=career">
                        <Button size="sm" variant="secondary" className="gap-2 bg-white/90 text-slate-900 hover:bg-white">
                          Apply for this role
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to="/careers" className="text-sm font-medium text-sky-200 hover:text-white">
                        Read more details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-200">
                <h3 className="font-display text-2xl text-white">No current openings</h3>
                <p className="mt-3 text-sm">We&apos;re always excited to meet passionate professionals. Check back soon or send us your profile.</p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link to="/careers">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      Explore Careers Page
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button className="bg-white text-slate-900 hover:bg-white/90">Reach the team</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-sky-200">For students</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-white">Part-time opportunities</h3>
              <p className="mt-2 text-sm text-slate-200/80">
                Earn while you learn. Gain real-world experience alongside your academic journey.
              </p>
            </div>
            <div className="space-y-4">
              {partTimeHighlights.map((role) => (
                <div key={role.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 className="font-semibold text-white">{role.title}</h4>
                  <p className="mt-1 text-sm text-slate-200/80">{role.description}</p>
                  <div className="mt-3 space-y-1 text-xs text-slate-200/70">
                    <p>
                      <span className="font-semibold text-slate-100">Stipend:</span> {role.stipend}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">Duration:</span> {role.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/apply?type=job">
              <Button variant="outline" className="gap-2 border-white/40 text-white hover:bg-white/10">
                Apply for student roles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareersSection;
