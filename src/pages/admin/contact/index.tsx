import ContactEditor from "@/components/admin/ContactEditor";

export default function AdminContactPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact Page</h1>
        <p className="text-sm text-muted-foreground">
          Manage contact details and enquiry content for the website.
        </p>
      </div>
      <ContactEditor />
    </div>
  );
}
