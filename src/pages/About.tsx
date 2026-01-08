import Layout from '@/components/layout/Layout';
import { CheckCircle2, Award, Users, BookOpen, Target, Heart } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Vision',
    description: 'To be the leading educational institution that transforms students into industry-ready professionals with global competence.',
  },
  {
    icon: Heart,
    title: 'Mission',
    description: 'To provide quality education combined with practical training, ensuring every student is equipped for success.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Consistently achieving 4 to 5 top ranks at the university level with 90% of students earning distinctions.',
  },
];

const achievements = [
  'AICTE Approved Programs',
  'Indian Nursing Council Recognition',
  'Mangalore University Affiliation',
  'Rajiv Gandhi University of Health Sciences Partnership',
  '40+ Acres State-of-the-art Campus',
  'International Collaboration with Foreign Companies',
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="ecr-section bg-hero-pattern">
        <div className="ecr-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              About Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              ECR Group of Institutions
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Reformation through education and charity - shaping the future of Aviation & Logistics
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="ecr-section bg-card">
        <div className="ecr-container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Content */}
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Welcome to ECR Academy
              </h2>
              <div className="prose prose-lg text-muted-foreground space-y-4">
                <p>
                  ECR Group of Institutions, under the ECR Trust, stands out with its innovative approach to education. 
                  Spread across approximately 40 acres, the campus is equipped with state-of-the-art facilities and 
                  offers a variety of degree courses approved by AICTE, Indian Nursing Council, Mangalore University, 
                  and Rajiv Gandhi University of Health Sciences.
                </p>
                <p>
                  Unlike conventional degree courses such as BBA, BCA, B.Com, Aviation, Hotel Management, and Fashion 
                  Designing, which primarily focus on academics and achieving high results, ECR goes a step further. 
                  The institution emphasizes job-oriented courses like Artificial Intelligence, Data Science, Digital 
                  Marketing, Cyber Security, Airport Management, HR, Marketing, Finance, and Operations in collaboration 
                  with foreign companies.
                </p>
                <p>
                  Part-time job opportunities in areas like HR, Finance, Operations, Advertising, Share Trading Consultancy, 
                  and Event Management are provided within the campus. Students earn a monthly income through these jobs, 
                  transitioning from candidates to professionals.
                </p>
                <p>
                  ECR's unique vision was inspired by the realization that even students who graduate with high marks 
                  often struggle to secure well-paying jobs. The issue lies not in their abilities but in the traditional 
                  education methods, which fail to prepare them for the demands of the real world. ECR bridges this gap 
                  by focusing on planning and development to cultivate essential skills.
                </p>
              </div>
            </div>

            {/* Right Content - Achievements */}
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                Our Achievements & Recognition
              </h3>
              <ul className="space-y-4 mb-8">
                {achievements.map((achievement) => (
                  <li key={achievement} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{achievement}</span>
                  </li>
                ))}
              </ul>

              {/* Stats Card */}
              <div className="bg-background rounded-2xl p-8 border border-border">
                <h4 className="font-display text-xl font-semibold text-foreground mb-6">
                  By The Numbers
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="font-display text-4xl font-bold text-primary">90%</div>
                    <p className="text-sm text-muted-foreground">Students with Distinctions</p>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-4xl font-bold text-primary">100%</div>
                    <p className="text-sm text-muted-foreground">Placement Assistance</p>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-4xl font-bold text-primary">4-5</div>
                    <p className="text-sm text-muted-foreground">Top University Ranks</p>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-4xl font-bold text-primary">1L+</div>
                    <p className="text-sm text-muted-foreground">Students Trained</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="ecr-section bg-background">
        <div className="ecr-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="ecr-card text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
