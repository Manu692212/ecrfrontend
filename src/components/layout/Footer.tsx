import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plane,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
 Twitter,
  Youtube,
  Linkedin,
  MapPinned,
} from 'lucide-react';
import { settingsAPI } from '@/lib/api';

type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin';

interface FooterContactInfo {
  address: string;
  email: string;
  phone: string;
  altPhone?: string;
  mapEmbed?: string;
  socialMedia: Record<SocialPlatform, string>;
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

const socialIcons: Record<SocialPlatform, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

const Footer = () => {
  const [contactInfo, setContactInfo] = useState<FooterContactInfo>(defaultContactInfo);

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

  const mapUrl = useMemo(() => {
    if (!contactInfo.mapEmbed) return '';
    const match = contactInfo.mapEmbed.match(/src="([^"]+)"/i);
    return match?.[1] ?? '';
  }, [contactInfo.mapEmbed]);

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

  const socialLinks = Object.entries(contactInfo.socialMedia)
    .filter(([, href]) => typeof href === 'string' && href.trim().length > 0)
    .map(([platform, href]) => ({
      icon: socialIcons[platform as SocialPlatform],
      href,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
    }));

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
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  {contactInfo.address}
                  {mapUrl && (
                    <span className="block mt-2">
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                      >
                        <MapPinned className="w-3.5 h-3.5" />
                        View on Map
                      </a>
                    </span>
                  )}
                </span>
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
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-foreground mb-4">Follow Us</h5>
              <div className="flex gap-3">
                {socialLinks.length > 0 ? (
                  socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No social links available</p>
                )}
              </div>
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
