import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const partners = [
  { 
    name: 'Air India', 
    logo: 'https://ecredu.com/wp-content/uploads/2024/12/cropped_image-13-1.webp'
  },
  { 
    name: 'IndiGo', 
    logo: 'https://ecredu.com/wp-content/uploads/2024/12/3ecb2fe1fddff6b2170e68159caee5dc.webp'
  },
  { 
    name: 'SpiceJet', 
    logo: 'https://ecredu.com/wp-content/uploads/2024/12/57b8bb428be2376bad14d271d20103ea.webp'
  },
  { 
    name: 'Vistara', 
    logo: 'https://ecredu.com/wp-content/uploads/2024/12/75ec721c9de74ea28cc05e460028c701.webp'
  },
  { 
    name: 'Emirates', 
    logo: 'https://ecredu.com/wp-content/uploads/2024/12/46274ddc3ef393823a705599036dca38-676c5ab6ad076.webp'
  },
];

const PartnersSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else if (window.innerWidth < 1280) {
        setSlidesPerView(3);
      } else {
        setSlidesPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % partners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length);
  };

  const getVisiblePartners = () => {
    const visible = [];
    for (let i = 0; i < slidesPerView; i++) {
      visible.push(partners[(currentIndex + i) % partners.length]);
    }
    return visible;
  };

  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="ecr-container">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Top Hiring Companies and Partners
        </p>
        <div className="relative">
          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              className="flex-shrink-0 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-hidden">
              <div className="flex gap-6 transition-transform duration-500">
                {getVisiblePartners().map((partner, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 flex items-center justify-center rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-all"
                    style={{
                      width: `calc((100% - ${(slidesPerView - 1) * 24}px) / ${slidesPerView})`,
                      minHeight: '160px',
                    }}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-24 max-w-[90%] object-contain opacity-80 hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextSlide}
              className="flex-shrink-0 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {partners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-8' : 'bg-border w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
