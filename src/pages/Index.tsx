import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import PartnersSection from '@/components/home/PartnersSection';
import StatsSection from '@/components/home/StatsSection';
import AboutSection from '@/components/home/AboutSection';
import CoursesSection from '@/components/home/CoursesSection';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogSection from '@/components/home/BlogSection';
import EnquirySection from '@/components/home/EnquirySection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PartnersSection />
      <StatsSection />
      <AboutSection />
      <CoursesSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <BlogSection />
      <EnquirySection />
    </Layout>
  );
};

export default Index;
