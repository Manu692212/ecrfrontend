import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HeroEditor from "@/components/admin/HeroEditor";
import StatsEditor from "@/components/admin/StatsEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import CoursesEditor from "@/components/admin/CoursesEditor";
import TestimonialsEditor from "@/components/admin/TestimonialsEditor";
import BlogEditor from "@/components/admin/BlogEditor";
import AdmissionEditor from "@/components/admin/AdmissionEditor";
import CareersEditor from "@/components/admin/CareersEditor";
import ContactEditor from "@/components/admin/ContactEditor";

export default function ContentStudioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Content Studio</h1>
        <p className="text-sm text-muted-foreground">
          Manage the content for your public website home sections and key pages.
        </p>
      </div>

      <Tabs defaultValue="home-hero" className="space-y-4">
        <TabsList className="flex flex-wrap gap-1">
          <TabsTrigger value="home-hero">Home – Hero</TabsTrigger>
          <TabsTrigger value="home-stats">Home – Stats</TabsTrigger>
          <TabsTrigger value="home-about">Home – About</TabsTrigger>
          <TabsTrigger value="home-courses">Home – Courses</TabsTrigger>
          <TabsTrigger value="home-testimonials">Home – Testimonials</TabsTrigger>
          <TabsTrigger value="home-blog">Home – Blog</TabsTrigger>
          <TabsTrigger value="page-admission">Admission Page</TabsTrigger>
          <TabsTrigger value="page-careers">Careers Page</TabsTrigger>
          <TabsTrigger value="page-contact">Contact Page</TabsTrigger>
        </TabsList>

        <TabsContent value="home-hero">
          <HeroEditor />
        </TabsContent>

        <TabsContent value="home-stats">
          <StatsEditor />
        </TabsContent>

        <TabsContent value="home-about">
          <AboutEditor />
        </TabsContent>

        <TabsContent value="home-courses">
          <CoursesEditor />
        </TabsContent>

        <TabsContent value="home-testimonials">
          <TestimonialsEditor />
        </TabsContent>

        <TabsContent value="home-blog">
          <BlogEditor />
        </TabsContent>

        <TabsContent value="page-admission">
          <AdmissionEditor />
        </TabsContent>

        <TabsContent value="page-careers">
          <CareersEditor />
        </TabsContent>

        <TabsContent value="page-contact">
          <ContactEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
