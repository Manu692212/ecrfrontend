import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Linkedin, Mail } from 'lucide-react';
import { managementAPI } from '@/lib/api';
type ManagementMember = {
  id: number;
  name: string;
  designation?: string;
  qualifications?: string;
  bio?: string;
  image?: string | null;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const MEDIA_BASE_URL = API_BASE_URL.replace(/\/api$/, '') + '/media';

const resolveMemberImage = (member: any) => {
  if (member?.image_url) {
    return member.image_url;
  }

  if (member?.image) {
    const sanitized = String(member.image).replace(/^\/+/, '');
    return `${MEDIA_BASE_URL}/${sanitized}`;
  }

  return null;
};

const Management = () => {
  const [members, setMembers] = useState<ManagementMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadMembers = async () => {
      try {
        setLoading(true);
        const data = await managementAPI.getPublicList();
        if (!isMounted) return;
        const mapped: ManagementMember[] = (data || []).map((m: any) => ({
          id: m.id,
          name: m.name ?? '',
          designation: m.designation ?? m.position ?? undefined,
          qualifications: m.qualifications ?? undefined,
          bio: m.bio ?? undefined,
          image: resolveMemberImage(m),
        }));
        setMembers(mapped);
        setError(null);
      } catch (err) {
        console.error('Failed to load management team', err);
        if (!isMounted) return;
        setError('Unable to load management team at the moment.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMembers();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="ecr-section bg-hero-pattern">
        <div className="ecr-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Leadership
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Our Management Team
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Meet the visionary leaders who guide ECR Academy towards excellence in education
            </p>
          </div>
        </div>
      </section>

      {/* Management Grid */}
      <section className="ecr-section bg-card">
        <div className="ecr-container">
          <p className="text-muted-foreground text-center md:text-left">
            Discover the visionary leaders guiding ECR Academy towards excellence in education.
          </p>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading management team...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : members.length === 0 ? (
            <p className="text-center text-muted-foreground">Management profiles will be published soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => (
                <div key={member.id} className="ecr-card text-center group">
                  {/* Avatar */}
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gold-gradient flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-display text-3xl font-bold text-primary-foreground">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  {member.designation && (
                    <p className="text-primary font-medium mb-2">{member.designation}</p>
                  )}
                  {member.qualifications && (
                    <p className="text-sm text-muted-foreground mb-4">{member.qualifications}</p>
                  )}
                  {member.bio && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {member.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Management;
