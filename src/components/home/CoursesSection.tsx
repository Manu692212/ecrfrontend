import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Briefcase, Heart, Stethoscope } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

interface CourseOverview {
  id: string;
  title: string;
  description: string;
  duration: string;
  eligibility: string;
  fees: string;
  image?: string;
}

const defaultCourses: CourseOverview[] = [
  {
    id: '1',
    title: 'BCA + Aviation and Hospitality Management',
    description: 'Dual degree combining computer applications with aviation and hospitality operations.',
    duration: '3 Years',
    eligibility: '10+2 in any stream',
    fees: '₹68,000 per year',
  },
  {
    id: '2',
    title: 'BBA + Aviation and Hospitality Management',
    description: 'BBA curriculum enriched with aviation & hospitality industry exposure.',
    duration: '3 Years',
    eligibility: '10+2 with 45% marks',
    fees: '₹72,000 per year',
  },
  {
    id: '3',
    title: 'B.Com + Aviation and Hospitality Management',
    description: 'Commerce studies coupled with aviation and hospitality specialization.',
    duration: '3 Years',
    eligibility: '10+2 with Commerce subjects',
    fees: '₹70,000 per year',
  },
  {
    id: '4',
    title: 'BBA/BCA/B.Com + Artificial Intelligence',
    description: 'Add-on AI track for business, computing, and commerce students.',
    duration: '1 Year add-on',
    eligibility: 'Enrolled in BBA/BCA/B.Com',
    fees: '₹38,000 per year',
  },
  {
    id: '5',
    title: 'BBA/BCA/B.Com + Cyber Security',
    description: 'Cyber security foundation for students across management, tech, and commerce.',
    duration: '1 Year add-on',
    eligibility: 'Enrolled in BBA/BCA/B.Com',
    fees: '₹38,000 per year',
  },
  {
    id: '6',
    title: 'Paramedical Course',
    description: 'Hands-on training for paramedical services with practical hospital exposure.',
    duration: '2 Years',
    eligibility: '10+2 with PCB',
    fees: '₹1,20,000 per year',
  },
  {
    id: '7',
    title: 'BSC Nursing',
    description: 'Professional nursing degree covering clinical, theoretical, and practical care.',
    duration: '4 Years',
    eligibility: '10+2 with PCB & 45% marks',
    fees: '₹1,50,000 per year',
  },
  {
    id: '8',
    title: 'GNM Nursing',
    description: 'General nursing midwifery diploma with hospital internships.',
    duration: '3 Years',
    eligibility: '10+2 with PCB',
    fees: '₹1,10,000 per year',
  },
];

const iconPool = [Briefcase, BookOpen, Heart, Stethoscope];

const CoursesSection = () => {
  const [courses, setCourses] = useState<CourseOverview[]>(defaultCourses);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('home');
        const coursesSetting = Array.isArray(settings)
          ? settings.find((s: any) => s.key === 'home.courses_overview' && s.value)
          : null;

        if (coursesSetting?.value) {
          const parsed = JSON.parse(coursesSetting.value as string);
          if (Array.isArray(parsed)) {
            setCourses(
              parsed.map((course, index) => ({
                id: course.id ?? String(index + 1),
                title: course.title ?? '',
                description: course.description ?? '',
                duration: course.duration ?? '',
                eligibility: course.eligibility ?? '',
                fees: course.fees ?? '',
                image: course.image ?? '/placeholder.svg',
              }))
            );
          }
        }
      } catch (error) {
        console.error('Failed to load public courses overview', error);
      }
    };

    loadCourses();
  }, []);

  const highlightedCourses = courses.slice(0, 4);

  return (
    <section className="ecr-section bg-card">
      <div className="ecr-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
            Our Programs
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            100% Job Oriented Courses
          </h2>
          <p className="text-muted-foreground text-lg">
            Providing best courses that offer you a brighter future with comprehensive marketing plans
            and practical training across the most significant platforms.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {highlightedCourses.map((course, index) => {
            const Icon = iconPool[index % iconPool.length];
            return (
              <div key={course.id} className="ecr-card group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{course.description}</p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>
                    <span className="font-semibold text-foreground">Duration:</span> {course.duration}
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Eligibility:</span> {course.eligibility}
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Fees:</span> {course.fees}
                  </li>
                </ul>
                <Link
                  to="/apply"
                  className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Full Listing */}
        <div className="bg-background rounded-3xl border border-border p-6 md:p-8 mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Course Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Duration</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Eligibility</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Fees</th>
                  <th className="text-right py-4 px-4 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors text-sm md:text-base"
                  >
                    <td className="py-4 px-4 text-foreground">{course.title}</td>
                    <td className="py-4 px-4 text-muted-foreground">{course.duration}</td>
                    <td className="py-4 px-4 text-muted-foreground">{course.eligibility}</td>
                    <td className="py-4 px-4 text-muted-foreground">{course.fees}</td>
                    <td className="py-4 px-4 text-right">
                      <Link to="/apply">
                        <Button variant="outline" size="sm">
                          Apply Now
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/courses">
            <Button variant="default" size="lg">
              Download Complete Syllabus
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
