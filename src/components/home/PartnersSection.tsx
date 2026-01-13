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
    <section className="py-12 bg-white border-y border-border">
      <div className="ecr-container">
        <p className="text-center text-xl md:text-2xl font-bold text-black mb-8">
          Top Hiring Companies and Partners
        </p>
        <div className="relative">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
            <button
              onClick={prevSlide}
              className="hidden md:flex flex-shrink-0 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              aria-label="Previous partners"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="w-full md:flex-1 overflow-hidden">
              <div 
                className="flex gap-3 md:gap-6 transition-transform duration-500"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  width: `${partners.length * 100}%`,
                }}
              >
                {/* Loop through all partners */}
                {[...partners, ...partners].map((partner, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 flex flex-col items-center justify-center rounded-lg bg-white border border-border hover:border-primary/30 transition-all shadow-sm p-2 md:p-4"
                    style={{
                      width: `${100 / partners.length}%`,
                      minHeight: slidesPerView === 1 ? '120px' : '160px',
                    }}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-12 md:max-h-24 max-w-[80%] md:max-w-[90%] object-contain opacity-80 hover:opacity-100 transition-opacity mb-1 md:mb-2"
                      loading="lazy"
                    />
                    <p className="text-xs md:text-sm font-medium text-center text-gray-700 line-clamp-2">
                      {partner.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextSlide}
              className="hidden md:flex flex-shrink-0 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              aria-label="Next partners"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile carousel controls */}
          <div className="md:hidden flex items-center justify-between mt-4 gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              aria-label="Previous partners"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Carousel indicators - Mobile visible */}
            <div className="flex justify-center gap-2 flex-1">
              {partners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary w-6' : 'bg-border w-2'
                  }`}
                  aria-label={`Go to partner ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              aria-label="Next partners"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Carousel indicators - Desktop only */}
          <div className="hidden md:flex justify-center gap-2 mt-6">
            {partners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-8' : 'bg-border w-2'
                }`}
                aria-label={`Go to partner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
