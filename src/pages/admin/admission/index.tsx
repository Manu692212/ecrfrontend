import AdmissionEditor from "@/components/admin/AdmissionEditor";

export default function AdminAdmissionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admission Page</h1>
        <p className="text-sm text-muted-foreground">
          Edit admission-related information that appears on the site.
        </p>
      </div>
      <AdmissionEditor />
    </div>
  );
}
