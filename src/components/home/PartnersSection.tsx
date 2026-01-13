import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

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
  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="ecr-container">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Top Hiring Companies and Partners
        </p>
        <div className="w-full">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 50,
              },
            }}
          >
            {partners.map((partner, index) => (
              <SwiperSlide key={index}>
                <div className="flex items-center justify-center h-40 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-all group">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-24 max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
