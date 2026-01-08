import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Briefcase, Heart, Stethoscope } from 'lucide-react';

const courseCategories = [
  {
    icon: Briefcase,
    title: 'Management AHM',
    count: '3 Courses',
    courses: [
      'BCA + Aviation and Hospitality Management',
      'BBA + Aviation and Hospitality Management',
      'B.Com + Aviation and Hospitality Management',
    ],
    color: 'from-primary/20 to-gold-dark/20',
  },
  {
    icon: BookOpen,
    title: 'Management ADD ONS',
    count: '5 Courses',
    courses: [
      'BBA/BCA/B.Com + Artificial Intelligence',
      'BBA/BCA/B.Com + Cyber Security',
      'BBA/BCA/B.Com + Big Data Analytics',
      'BBA/BCA/B.Com + Digital Marketing',
      'BBA/BCA/B.Com + Supply Chain Logistics',
    ],
    color: 'from-sky/20 to-sky-light/20',
  },
  {
    icon: Heart,
    title: 'Paramedical',
    count: '1 Course',
    courses: ['Paramedical Course'],
    color: 'from-destructive/20 to-destructive/10',
  },
  {
    icon: Stethoscope,
    title: 'Nursing',
    count: '2 Courses',
    courses: ['BSC Nursing', 'GNM Nursing'],
    color: 'from-green-500/20 to-green-600/20',
  },
];

const CoursesSection = () => {
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

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courseCategories.map((category, index) => (
            <div
              key={category.title}
              className="ecr-card group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-7 h-7 text-foreground" />
              </div>

              {/* Title & Count */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {category.title}
              </h3>
              <p className="text-primary font-medium text-sm mb-4">{category.count}</p>

              {/* Courses List */}
              <ul className="space-y-2 mb-6">
                {category.courses.slice(0, 3).map((course) => (
                  <li key={course} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {course}
                  </li>
                ))}
                {category.courses.length > 3 && (
                  <li className="text-sm text-primary">+{category.courses.length - 3} more...</li>
                )}
              </ul>

              {/* Arrow */}
              <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                <span>View Details</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
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
