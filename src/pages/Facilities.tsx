import { useEffect, useMemo, useState } from 'react';
import { ImageIcon, MapPinned, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { facilitiesAPI } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const MEDIA_BASE_URL = API_BASE_URL.replace(/\/api$/, '') + '/media';

type FacilityRecord = {
  id: string;
  name: string;
  label?: string;
  description?: string;
  category?: string;
  location?: string;
  order?: number;
  status: 'active' | 'inactive';
  image?: string | null;
};

const resolveFacilityImage = (facility: any) => {
  if (facility?.image_url) {
    return facility.image_url;
  }

  if (facility?.image) {
    const sanitized = String(facility.image).replace(/^\/+/, '');
    return `${MEDIA_BASE_URL}/${sanitized}`;
  }

  return null;
};

const mapFacilitiesResponse = (payload: any): FacilityRecord[] => {
  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : [];

  return rawList.map((item: any, index: number) => ({
    id: String(item?.id ?? `facility-${index}`),
    name: item?.name ?? 'Campus Facility',
    label: item?.label ?? undefined,
    description: item?.description ?? undefined,
    category: item?.category ?? undefined,
    location: item?.location ?? undefined,
    order: typeof item?.order === 'number' ? item.order : undefined,
    status: item?.status === 'inactive' ? 'inactive' : 'active',
    image: resolveFacilityImage(item),
  }));
};

const Facilities = () => {
  const [facilities, setFacilities] = useState<FacilityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFacilities = async () => {
      try {
        setLoading(true);
        const response = await facilitiesAPI.getPublicList();
        if (!isMounted) return;

        const mapped = mapFacilitiesResponse(response);
        setFacilities(mapped);
        setError(null);
      } catch (err) {
        console.error('Failed to load facilities', err);
        if (!isMounted) return;
        setError('Our campus facilities are being refreshed. Please check back shortly.');
        setFacilities([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFacilities();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeFacilities = useMemo(() => {
    return facilities
      .filter((facility) => facility.status === 'active')
      .sort((a, b) => (a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY));
  }, [facilities]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    activeFacilities.forEach((facility) => {
      if (facility.category) {
        unique.add(facility.category);
      }
    });
    return Array.from(unique).slice(0, 12);
  }, [activeFacilities]);

  const highlightStats = useMemo(() => {
    const laboratoryCount = activeFacilities.filter((facility) =>
      (facility.category ?? facility.name).toLowerCase().includes('lab')
    ).length;
    const wellnessCount = activeFacilities.filter((facility) =>
      ['gym', 'fitness', 'sports', 'recreation'].some((keyword) =>
        (facility.category ?? facility.name).toLowerCase().includes(keyword)
      )
    ).length;

    return [
      {
        title: 'Managed Destinations',
        value: activeFacilities.length,
        description: 'Curated facilities designed to elevate learning and campus life.',
      },
      {
        title: 'Innovation Labs',
        value: laboratoryCount,
        description: 'Specialised labs for aviation, hospitality, technology, and healthcare.',
      },
      {
        title: 'Wellness & Sports',
        value: wellnessCount,
        description: 'Spaces focused on health, recreation, and high-performance training.',
      },
    ];
  }, [activeFacilities]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background to-primary/5" />
        <div className="relative ecr-section">
          <div className="ecr-container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                Infrastructure
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                World-Class Facilities, Crafted for Every Journey
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                Explore immersive environments for research, simulation, sports, hospitality, and student life—each
                space carefully designed to inspire growth and collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Metrics */}
      <section className="bg-card">
        <div className="ecr-container py-12">
          <div className="grid gap-6 md:grid-cols-3">
            {highlightStats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-border bg-background/80 p-6 text-center shadow-sm backdrop-blur"
              >
                <Sparkles className="mx-auto mb-4 h-6 w-6 text-primary" />
                <div className="font-display text-4xl font-bold text-foreground">
                  {stat.value.toString().padStart(2, '0')}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{stat.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Showcase */}
      <section className="ecr-section bg-background">
        <div className="ecr-container space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Discover immersive spaces across our campus
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Browse the facilities curated by our administration team via the new Facilities Manager panel. Images
                and descriptions stay in sync with the latest campus developments.
              </p>
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 md:justify-end">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 rounded-3xl border border-border bg-card/60">
                  <div className="h-full w-full animate-pulse rounded-3xl bg-muted/40" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/30 bg-red-50 px-6 py-10 text-center text-red-600">
              {error}
            </div>
          ) : activeFacilities.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card px-6 py-10 text-center text-muted-foreground">
              Facilities will be published here once the administration team adds them in the dashboard.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeFacilities.map((facility) => (
                <article
                  key={facility.id}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-40px_rgba(56,189,248,0.45)]"
                >
                  {facility.image ? (
                    <img
                      src={facility.image}
                      alt={facility.label || facility.name}
                      loading="lazy"
                      className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-56 w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted via-muted/75 to-muted/40 text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-xs uppercase tracking-[0.35em]">Image coming soon</span>
                    </div>
                  )}

                  <div className="space-y-3 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {facility.label || facility.name}
                        </h3>
                        {facility.category && (
                          <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                            {facility.category}
                          </span>
                        )}
                      </div>
                      {facility.location && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          <MapPinned className="h-3.5 w-3.5" />
                          {facility.location}
                        </span>
                      )}
                    </div>
                    {facility.description && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {facility.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Campus Tour CTA */}
      <section className="ecr-section bg-gold-gradient">
        <div className="ecr-container text-center text-primary-foreground space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Want to experience our campus in person?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Schedule a guided campus tour to explore laboratories, hospitality suites, sports arenas, and more. Our
            student ambassadors will curate a personalised walkthrough.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-primary-foreground shadow-lg shadow-primary/40 transition hover:bg-primary/90"
          >
            Book a campus visit
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Facilities;
