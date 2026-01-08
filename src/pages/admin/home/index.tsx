import HeroEditor from "@/components/admin/HeroEditor";
import StatsEditor from "@/components/admin/StatsEditor";
import CoursesEditor from "@/components/admin/CoursesEditor";
import TestimonialsEditor from "@/components/admin/TestimonialsEditor";
import BlogEditor from "@/components/admin/BlogEditor";

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Home Page</h1>
        <p className="text-sm text-muted-foreground">
          Manage the main sections that appear on the public home page.
        </p>
      </div>
      <div className="space-y-6">
        <HeroEditor />
        <StatsEditor />
        <CoursesEditor />
        <TestimonialsEditor />
        <BlogEditor />
      </div>
    </div>
  );
}
