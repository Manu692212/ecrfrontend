import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, MapPin, Mail, Phone, MapPinned } from 'lucide-react';
import { settingsAPI } from '@/lib/api';
import SocialLinks from '@/components/common/SocialLinks';

interface FooterContactInfo {
  address: string;
  email: string;
  phone: string;
  altPhone?: string;
  mapEmbed?: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
}

const defaultContactInfo: FooterContactInfo = {
  address: 'Madhuvana, Achalady, Brahmavar Tq, Udupi, Karnataka, Pin - 576225',
  email: 'admission@ecredu.com',
  phone: '+91 82777 55777',
  altPhone: '+91 88677 12266',
  mapEmbed: '',
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
  },
};

const extractMapSrc = (embed?: string) => {
  if (!embed) return '';
  const match = embed.match(/src="([^"]+)"/i);
  return match?.[1] ?? '';
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

const Footer = () => {
  const [contactInfo, setContactInfo] = useState<FooterContactInfo>(defaultContactInfo);
  const mapSrc = useMemo(() => extractMapSrc(contactInfo.mapEmbed), [contactInfo.mapEmbed]);
  const directionUrl = useMemo(
    () => buildDirectionUrl(mapSrc, contactInfo.address),
    [mapSrc, contactInfo.address]
  );

  useEffect(() => {
    const loadFooterContact = async () => {
      try {
        const settings = await settingsAPI.getGroupPublic('contact');
        const contactSetting = Array.isArray(settings)
          ? settings.find((s: any) => s.key === 'contact.info' && s.value)
          : null;

        if (contactSetting?.value) {
          const parsed = JSON.parse(contactSetting.value as string);
          setContactInfo((prev) => ({
            ...prev,
            ...parsed,
            socialMedia: {
              ...prev.socialMedia,
              ...(parsed?.socialMedia ?? {}),
            },
          }));
        }
      } catch (error) {
        console.error('Failed to load footer contact info', error);
      }
    };

    loadFooterContact();
  }, []);

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Achievements', path: '/about' },
    { name: 'Gallery', path: '/facilities' },
    { name: 'Careers', path: '/careers' },
    { name: 'Admission', path: '/admission' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Management', path: '/management' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const courses = [
    { name: 'Management AHM', path: '/courses' },
    { name: 'Management ADD ONS', path: '/courses' },
    { name: 'Paramedical', path: '/courses' },
    { name: 'Nursing', path: '/courses' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="ecr-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">ECR Academy</h3>
                <p className="text-xs text-muted-foreground">Aviation Excellence</p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              ECR – Reformation through education and charity brings you "ECR AVIATION ACADEMY", 
              an educational institute that offers graduation courses & aviation programs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.slice(0, 6).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">Courses</h4>
            <ul className="space-y-3">
              {courses.map((course) => (
                <li key={course.name}>
                  <Link
                    to={course.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">Contact Us</h4>
            <div className="rounded-2xl border border-border overflow-hidden">
              {mapSrc ? (
                <>
                  <div className="aspect-video bg-muted">
                    <iframe
                      src={mapSrc}
                      title="ECR map"
                      className="w-full h-full border-0 pointer-events-none"
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                  <div className="px-4 py-3 bg-background flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <span>View Directions</span>
                    <a
                      href={directionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <MapPinned className="w-4 h-4" />
                      Open Maps
                    </a>
                  </div>
                </>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">
                  Map information coming soon.
                </div>
              )}
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-muted-foreground text-sm">
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="hover:text-primary transition-colors block"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </li>
            </ul>

            {/* Social Links */}
            <div className="pt-4">
              <h5 className="text-sm font-semibold text-foreground mb-4">Follow Us</h5>
              <SocialLinks socialMedia={contactInfo.socialMedia} />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="ecr-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {new Date().getFullYear()} ECR Academy. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
