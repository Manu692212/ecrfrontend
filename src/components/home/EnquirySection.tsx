import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EnquirySection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Enquiry Submitted!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section className="ecr-section bg-card relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky/5 rounded-full blur-3xl" />
      </div>

      <div className="ecr-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              <Sparkles className="w-4 h-4" />
              Start Your Journey
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Start Your Success Story Today, Enroll Now!
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Take the first step towards a bright future. Fill in your details and our 
              admissions team will contact you with all the information you need.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {['Quick Response', '24/7 Support', 'Free Counseling', 'Campus Visit'].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-background rounded-3xl p-8 border border-border shadow-lg">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
              Enquire Now
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 bg-muted border-border"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 bg-muted border-border"
                />
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="h-12 bg-muted border-border"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="bg-muted border-border resize-none"
                />
              </div>
              <Button type="submit" variant="hero" className="w-full" size="lg">
                <Send className="w-4 h-4" />
                Submit Enquiry
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquirySection;
