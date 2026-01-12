export interface JobOpening {
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

export interface PartTimeJob {
  id: string;
  title: string;
  description: string;
  stipend: string;
  duration: string;
  active: boolean;
}

const defaultJobOpenings: JobOpening[] = [
  {
    id: '1',
    title: 'Assistant Professor - Aviation Management',
    department: 'Aviation Studies',
    location: 'Udupi Campus',
    type: 'Full-time',
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
    location: 'Mangalore Campus',
    type: 'Full-time',
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

export const DEFAULT_JOB_OPENINGS: JobOpening[] = defaultJobOpenings.map((job) => ({
  ...job,
  requirements: [...job.requirements],
}));

const defaultPartTimeJobs: PartTimeJob[] = [
  {
    id: 'pt-1',
    title: 'HR Intern',
    description: 'Support HR activities and learn recruitment processes.',
    stipend: '₹5,000 - ₹8,000/month',
    duration: '6 months',
    active: true,
  },
  {
    id: 'pt-2',
    title: 'Finance Assistant',
    description: 'Assist in accounting, billing, and financial documentation.',
    stipend: '₹6,000 - ₹10,000/month',
    duration: '6-12 months',
    active: true,
  },
  {
    id: 'pt-3',
    title: 'Event Management Coordinator',
    description: 'Help organize campus events, seminars, and cultural programs.',
    stipend: '₹5,000 - ₹8,000/month',
    duration: 'Flexible',
    active: true,
  },
  {
    id: 'pt-4',
    title: 'Marketing Executive (Part-time)',
    description: 'Support marketing campaigns and social media management.',
    stipend: '₹7,000 - ₹12,000/month',
    duration: 'Ongoing',
    active: true,
  },
];

export const DEFAULT_PART_TIME_JOBS: PartTimeJob[] = defaultPartTimeJobs.map((job) => ({ ...job }));

type NormalizeOptions = {
  ensureRequirementEntry?: boolean;
  includeInactive?: boolean;
};

type PreparedJobOpening = JobOpening & { active: boolean };

type RawJobOpening = Partial<JobOpening> & Record<string, unknown>;

type NormalizePartTimeOptions = {
  includeInactive?: boolean;
  ensureEntry?: boolean;
};

type RawPartTimeJob = Partial<PartTimeJob> & Record<string, unknown>;

const coerceString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const coerceBoolean = (value: unknown, fallback = true): boolean =>
  typeof value === 'boolean' ? value : fallback;

const buildRequirements = (
  value: unknown,
  ensureRequirementEntry: boolean
): string[] => {
  const requirements = Array.isArray(value)
    ? value
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item) => item.length > 0)
    : [];

  if (ensureRequirementEntry && requirements.length === 0) {
    requirements.push('');
  }

  return requirements;
};

const normalizeJobOpening = (
  job: RawJobOpening,
  index: number,
  options: NormalizeOptions
): PreparedJobOpening | null => {
  const ensureRequirementEntry = options.ensureRequirementEntry ?? false;

  const requirements = buildRequirements(job.requirements, ensureRequirementEntry);

  const normalized: PreparedJobOpening = {
    id: coerceString(job.id, String(index + 1)),
    title: coerceString(job.title),
    department: coerceString(job.department),
    location: coerceString(job.location),
    type: coerceString(job.type, 'Full-time'),
    experience: coerceString(job.experience),
    salary: coerceString(job.salary),
    description: coerceString(job.description),
    requirements,
    deadline: coerceString(job.deadline),
    active: coerceBoolean(job.active, true),
  };

  if (options.includeInactive === false && !normalized.active) {
    return null;
  }

  return normalized;
};

export const normalizeJobOpenings = (
  value: unknown,
  options: NormalizeOptions = {}
): JobOpening[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((job, index) => normalizeJobOpening(job as RawJobOpening, index, options))
    .filter((job): job is PreparedJobOpening => Boolean(job))
    .map((job) => ({
      ...job,
      requirements:
        options.ensureRequirementEntry && job.requirements.length === 0
          ? ['']
          : [...job.requirements],
    }));
};

const normalizePartTimeJob = (
  job: RawPartTimeJob,
  index: number,
  options: NormalizePartTimeOptions
): PartTimeJob | null => {
  const normalized: PartTimeJob = {
    id: coerceString(job.id, `pt-${index + 1}`),
    title: coerceString(job.title),
    description: coerceString(job.description),
    stipend: coerceString(job.stipend),
    duration: coerceString(job.duration),
    active: coerceBoolean(job.active, true),
  };

  if (options.includeInactive === false && !normalized.active) {
    return null;
  }

  return normalized;
};

export const normalizePartTimeJobs = (
  value: unknown,
  options: NormalizePartTimeOptions = {}
): PartTimeJob[] => {
  if (!Array.isArray(value)) {
    return options.ensureEntry ? [createEmptyPartTimeJob()] : [];
  }

  const normalized = value
    .map((job, index) => normalizePartTimeJob(job as RawPartTimeJob, index, options))
    .filter((job): job is PartTimeJob => Boolean(job));

  if (options.ensureEntry && normalized.length === 0) {
    return [createEmptyPartTimeJob()];
  }

  return normalized;
};

const generateJobId = (): string => {
  const globalCrypto = (globalThis as { crypto?: Crypto }).crypto;
  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    return globalCrypto.randomUUID();
  }

  return Date.now().toString();
};

export const createEmptyJobOpening = (): JobOpening => ({
  id: generateJobId(),
  title: '',
  department: '',
  location: '',
  type: 'Full-time',
  experience: '',
  salary: '',
  description: '',
  requirements: [''],
  deadline: '',
  active: true,
});

export const prepareJobOpeningsForSave = (jobs: JobOpening[]): JobOpening[] =>
  jobs.map((job, index) => ({
    ...job,
    id: job.id || String(index + 1),
    title: job.title.trim(),
    department: job.department.trim(),
    location: job.location.trim(),
    type: job.type.trim() || 'Full-time',
    experience: job.experience.trim(),
    salary: job.salary.trim(),
    description: job.description.trim(),
    requirements: Array.isArray(job.requirements)
      ? job.requirements
          .map((req) => (typeof req === 'string' ? req.trim() : ''))
          .filter((req) => req.length > 0)
      : [],
    deadline: job.deadline,
    active: job.active !== false,
  }));

export const preparePartTimeJobsForSave = (jobs: PartTimeJob[]): PartTimeJob[] =>
  jobs.map((job, index) => ({
    ...job,
    id: job.id || `pt-${index + 1}`,
    title: job.title.trim(),
    description: job.description.trim(),
    stipend: job.stipend.trim(),
    duration: job.duration.trim(),
    active: job.active !== false,
  }));

export const createEmptyPartTimeJob = (): PartTimeJob => ({
  id: generateJobId(),
  title: '',
  description: '',
  stipend: '',
  duration: '',
  active: true,
});
