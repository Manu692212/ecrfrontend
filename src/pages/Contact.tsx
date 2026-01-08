import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Our Address',
    content: 'Madhuvana, Achalady, Brahmavar Tq, Udupi, Karnataka, Pin - 576225',
  },
  {
    icon: Mail,
    title: 'Email Us',
    content: 'admission@ecredu.com',
    link: 'mailto:admission@ecredu.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    content: '+91 82777 55777',
    subContent: '+91 88677 12266',
    link: 'tel:+918277755777',
  },
  {
    icon: Clock,
    title: 'Office Hours',
    content: 'Mon - Sat: 9:00 AM - 6:00 PM',
    subContent: 'Sunday: Closed',
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="ecr-section bg-hero-pattern">
        <div className="ecr-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Have questions? We're here to help. Reach out to us anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-card">
        <div className="ecr-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => (
              <div key={info.title} className="bg-background rounded-2xl p-6 border border-border text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <info.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                {info.link ? (
                  <a href={info.link} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {info.content}
                  </a>
                ) : (
                  <p className="text-muted-foreground text-sm">{info.content}</p>
                )}
                {info.subContent && (
                  <p className="text-muted-foreground text-sm">{info.subContent}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="ecr-section bg-background">
        <div className="ecr-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12 bg-background"
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12 bg-background"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-12 bg-background"
                  />
                  <Input
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="h-12 bg-background"
                  />
                </div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  required
                  className="bg-background resize-none"
                />
                <Button type="submit" variant="hero" className="w-full" size="lg">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="bg-card rounded-3xl border border-border overflow-hidden">
              <div className="h-full min-h-[400px] bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Visit Our Campus
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Madhuvana, Achalady, Brahmavar Tq, Udupi, Karnataka, Pin - 576225
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
