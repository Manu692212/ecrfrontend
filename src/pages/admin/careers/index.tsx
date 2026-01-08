import CareersEditor from "@/components/admin/CareersEditor";

export default function AdminCareersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Careers Page</h1>
        <p className="text-sm text-muted-foreground">
          Manage careers and job-related content shown to visitors.
        </p>
      </div>
      <CareersEditor />
    </div>
  );
}
