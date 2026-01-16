import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import clsx from 'clsx';

export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin';

const SOCIAL_CONFIG: Array<{
  key: SocialPlatform;
  label: string;
  icon: typeof Facebook;
}> = [
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'twitter', label: 'Twitter', icon: Twitter },
  { key: 'youtube', label: 'Youtube', icon: Youtube },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
];

const normalizeLink = (href?: string | null) => {
  if (!href) return '';
  const trimmed = href.trim();
  if (!trimmed || trimmed === '#') return '';
  return trimmed;
};

interface SocialLinksProps {
  socialMedia?: Partial<Record<SocialPlatform, string>>;
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
}

export default function SocialLinks({
  socialMedia,
  className,
  buttonClassName,
  iconClassName,
}: SocialLinksProps) {
  const links = SOCIAL_CONFIG.map((config) => {
    const href = normalizeLink(socialMedia?.[config.key]);
    return href ? { ...config, href } : null;
  }).filter((item): item is { key: SocialPlatform; label: string; icon: typeof Facebook; href: string } => Boolean(item));

  if (!links.length) {
    return null;
  }

  return (
    <div className={clsx('flex flex-wrap gap-3', className)}>
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          aria-label={link.label}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            'w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all',
            buttonClassName
          )}
        >
          <link.icon className={clsx('w-5 h-5', iconClassName)} />
        </a>
      ))}
    </div>
  );
}
