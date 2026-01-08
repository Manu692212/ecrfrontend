import Layout from '@/components/layout/Layout';
import { 
  Building2, 
  Library, 
  FlaskConical, 
  Wifi, 
  Home, 
  Car, 
  Dumbbell,
  Trophy
} from 'lucide-react';

const facilities = [
  {
    icon: Building2,
    title: '40 Acres Campus',
    description: 'Spread across 40 acres with modern infrastructure, beautiful landscapes, and eco-friendly environment.',
  },
  {
    icon: Library,
    title: 'Spacious Library',
    description: 'A well-stocked library with thousands of books, journals, and digital resources available 24/7.',
  },
  {
    icon: FlaskConical,
    title: 'Well-Equipped Labs',
    description: 'State-of-the-art laboratories for practical training in all departments with latest equipment.',
  },
  {
    icon: Wifi,
    title: '24-Hour WiFi',
    description: 'High-speed internet connectivity throughout the campus for seamless learning and research.',
  },
  {
    icon: Home,
    title: 'Hostel Facilities',
    description: 'Separate hostels for boys and girls with comfortable accommodation and modern amenities.',
  },
  {
    icon: Car,
    title: 'Driving Track',
    description: 'Professional driving training track for students to learn vehicle operations safely.',
  },
  {
    icon: Trophy,
    title: 'Sports Complex',
    description: 'Cricket and football stadium, indoor games, and various outdoor sports facilities.',
  },
  {
    icon: Dumbbell,
    title: 'Fitness Center',
    description: 'Modern gymnasium and fitness center for physical wellness and health of students.',
  },
];

const additionalFeatures = [
  'Horse Riding Facility',
  'Cafeteria with Healthy Food',
  'Medical Center on Campus',
  'Transportation Services',
  'Seminar Halls',
  'Computer Centers',
  'Aviation Simulators',
  'Recreation Rooms',
];

const Facilities = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="ecr-section bg-hero-pattern">
        <div className="ecr-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Infrastructure
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              World-Class Facilities
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Experience learning in a state-of-the-art campus designed for holistic development
            </p>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="ecr-section bg-card">
        <div className="ecr-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <div key={facility.title} className="ecr-card group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <facility.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {facility.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {facility.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="ecr-section bg-background">
        <div className="ecr-container">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
            Additional Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-foreground text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Tour CTA */}
      <section className="ecr-section bg-gold-gradient">
        <div className="ecr-container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Want to Experience Our Campus?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Schedule a campus visit to see our world-class facilities firsthand and meet our faculty.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Facilities;
