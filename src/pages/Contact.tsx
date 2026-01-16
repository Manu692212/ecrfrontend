import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/layout/Layout';
import SocialLinks from '@/components/common/SocialLinks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { settingsAPI } from '@/lib/api';

interface ContactContent {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  altPhone?: string;
  email: string;
  workingHours: string;
  mapEmbed?: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  youtube?: string;
}

const defaultContact: ContactContent = {
  title: 'Get in Touch',
  subtitle: 'We are here to help you with admissions, programs, and campus visits.',
  address: 'Madhuvana, Achalady, Brahmavar Tq, Udupi, Karnataka, Pin - 576225',
  phone: '+91 82777 55777',
  altPhone: '+91 88677 12266',
  email: 'admission@ecredu.com',
  workingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
  mapEmbed: '',
  socialMedia: {},
};

const extractMapSrc = (embed?: string) => {
  if (!embed) return '';
  const match = embed.match(/src="([^"]+)"/i);
  return match?.[1] ?? '';
};

const buildResponsiveMapEmbed = (src?: string) => {
  if (!src) return '';
  return `<iframe src="${src}" style="border:0;width:100%;height:100%;pointer-events:none;" loading="lazy" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
};

const buildDirectionUrl = (mapSrc: string, fallbackAddress: string) => {
  if (mapSrc) {
    if (mapSrc.includes('/maps/embed')) {
      return mapSrc.replace('/embed', '');
    }
    return mapSrc;
  }
  if (fallbackAddress) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackAddress)}`;
  }
  return 'https://maps.google.com';
};

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [contactContent, setContactContent] = useState<ContactContent>(defaultContact);

  const mapSrc = useMemo(() => extractMapSrc(contactContent.mapEmbed), [contactContent.mapEmbed]);
  const mapEmbedHtml = useMemo(() => buildResponsiveMapEmbed(mapSrc), [mapSrc]);
  const directionUrl = useMemo(
    () => buildDirectionUrl(mapSrc, contactContent.address),
    [mapSrc, contactContent.address]
  );

  useEffect(() => {
    const loadContactContent = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('contact');
        const contactSetting = Array.isArray(settings)
          ? settings.find((s: any) => s.key === 'contact.info' && s.value)
          : null;

        if (contactSetting?.value) {
          const parsed = JSON.parse(contactSetting.value as string);
          setContactContent((prev) => ({
            ...prev,
            ...parsed,
            socialMedia: parsed?.socialMedia ? { ...prev.socialMedia, ...parsed.socialMedia } : prev.socialMedia,
          }));
        }
      } catch (error) {
        console.error('Failed to load public contact info', error);
      }
    };

    loadContactContent();
  }, []);

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Address',
      content: contactContent.address,
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: contactContent.email,
      link: `mailto:${contactContent.email}`,
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: contactContent.phone,
      subContent: contactContent.altPhone,
      link: `tel:${contactContent.phone}`,
    },
    {
      icon: Clock,
      title: 'Office Hours',
      content: contactContent.workingHours,
    },
  ];

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
              {contactContent.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              {contactContent.subtitle}
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
              {mapEmbedHtml ? (
                <>
                  <div className="aspect-video relative">
                    <div
                      className="absolute inset-0"
                      dangerouslySetInnerHTML={{ __html: mapEmbedHtml }}
                    />
                  </div>
                  <div className="border-t border-border px-6 py-4 bg-muted/20 flex justify-between items-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Campus Map</p>
                    <Button asChild size="sm" variant="outline">
                      <a href={directionUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin className="w-4 h-4 mr-2" />
                        Open in Google Maps
                      </a>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="h-full min-h-[400px] bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      Visit Our Campus
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                      {contactContent.address}
                    </p>
                  </div>
                </div>
              )}
              {Object.values(contactContent.socialMedia).some((value) => (value ?? '').trim().length > 0) && (
                <div className="border-t border-border px-6 py-4">
                  <SocialLinks
                    socialMedia={contactContent.socialMedia}
                    className="flex-wrap gap-4"
                    buttonClassName="bg-transparent border border-border hover:bg-primary text-primary hover:text-primary-foreground"
                    iconClassName="w-4 h-4"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
