export interface ApplicantSubmission {
  id: string;
  name: string;
  type: 'Course Enrollment' | 'Career Application' | 'Part-time Job';
  course: string;
  email: string;
  phone: string;
  submittedAt: string;
  message: string;
}

export const applicantSubmissions: ApplicantSubmission[] = [
  {
    id: 'app-101',
    name: 'Ananya Sharma',
    type: 'Course Enrollment',
    course: 'BCA + Aviation and Hospitality Management',
    email: 'ananya@example.com',
    phone: '+91 9988776655',
    submittedAt: '2 hours ago',
    message: 'Interested in the new blended learning batch in August.',
  },
  {
    id: 'app-102',
    name: 'Michael Fernandes',
    type: 'Career Application',
    course: 'Faculty – Aviation Operations',
    email: 'michaelf@protonmail.com',
    phone: '+91 7766554433',
    submittedAt: '4 hours ago',
    message: '10+ years runway operations experience, awaiting callback.',
  },
  {
    id: 'app-103',
    name: 'Shreya Menon',
    type: 'Part-time Job',
    course: 'Event Management Coordinator',
    email: 'shreya.m@domain.com',
    phone: '+91 9988001122',
    submittedAt: '7 hours ago',
    message: 'Available for weekend shifts, currently doing BBA.',
  },
];
