import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Merin Ann',
    role: 'Student',
    content:
      'Excellent, my mentor Roshmy is the best, helped me throughout the process. The guidance and support I received from the academy is appreciable. Thank you once again. God bless you all.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Aparna',
    role: 'Student',
    content:
      'The Best Classes ever, I took the A1 German online mode of learning where we can schedule the class timings in our own convenience. The mentor and classes were awesome. I recommend academy to everyone.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Elson Jacob',
    role: 'Student',
    content:
      'Best IELTS coaching centre in Kochi. Highly recommend for beginners to become a pro in English. Highly professional coaching and friendly teachers. Thank you Academy.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Bismi Babu',
    role: 'Student',
    content:
      'Good experience with Academy. I got the classes according to my time preferences and convenience. I am happy and satisfied with the classes as well as the other services too.',
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('home');
        const testimonialsSetting = Array.isArray(settings)
          ? settings.find((s: any) => s.key === 'home.testimonials' && s.value)
          : null;

        if (testimonialsSetting?.value) {
          const parsed = JSON.parse(testimonialsSetting.value as string);
          if (Array.isArray(parsed) && parsed.length) {
            setTestimonials(
              parsed.map((testimonial, index) => ({
                id: testimonial.id ?? String(index + 1),
                name: testimonial.name ?? '',
                role: testimonial.role ?? '',
                company: testimonial.company ?? '',
                content: testimonial.content ?? '',
                rating: Number(testimonial.rating) || 5,
                image: testimonial.image,
              }))
            );
            setCurrentIndex(0);
          }
        }
      } catch (error) {
        console.error('Failed to load public testimonials', error);
      }
    };

    loadTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="ecr-section bg-card">
      <div className="ecr-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            50,000+ Students Have Already Transformed Their Lives
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Quote className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="bg-background rounded-3xl p-8 md:p-12 border border-border relative">
            <div className="text-center">
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                "{testimonials[currentIndex].content}"
              </p>

              {/* Avatar */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-gradient flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">
                  {testimonials[currentIndex].name
                    .split(' ')
                    .map((n) => n.charAt(0))
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              </div>

              <h4 className="font-display text-xl font-semibold text-foreground">
                {testimonials[currentIndex].name}
              </h4>
              <p className="text-primary">
                {testimonials[currentIndex].role}
                {testimonials[currentIndex].company
                  ? ` • ${testimonials[currentIndex].company}`
                  : ''}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
