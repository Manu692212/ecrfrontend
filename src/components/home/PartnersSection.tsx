import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const partners = [
  {
    name: 'Air India',
    logo: 'https://ecredu.com/wp-content/uploads/2024/12/cropped_image-13-1.webp',
  },
  {
    name: 'IndiGo',
    logo: 'https://ecredu.com/wp-content/uploads/2024/12/3ecb2fe1fddff6b2170e68159caee5dc.webp',
  },
  {
    name: 'SpiceJet',
    logo: 'https://ecredu.com/wp-content/uploads/2024/12/57b8bb428be2376bad14d271d20103ea.webp',
  },
  {
    name: 'Vistara',
    logo: 'https://ecredu.com/wp-content/uploads/2024/12/75ec721c9de74ea28cc05e460028c701.webp',
  },
  {
    name: 'Emirates',
    logo: 'https://ecredu.com/wp-content/uploads/2024/12/46274ddc3ef393823a705599036dca38-676c5ab6ad076.webp',
  },
];

const PartnersSection = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const interval = setInterval(() => {
      if (!document.hidden) {
        carouselApi.scrollNext();
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [carouselApi]);

  return (
    <section className="py-12 md:py-16 bg-white border-y border-border">
      <div className="ecr-container">
        <p className="text-center text-xl md:text-2xl font-bold text-black mb-10">
          Top Hiring Companies and Partners
        </p>

        <div className="relative">
          <Carousel
            setApi={setCarouselApi}
            opts={{ loop: true, align: 'start', skipSnaps: false }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4 gap-4 md:gap-6 items-center">
              {partners.map((partner) => (
                <CarouselItem
                  key={partner.name}
                  className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-[22%]"
                >
                  <article className="h-32 md:h-40 rounded-3xl border border-border/80 hover:border-primary/40 bg-white shadow-sm flex flex-col items-center justify-center gap-2 px-4 transition-all duration-300 hover:shadow-lg">
                    <figure className="w-full flex flex-col items-center justify-center gap-2">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-16 md:max-h-24 w-auto object-contain transition-opacity duration-300 opacity-80 hover:opacity-100"
                        loading="lazy"
                      />
                      <figcaption className="text-xs md:text-sm font-medium text-gray-700 text-center line-clamp-2">
                        {partner.name}
                      </figcaption>
                    </figure>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden md:flex bg-white/90 border-border hover:border-primary/40 text-primary shadow-sm" />
            <CarouselNext className="hidden md:flex bg-white/90 border-border hover:border-primary/40 text-primary shadow-sm" />
          </Carousel>

          <div className="mt-6 flex justify-center gap-2 md:hidden" aria-hidden="true">
            {partners.map((partner, index) => (
              <span
                key={partner.name}
                className="h-1.5 w-6 rounded-full bg-primary/20 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
