import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Award, BookOpen, GraduationCap } from 'lucide-react';
import { academicCouncilAPI } from '@/lib/api';

type CouncilMember = {
  id: number;
  name: string;
  designation?: string;
  qualifications?: string;
  expertise?: string;
  department?: string;
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

const AcademicCouncil = () => {
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasMembers = members.length > 0;

  useEffect(() => {
    let isMounted = true;
    const loadMembers = async () => {
      try {
        setLoading(true);
        const data = await academicCouncilAPI.getPublicList();
        if (!isMounted) return;
        
        // Handle null or empty response
        if (!data) {
          console.warn('No data returned from academic council API');
          setMembers([]);
          setError(null);
          return;
        }

        // Accept both plain arrays and responses wrapped in { data: [...] }
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

        const mapped: CouncilMember[] = list.map((m: any) => ({
          id: m.id,
          name: m.name ?? '',
          designation: m.designation ?? m.position ?? undefined,
          qualifications: m.qualifications ?? undefined,
          expertise: m.bio ?? undefined,
          department: m.department ?? undefined,
          image: resolveMemberImage(m),
        }));
        setMembers(mapped);
        setError(null);
      } catch (err) {
        console.error('Failed to load academic council', err);
        if (!isMounted) return;
        setError('Unable to load academic council members at the moment. Please try again later.');
        setMembers([]);
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
    <>
      <Layout>
        {/* Hero Section */}
        <section className="ecr-section bg-hero-pattern">
          <div className="ecr-container">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
                Academic Excellence
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Academic Council
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl">
                Our distinguished faculty and resource persons dedicated to academic excellence
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-card">
          <div className="ecr-container">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground">150+</div>
                <p className="text-muted-foreground">Faculty Members</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground">50+</div>
                <p className="text-muted-foreground">PhD Holders</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground">20+</div>
                <p className="text-muted-foreground">Departments</p>
              </div>
            </div>
          </div>
        </section>

        {/* Council Members Grid */}
        <section className="ecr-section bg-background">
          <div className="ecr-container">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-center md:text-left">
                  <h2 className="font-display text-3xl font-bold text-foreground mb-3">
                    Key Resource Persons
                  </h2>
                  <p className="text-muted-foreground max-w-3xl">
                    Meet the accomplished educators and industry experts guiding our academic excellence.
                  </p>
                </div>
              </div>

              {loading ? (
                <p className="text-center text-muted-foreground">Loading council members...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : members.length === 0 ? (
                <p className="text-center text-muted-foreground">Council members will be announced soon.</p>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {members.map((member) => (
                      <div key={member.id} className="ecr-card text-center group">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden group-hover:from-primary group-hover:to-gold-dark transition-all">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              crossOrigin="anonymous"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="font-display text-2xl font-bold text-foreground group-hover:text-primary-foreground transition-colors">
                              {member.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        <h3 className="font-display text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                        {member.designation && (
                          <p className="text-primary font-medium text-sm mb-1">{member.designation}</p>
                        )}
                        {member.qualifications && (
                          <p className="text-xs text-muted-foreground mb-2">{member.qualifications}</p>
                        )}
                        {member.expertise && (
                          <p className="text-sm text-muted-foreground italic">{member.expertise}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </Layout>

    </>
  );
};

export default AcademicCouncil;
