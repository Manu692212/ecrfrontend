import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { facilitiesAPI } from '@/lib/api';
import { ImageIcon } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const MEDIA_ORIGIN = API_BASE_URL.replace(/\/api$/, '');
const MEDIA_STORAGE_BASE_URL = `${MEDIA_ORIGIN}/storage`;
const MEDIA_MEDIA_BASE_URL = `${MEDIA_ORIGIN}/media`;

type FacilityRecord = {
  id: string;
  name: string;
  label?: string;
  description?: string;
  category?: string;
  image?: string | null;
  order?: number;
  status: 'active' | 'inactive';
};

const buildMediaUrlFromPath = (path: string) => {
  const sanitized = path.replace(/^\/+/, '');
  if (!sanitized) return null;

  if (sanitized.startsWith('storage/')) {
    return `${MEDIA_ORIGIN}/${sanitized}`;
  }

  if (sanitized.startsWith('media/')) {
    return `${MEDIA_ORIGIN}/${sanitized}`;
  }

  return `${MEDIA_STORAGE_BASE_URL}/${sanitized}`;
};

const normalizeFacilityImageUrl = (raw: unknown) => {
  if (!raw) return null;
  const value = String(raw).trim();
  if (!value) return null;

  try {
    const parsed = new URL(value);
    if (['localhost', '127.0.0.1', '::1'].includes(parsed.hostname)) {
      const derivedPath = parsed.pathname.replace(/^\/+/, '');
      return buildMediaUrlFromPath(derivedPath ?? parsed.pathname) ?? null;
    }
    if (parsed.protocol === 'http:') {
      const pathWithParams = `${parsed.pathname}${parsed.search ?? ''}${parsed.hash ?? ''}`;
      return `https://${parsed.host}${pathWithParams}`;
    }
    return parsed.href;
  } catch {
    return buildMediaUrlFromPath(value);
  }
};

const resolveFacilityImage = (facility: any) => {
  return (
    normalizeFacilityImageUrl(facility?.image_url) ?? normalizeFacilityImageUrl(facility?.image)
  );
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
    image: resolveFacilityImage(item),
    order: typeof item?.order === 'number' ? item.order : undefined,
    status: item?.status === 'inactive' ? 'inactive' : 'active',
  }));
};

const FacilitiesSection = () => {
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
        const normalized = mapFacilitiesResponse(response);
        setFacilities(normalized);
        setError(null);
      } catch (err) {
        console.error('Failed to load facilities for home page', err);
        if (!isMounted) return;
        setError('Facilities are currently being refreshed. Please check back soon.');
        setFacilities([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
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

  const featuredFacilities = activeFacilities.slice(0, 6);

  return (
    <section className="relative overflow-hidden py-24 text-primary-foreground">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900" />
      <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-32 -bottom-10 h-72 w-72 rounded-full bg-indigo-500/30 blur-[120px]" />

      <div className="relative z-10">
        <div className="ecr-container space-y-14">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary/90">
                Campus Life
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                Spaces crafted to inspire learning, collaboration, and wellbeing
              </h2>
              <p className="text-base md:text-lg text-white/70">
                From immersive laboratories to restorative wellness hubs, explore the environments that
                empower our students every day.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm text-white/70 md:text-right">
              <p>
                Curated and updated by our campus administration. Highlighted facilities are selected based on
                student engagement and availability.
              </p>
              <Link
                to="/facilities"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-white/10"
              >
                View all facilities
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 rounded-3xl border border-white/10 bg-white/5/10 backdrop-blur-sm"
                >
                  <div className="h-full w-full animate-pulse rounded-3xl bg-white/10" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 px-6 py-10 text-center">
              <p className="font-medium text-red-100">{error}</p>
            </div>
          ) : featuredFacilities.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-white/70">
              Facility spotlights will appear here soon. Check back for new campus experiences.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredFacilities.map((facility) => (
                <article
                  key={facility.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_90px_-40px_rgba(59,130,246,0.65)]"
                >
                  {facility.image ? (
                    <img
                      src={facility.image}
                      alt={facility.label || facility.name}
                      className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-72 w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white/60">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-xs uppercase tracking-[0.35em]">Image coming soon</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    {facility.category && (
                      <span className="mb-3 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
                        {facility.category}
                      </span>
                    )}
                    <h3 className="font-display text-xl font-semibold text-white">
                      {facility.label || facility.name}
                    </h3>
                    {facility.description && (
                      <p className="mt-2 text-sm text-white/70 line-clamp-2">
                        {facility.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
