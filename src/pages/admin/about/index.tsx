import AboutEditor from "@/components/admin/AboutEditor";

export default function AdminAboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">About Page</h1>
        <p className="text-sm text-muted-foreground">
          Edit the content that appears on the public About page.
        </p>
      </div>
      <AboutEditor />
    </div>
  );
}
