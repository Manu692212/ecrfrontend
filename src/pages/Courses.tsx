import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { BookOpen, Briefcase, Heart, Stethoscope, ArrowRight, Download } from 'lucide-react';

const courseCategories = [
  {
    icon: Briefcase,
    title: 'Management AHM',
    description: 'Aviation and Hospitality Management combined with traditional degree programs.',
    courses: [
      { name: 'BCA + Aviation and Hospitality Management (AHM)', duration: '3 Years', eligibility: '10+2' },
      { name: 'BBA + Aviation and Hospitality Management (AHM)', duration: '3 Years', eligibility: '10+2' },
      { name: 'B.Com + Aviation and Hospitality Management (AHM)', duration: '3 Years', eligibility: '10+2' },
    ],
  },
  {
    icon: BookOpen,
    title: 'Management ADD ONS',
    description: 'Enhance your degree with cutting-edge technology and business skills.',
    courses: [
      { name: 'BBA/BCA/B.Com + Artificial Intelligence', duration: '3 Years', eligibility: '10+2' },
      { name: 'BBA/BCA/B.Com + Cyber Security', duration: '3 Years', eligibility: '10+2' },
      { name: 'BBA/BCA/B.Com + Big Data Analytics', duration: '3 Years', eligibility: '10+2' },
      { name: 'BBA/BCA/B.Com + Digital Marketing', duration: '3 Years', eligibility: '10+2' },
      { name: 'BBA/BCA/B.Com + Supply Chain Logistics Management', duration: '3 Years', eligibility: '10+2' },
    ],
  },
  {
    icon: Heart,
    title: 'Paramedical',
    description: 'Healthcare support courses for aspiring medical professionals.',
    courses: [
      { name: 'Paramedical Course', duration: '2 Years', eligibility: '10+2 with Science' },
    ],
  },
  {
    icon: Stethoscope,
    title: 'Nursing',
    description: 'Professional nursing programs recognized by Indian Nursing Council.',
    courses: [
      { name: 'BSC Nursing', duration: '4 Years', eligibility: '10+2 with Science' },
      { name: 'GNM Nursing', duration: '3.5 Years', eligibility: '10+2' },
    ],
  },
];

const Courses = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="ecr-section bg-hero-pattern">
        <div className="ecr-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Our Programs
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              100% Job Oriented Courses
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8">
              Providing best courses that offer you a brighter future with comprehensive training 
              and practical experience.
            </p>
            <Link to="/apply">
              <Button variant="hero" size="lg">
                <Download className="w-5 h-5" />
                Download Complete Syllabus
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="ecr-section bg-card">
        <div className="ecr-container">
          <div className="space-y-16">
            {courseCategories.map((category, index) => (
              <div key={category.title} className="bg-background rounded-3xl p-8 md:p-12 border border-border">
                {/* Category Header */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <category.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {category.title}
                    </h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                {/* Courses Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-4 font-semibold text-foreground">Course Name</th>
                        <th className="text-left py-4 px-4 font-semibold text-foreground">Duration</th>
                        <th className="text-left py-4 px-4 font-semibold text-foreground">Eligibility</th>
                        <th className="text-right py-4 px-4 font-semibold text-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.courses.map((course, courseIndex) => (
                        <tr key={course.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4 text-foreground">{course.name}</td>
                          <td className="py-4 px-4 text-muted-foreground">{course.duration}</td>
                          <td className="py-4 px-4 text-muted-foreground">{course.eligibility}</td>
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="ecr-section bg-gold-gradient">
        <div className="ecr-container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who have transformed their careers with ECR Academy.
          </p>
          <Link to="/apply">
            <Button variant="secondary" size="lg">
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
